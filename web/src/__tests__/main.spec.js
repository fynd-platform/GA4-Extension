jest.mock('vue-meta', () => ({
  createMetaManager: jest.fn(() => ({})),
}));

jest.mock('../snackbar', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('Application Initialization in Main.js', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should initializes vue-meta and NitrozenVuePlugin while initializing the app', () => {
    require('../main');

    const { createMetaManager } = require('vue-meta');
    const NitrozenVuePlugin = require('../snackbar').default;

    expect(createMetaManager).toHaveBeenCalled();
    expect(NitrozenVuePlugin).toHaveBeenCalled();
  });
});
