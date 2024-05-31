import { mount } from '@vue/test-utils';
import { useMeta } from 'vue-meta';
import Main from '@/views/extensions/Main.vue';
import router from '@/router';

jest.mock('vue-meta', () => ({
  useMeta: jest.fn(),
}));

jest.mock('@/helper/utils', () => ({
  getCompanyBasePath: jest.fn(
    () => 'company/13/application/63a0490757475baff6154585'
  ),
  getApplication: jest.fn(() => '63a0490757475baff6154585'),
  getCompany: jest.fn(() => '13'),
}));

describe('Main component Test Suite', () => {
  let wrapper;
  const mockCurrentPath = '/company/13/docs';
  const pushMock = jest.fn();

  beforeEach(() => {
    wrapper = mount(Main, {
      global: {
        mocks: {
          $router: {
            push: pushMock,
          },
          $route: {
            name: 'docs',
            path: mockCurrentPath,
            params: { company_id: '13', id: '63a0490757475baff6154585' },
          },
        },
        stubs: ['router-view', 'inline-svg'],
        plugins: [router],
      },
    });
  });

  it('Wrapper should exist', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('renders and handles click event correctly', async () => {
    await router.isReady();
    expect(wrapper.vm.getCompanyId).toBe('13');
    expect(wrapper.vm.getApplicationId).toBe('63a0490757475baff6154585');
    const backIcon = wrapper.find('.back-icon');
    expect(backIcon.isVisible()).toBe(true);
    await backIcon.trigger('click');
    await wrapper.vm.$nextTick();
    expect(pushMock).toHaveBeenCalledWith({
      name: 'application',
      params: { company_id: '13', id: '63a0490757475baff6154585' },
    });
  });

  it('updates the document title using vue-meta', async () => {
    await router.isReady();
    await wrapper.vm.$nextTick();
    expect(useMeta).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'GA4 Extension' })
    );
  });
});
