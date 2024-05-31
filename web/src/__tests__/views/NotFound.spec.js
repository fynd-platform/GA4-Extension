import { mount } from '@vue/test-utils';
import NotFound from '@/views/NotFound.vue';

describe('NotFound.vue test Suite', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(NotFound);
  });

  it('Wrapper should exist', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("Should have 'Page Not Found' text in h1 tag", () => {
    expect(wrapper.html()).toContain('<h1>Page Not Found</h1>');
  });
});
