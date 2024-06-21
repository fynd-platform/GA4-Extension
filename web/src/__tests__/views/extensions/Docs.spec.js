import { shallowMount } from '@vue/test-utils';
import Docs from '@/views/extensions/Docs.vue';

describe('Docs.vue test Suite', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Docs, {
      data() {
        return {
          navigation: [
            {
              link: 'introduction',
              display: 'Introduction',
              content: '<p>Intro content</p>',
            },
            {
              link: 'events',
              display: 'Events',
              content: '<div>Events content</div>',
              children: [
                {
                  link: 'sub-event',
                  display: 'Sub Event',
                  content: '<p>Sub event content</p>',
                },
              ],
            },
          ],
        };
      },
    });
  });

  it('Wrapper should exist', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('renders navigation items correctly', () => {
    expect(wrapper.findAll('.content-block').length).toBe(3); // 2 parents + 1 child
    expect(wrapper.find('#introduction').exists()).toBe(true);
    expect(wrapper.find('#events').exists()).toBe(true);
    expect(wrapper.find('#sub-event').exists()).toBe(true);
  });

  it('injects HTML content correctly', () => {
    const introContent = wrapper.find('#introduction .content-html').html();
    expect(introContent).toContain('<p>Intro content</p>');
  });

  it('has a valid navigation data structure', () => {
    const navigationData = wrapper.vm.navigation;

    navigationData.forEach(navItem => {
      expect(navItem).toHaveProperty('link');
      expect(navItem).toHaveProperty('display');
      expect(navItem).toHaveProperty('content');
      const children = navItem.children || [];
      children.forEach(child => {
        expect(child).toHaveProperty('link');
        expect(child).toHaveProperty('display');
        expect(child).toHaveProperty('content');
      });
    });
  });

  it('renders child navigation items correctly', () => {
    wrapper = shallowMount(Docs, {
      data() {
        return {
          navigation: [
            {
              display: 'Events',
              link: 'events',
              content: '<div>Events content</div>',
              children: [
                {
                  display: 'Product/Item List Views/Impressions',
                  link: 'product-list-view',
                  content: '<div>Product list view content</div>',
                },
              ],
            },
          ],
        };
      },
    });

    expect(wrapper.findAll('.content-block .content-block').length).toBe(1);

    const firstChildContent = wrapper
      .find('#product-list-view .content-html')
      .html();
    expect(firstChildContent).toContain('<div>Product list view content</div>');
  });
});
