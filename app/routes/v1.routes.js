const { Router } = require('express');

const router = Router();
const deepExtend = require('deep-extend');
const { omit } = require('lodash');
const TagSchema = require('../models/Tag');
const { getGAScriptContent, getInjectScriptObj } = require('../utils/helpers');

router.get('/applications', async (req, res, next) => {
  try {
    const {
      platformClient,
      query: { page_size: pageSize = 10, page_no: pageNo = 1 },
    } = req;
    const applications = await platformClient.configuration.getApplications({
      companyId: platformClient.config.companyId,
      pageSize,
      pageNo,
      q: '{"is_active": true}',
    });

    const tagConfigs = await Promise.all(
      applications.items.map(a => TagSchema.findOne({ application: a._id }))
    );

    tagConfigs.forEach((a, index) => {
      applications.items[index].config = a;
    });
    return res.json(applications);
  } catch (err) {
    console.log(err.response);
    return next(err);
  }
});

router.get('/tag-manager/:application_id', async (req, res, next) => {
  try {
    const applicationId = req.params.application_id;
    const config = await TagSchema.findOne({
      company_id: req.fdkSession.company_id.toString(),
      application: applicationId,
    }).lean();
    return res.json(config);
  } catch (err) {
    return next(err);
  }
});

router.put('/tag-manager', async (req, res, next) => {
  try {
    const { platformClient, body } = req;
    body.company_id = req.fdkSession.company_id;
    let tagConfig = null;
    if (!body._id) {
      tagConfig = await new TagSchema(body).save();
    } else {
      tagConfig = await TagSchema.findById(body._id);
    }
    if (!tagConfig) {
      return res.status(404).json({
        message: 'Config not found',
      });
    }
    const contentClient = platformClient.application(body.application).content;
    deepExtend(
      tagConfig,
      omit(body, ['script_id', 'application', 'company_id'])
    );
    let scriptContent = getGAScriptContent(tagConfig.ga_id);
    scriptContent = Buffer.from(scriptContent).toString('base64');
    const reqBody = getInjectScriptObj('ga4', scriptContent);
    if (tagConfig.enabled) {
      if (!tagConfig.script_id) {
        let response = null;
        response = await contentClient.addInjectableTag({
          body: reqBody,
        });
        tagConfig.script_id = response.tags[response.tags.length - 1]._id; // save injected script id for update
      } else {
        await contentClient.editInjectableTag({
          tagId: tagConfig.script_id.toString(),
          body: {
            tag: reqBody.tags[0],
          },
        });
      }
    } else if (tagConfig.script_id) {
      await contentClient.removeInjectableTag({
        body: {
          tags: [tagConfig.script_id.toString()],
        },
      });
      tagConfig.script_id = undefined;
    }
    const response = await tagConfig.save();
    return res.json(response.toJSON());
  } catch (error) {
    console.log(error);
    return next(error);
  }
});

module.exports = router;
