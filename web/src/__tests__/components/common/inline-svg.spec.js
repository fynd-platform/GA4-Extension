import { mount } from '@vue/test-utils';
import InlineSvg from '../../../components/common/inline-svg.vue';

jest.mock('../../../assets/svgs.js', () => ({
  'icon-name': '<svg>Mocked SVG Content</svg>',
  'updated-icon': '<svg>Updated SVG Content</svg>',
}));

describe('InlineSvg common component test suite', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(InlineSvg, {
      props: { src: 'icon-name' },
    });
  });

  it('Wrapper should exist', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('renders the correct SVG markup based on the src prop', () => {
    expect(wrapper.html()).toContain('<svg>Mocked SVG Content</svg>');
  });

  it('updates the rendered SVG when the src prop changes', async () => {
    await wrapper.setProps({ src: 'updated-icon' });
    await wrapper.vm.$nextTick();
    expect(wrapper.html()).toContain('<svg>Updated SVG Content</svg>');
  });
});
