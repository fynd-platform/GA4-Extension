import { mount } from '@vue/test-utils';
import Loader from '../../../components/common/loader.vue';

describe('Loader component Test Suite', () => {
  it('shows loader when isLoading is true', async () => {
    const wrapper = mount(Loader, {
      props: {
        isLoading: true,
        helperText: '',
      },
    });
    expect(wrapper.find('.loading').isVisible()).toBe(true);
  });

  it('hides loader when isLoading is false', async () => {
    const wrapper = mount(Loader, {
      props: {
        isLoading: false,
        helperText: '',
      },
    });
    expect(wrapper.find('.loading').exists()).toBe(false);
  });

  it('displays helperText when provided', async () => {
    const helperText = 'Loading your content...';
    const wrapper = mount(Loader, {
      props: {
        isLoading: true,
        helperText,
      },
    });
    expect(wrapper.text()).toContain(helperText);
  });
});
