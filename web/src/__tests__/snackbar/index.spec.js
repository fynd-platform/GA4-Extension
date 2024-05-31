/* eslint-disable no-undef */
import { createApp } from 'vue';
import NitrozenVuePlugin from '../../snackbar/index';

describe('Snackbar NitrozenVuePlugin Tets Suite', () => {
  const app = createApp({});
  const testMessage = 'Test message';

  beforeEach(() => {
    app.config.globalProperties.$snackbar = {
      global: {
        show: jest.fn(),
        showSuccess: jest.fn(),
        showError: jest.fn(),
        showWarning: jest.fn(),
        register: jest.fn(),
      },
    };

    app.use(NitrozenVuePlugin);
  });

  it('initializes $snackbar object', () => {
    expect(app.config.globalProperties.$snackbar).toBeDefined();
  });

  it('registers snackbar methods with default options', () => {
    jest
      .spyOn(app.config.globalProperties.$snackbar.global, 'showSuccess')
      .mockImplementation(() => {});

    app.config.globalProperties.$snackbar.global.showSuccess(testMessage);
    expect(
      app.config.globalProperties.$snackbar.global.showSuccess
    ).toHaveBeenCalledWith(testMessage);
  });

  it('Should show the normal snackbar after executing the show registered method', () => {
    const newApp = createApp({});

    newApp.config.globalProperties.$snackbar = {
      global: {
        show: jest.fn(),
        showSuccess: jest.fn(),
        showError: jest.fn(),
        showWarning: jest.fn(),
        register: jest.fn((name, callback) => {
          newApp.config.globalProperties.$snackbar.global[name] = callback;
        }),
      },
    };
    newApp.use(NitrozenVuePlugin);

    document.body.innerHTML = '';

    newApp.config.globalProperties.$snackbar.global.show(testMessage);
    setTimeout(() => {
      const snackbarDiv = document.querySelector(
        '.nitrozen-snackbar.nitrozen-snackbar-primary'
      );
      expect(snackbarDiv).not.toBeNull();
      expect(snackbarDiv.textContent).toBe(testMessage);
      done();
    }, 0);
  });

  it('Should show the showSuccess snackbar after executing the showSuccess registered method', () => {
    const newApp = createApp({});

    newApp.config.globalProperties.$snackbar = {
      global: {
        show: jest.fn(),
        showSuccess: jest.fn(),
        showError: jest.fn(),
        showWarning: jest.fn(),
        register: jest.fn((name, callback) => {
          newApp.config.globalProperties.$snackbar.global[name] = callback;
        }),
      },
    };
    newApp.use(NitrozenVuePlugin);
    document.body.innerHTML = '';

    newApp.config.globalProperties.$snackbar.global.showSuccess(testMessage);

    setTimeout(() => {
      const snackbarDiv = document.querySelector(
        '.nitrozen-snackbar.nitrozen-snackbar-primary'
      );
      expect(snackbarDiv).not.toBeNull();
      expect(snackbarDiv.textContent).toBe(testMessage);
      done();
    }, 0);
  });

  it('Should show the showError snackbar after executing the showError registered method', () => {
    const newApp = createApp({});

    newApp.config.globalProperties.$snackbar = {
      global: {
        show: jest.fn(),
        showSuccess: jest.fn(),
        showError: jest.fn(),
        showWarning: jest.fn(),
        register: jest.fn((name, callback) => {
          newApp.config.globalProperties.$snackbar.global[name] = callback;
        }),
      },
    };
    newApp.use(NitrozenVuePlugin);

    document.body.innerHTML = '';
    newApp.config.globalProperties.$snackbar.global.showError(testMessage);
    setTimeout(() => {
      const snackbarDiv = document.querySelector(
        '.nitrozen-snackbar.nitrozen-snackbar-primary'
      );
      expect(snackbarDiv).not.toBeNull();
      expect(snackbarDiv.textContent).toBe(testMessage);
      done();
    }, 0);
  });

  it('Should show the showWarning snackbar after executing the showWarning registered method', () => {
    const newApp = createApp({});

    newApp.config.globalProperties.$snackbar = {
      global: {
        show: jest.fn(),
        showSuccess: jest.fn(),
        showError: jest.fn(),
        showWarning: jest.fn(),
        register: jest.fn((name, callback) => {
          newApp.config.globalProperties.$snackbar.global[name] = callback;
        }),
      },
    };
    newApp.use(NitrozenVuePlugin);
    document.body.innerHTML = '';

    newApp.config.globalProperties.$snackbar.global.showWarning(testMessage);

    setTimeout(() => {
      const snackbarDiv = document.querySelector(
        '.nitrozen-snackbar.nitrozen-snackbar-primary'
      );
      expect(snackbarDiv).not.toBeNull();
      expect(snackbarDiv.textContent).toBe(testMessage);
      done();
    }, 0);
  });
});
