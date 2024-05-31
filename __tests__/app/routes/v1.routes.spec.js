const request = require('supertest');
const express = require('express');
const router = require('../../../app/routes/v1.routes');

const TagSchema = require('../../../app/models/Tag');

jest.mock('../../../app/models/Tag', () => {
  const mockInstanceSave = jest.fn().mockImplementation(function () {
    return Promise.resolve(this);
  });

  const mockTagSchemaConstructor = jest.fn().mockImplementation(doc => ({
    ...doc,
    save: mockInstanceSave,
  }));

  return {
    __esModule: true,
    default: mockTagSchemaConstructor,
    findOne: jest.fn().mockImplementation(() => ({
      lean: jest.fn().mockResolvedValue({}),
    })),
    findById: jest.fn().mockImplementation(() => ({
      lean: jest.fn().mockResolvedValue({}),
    })),
  };
});

jest.mock('../../../app/utils/helpers', () => ({
  getGAScriptContent: jest.fn().mockReturnValue('script content'),
  getInjectScriptObj: jest
    .fn()
    .mockReturnValue({ tags: [{ _id: 'newScriptId' }] }),
}));

const app = express();
app.use(express.json());

const mockApplications = {
  items: [
    { _id: 'app1', company_id: '1', application: 'Application1' },
    { _id: 'app2', company_id: '2', application: 'Application2' },
  ],
};

app.use((req, res, next) => {
  req.platformClient = {
    configuration: {
      getApplications: jest.fn().mockResolvedValue(mockApplications),
    },
    config: { companyId: '1' },
    application: () => ({
      content: {
        addInjectableTag: jest
          .fn()
          .mockResolvedValue({ tags: [{ _id: 'newScriptId' }] }),
        editInjectableTag: jest.fn().mockResolvedValue({}),
        removeInjectableTag: jest.fn().mockResolvedValue({}),
      },
    }),
  };
  req.fdkSession = {
    company_id: '1',
  };
  next();
});

app.use(router);

describe('Route Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET -> /applications Route', () => {
    it('responds with applications and their configurations', async () => {
      TagSchema.findOne.mockResolvedValue({ ga_id: 'G-A123', enabled: true });

      const response = await request(app).get('/applications');
      expect(response.statusCode).toBe(200);
      expect(response.body.items).toHaveLength(2);
      expect(TagSchema.findOne).toHaveBeenCalledTimes(2);
    });
  });

  describe('GET -> /tag-manager/:application_id Route', () => {
    it('responds with tag configuration for the given application ID', async () => {
      TagSchema.findOne.mockImplementationOnce(() => ({
        lean: jest.fn().mockReturnValue(mockApplications.items[0]),
      }));

      const applicationId = 'app1';
      const response = await request(app).get(`/tag-manager/${applicationId}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockApplications.items[0]);
    });
  });

  describe('PUT -> /tag-manager Route', () => {
    it('updates an existing tag configuration if script_id is provided and tag is enabled', async () => {
      const existingConfig = {
        _id: 'existingId',
        application: 'app1',
        ga_id: 'GA123',
        enabled: true,
        script_id: '12345',
      };
      TagSchema.findById.mockResolvedValue({
        ...existingConfig,
        save: jest.fn().mockResolvedValue({
          ...existingConfig,
          toJSON: jest.fn().mockReturnValue({ ...existingConfig }),
        }),
      });

      const response = await request(app)
        .put('/tag-manager')
        .send({ ...existingConfig });

      expect(response.statusCode).toBe(200);
      expect(response.body.enabled).toBe(true);
    });

    it('create an existing tag configuration if script_id is provided and tag is enabled', async () => {
      const existingConfig = {
        _id: 'existingId',
        application: 'app1',
        ga_id: 'G-A123',
        enabled: true,
      };
      TagSchema.findById.mockResolvedValue({
        ...existingConfig,
        save: jest.fn().mockResolvedValue({
          ...existingConfig,
          toJSON: jest.fn().mockReturnValue({ ...existingConfig }),
        }),
      });

      const response = await request(app)
        .put('/tag-manager')
        .send({ ...existingConfig });

      expect(response.statusCode).toBe(200);
      expect(response.body.enabled).toBe(true);
    });

    it('should remove an existing tag configuration if tag is disabled', async () => {
      const existingConfig = {
        _id: 'existingId',
        application: 'app1',
        ga_id: 'G-A123',
        enabled: false,
        script_id: '12345',
      };
      TagSchema.findById.mockResolvedValue({
        ...existingConfig,
        save: jest.fn().mockResolvedValue({
          ...existingConfig,
          toJSON: jest.fn().mockReturnValue({ ...existingConfig }),
        }),
      });

      const response = await request(app)
        .put('/tag-manager')
        .send({ ...existingConfig });

      expect(response.statusCode).toBe(200);
      expect(response.body.enabled).toBe(false);
    });

    it('returns 404 when the tag configuration is not found', async () => {
      TagSchema.findById.mockResolvedValue(null);

      const nonExistentConfig = {
        _id: 'nonExistentId',
        application: 'app1',
        ga_id: 'GA123',
        enabled: true,
      };
      const response = await request(app)
        .put('/tag-manager')
        .send(nonExistentConfig);

      expect(response.statusCode).toBe(404);
      expect(response.body).toEqual({
        message: 'Config not found',
      });

      expect(TagSchema.findById).toHaveBeenCalledWith(nonExistentConfig._id);
    });

    it('handles errors by logging and passing them to next middleware', async () => {
      TagSchema.findById.mockRejectedValue(new Error('Test error'));

      app.use((error, req, res) => {
        res.status(500).json({ message: 'Internal Server Error' });
      });

      const response = await request(app).put('/tag-manager').send({
        _id: 'nonExistentId',
        application: 'app1',
        ga_id: 'GA123',
        enabled: true,
      });

      expect(response.statusCode).toBe(500);
    });
  });
});
