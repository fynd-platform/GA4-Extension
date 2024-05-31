import { shallowMount } from '@vue/test-utils';
import { useMeta } from 'vue-meta';
import App from '../App.vue';

jest.mock('vue-meta', () => ({
  useMeta: jest.fn(),
}));

describe('App component test suite', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(App);
  });

  it('Wrapper should exist', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('calls useMeta with correct parameters on setup', () => {
    expect(useMeta).toHaveBeenCalledWith({
      title: 'GA4 Extension',
      htmlAttrs: { lang: 'en', amp: true },
    });
  });
});
