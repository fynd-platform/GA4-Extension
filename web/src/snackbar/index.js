import NitrozenSnackbar from '@gofynd/nitrozen-vue/src/components/NSnackbar';

const NitrozenVuePlugin = {
  install: app => {
    // Register Snackbar
    app.use(NitrozenSnackbar);
    app.config.globalProperties.$snackbar.register('show', message => message, {
      position: 'top-center',
      duration: 2000,
    });
    app.config.globalProperties.$snackbar.register(
      'showSuccess',
      message => message,
      {
        position: 'top-center',
        duration: 2000,
        type: 'success',
      }
    );
    app.config.globalProperties.$snackbar.register(
      'showError',
      message => message,
      {
        position: 'top-center',
        duration: 2000,
        type: 'error',
      }
    );
    app.config.globalProperties.$snackbar.register(
      'showWarning',
      message => message,
      {
        position: 'top-center',
        duration: 2000,
        type: 'warning',
      }
    );
  },
};

export default NitrozenVuePlugin;
