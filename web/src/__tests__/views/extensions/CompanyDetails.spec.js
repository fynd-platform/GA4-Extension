import { shallowMount, flushPromises } from '@vue/test-utils';
import { NitrozenToggleBtn, NitrozenInput } from '@gofynd/nitrozen-vue';
import CompanyDetails from '@/views/extensions/CompanyDetails.vue';
import router from '@/router';
import MainService from '@/services/main-service';

jest.mock('@/services/main-service', () => ({
  getTagConfig: jest
    .fn()
    .mockResolvedValue({ data: { enabled: false, ga_id: 'G-1234567' } }),
  saveTagConfig: jest.fn().mockResolvedValue({
    data: {},
  }),
}));

describe('CompanyDetails test suite', () => {
  let wrapper;
  const mockCurrentPath = '/company/1/application/123456';
  const snackbarMock = {
    global: {
      showSuccess: jest.fn(),
      showError: jest.fn(),
    },
  };
  const globalMocks = {
    plugins: [router],
    mocks: {
      $route: {
        params: {
          company_id: '1',
          id: '123456',
          name: 'appName',
        },
        path: mockCurrentPath,
      },
      $snackbar: snackbarMock,
    },
    provide: {
      $root: {
        $emit: jest.fn(),
      },
      $snackbar: {
        global: {
          showSuccess: jest.fn(),
          showError: jest.fn(),
        },
      },
    },
  };

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();

    MainService.saveTagConfig.mockResolvedValue({
      data: {},
    });

    wrapper = shallowMount(CompanyDetails, {
      global: globalMocks,
    });
  });

  it('Wrapper should exist', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('navigates to home on title click', async () => {
    wrapper.vm.companyBaseRootPath = mockCurrentPath;
    await router.isReady();
    wrapper.find('.title:not(.selected)').trigger('click');
    await flushPromises();
    expect(wrapper.vm.$route.path).toBe(mockCurrentPath);
  });

  it('toggles application status and updates initial state', async () => {
    expect(wrapper.vm.application_status).toBe(false);
    await wrapper.findComponent('.pad-right').trigger('click');
    await wrapper.findComponent(NitrozenToggleBtn).vm.$emit('change');
    wrapper
      .findComponent(NitrozenToggleBtn)
      .vm.$emit('update:modelValue', true);
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.application_status).toBe(true);
    expect(wrapper.vm.initialstate).toBe(false);
  });

  it('updates tagConfig.ga_id on nitrozen-input input', async () => {
    expect(wrapper.vm.tagConfig.ga_id).toBe('G-1234567');

    await wrapper.findComponent(NitrozenInput).vm.$emit('input', 'G-TESTING');
    await wrapper
      .findComponent(NitrozenInput)
      .vm.$emit('update:modelValue', 'G-TESTING');
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.tagConfig.ga_id).toBe('G-TESTING');
    expect(wrapper.vm.initialstate).toBe(false);
    expect(wrapper.vm.showGAError).toBe(false);
  });

  it('calls onSave method when Save button is clicked and initialstate is false', async () => {
    expect(wrapper.vm.tagConfig.ga_id).toBe('G-TESTING');
    await wrapper.setData({ initialstate: false });
    await wrapper.find('.save-btn').trigger('click');
    expect(MainService.saveTagConfig).toHaveBeenCalled();
    expect(wrapper.vm.$snackbar.global.showSuccess).toHaveBeenCalledWith(
      'Data saved successfully'
    );
  });

  it('does not call MainService.saveTagConfig when initialstate is true', async () => {
    await wrapper.setData({ initialstate: true });
    await wrapper.find('.save-btn').trigger('click');
    expect(MainService.saveTagConfig).not.toHaveBeenCalled();
  });

  it('handles error from MainService.saveTagConfig correctly', async () => {
    MainService.saveTagConfig.mockRejectedValue(
      new Error('Failed to save data')
    );
    await wrapper.setData({
      initialstate: false,
      tagConfig: { ga_id: 'G-VALID' },
    });
    await wrapper.vm.onSave();
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$snackbar.global.showError).toHaveBeenCalledWith(
      'Failed to save data'
    );
  });

  it('navigates to docs when "click here" is clicked', async () => {
    const pushMock = jest.fn();

    wrapper = shallowMount(CompanyDetails, {
      global: {
        mocks: {
          $router: {
            push: pushMock,
          },
        },
      },
    });

    await wrapper.find('.gotodocs').trigger('click');
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(pushMock).toHaveBeenCalledWith({ name: 'docs' });
  });
});
