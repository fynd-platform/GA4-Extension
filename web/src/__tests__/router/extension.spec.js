import extensionRoutes from '../../router/extension';

jest.mock('@/views/extensions/Main.vue', () => {
  return {
    default: jest.fn().mockReturnValue({
      name: 'MainComponent',
      render: h => h('div', 'Main Component Mock'),
    }),
  };
});

jest.mock('@/views/extensions/Docs.vue', () => {
  return {
    default: jest.fn().mockReturnValue({
      name: 'DocsComponent',
      render: h => h('div', 'Docs Component Mock'),
    }),
  };
});

describe('Extension Routes', () => {
  it('should define the company-base route with correct configuration', async () => {
    const companyBaseRoute = extensionRoutes.find(
      route => route.name === 'company-base'
    );
    expect(companyBaseRoute).toBeDefined();
    expect(companyBaseRoute.path).toBe('/company/:company_id');
    expect(companyBaseRoute.redirect).toBe('/company/:company_id/docs');

    const componentPromise = companyBaseRoute.component();
    await expect(componentPromise).resolves.toBeDefined();

    expect(companyBaseRoute.children).toBeDefined();
    expect(companyBaseRoute.children.length).toBe(1);
    expect(companyBaseRoute.children[0].name).toBe('docs');
    expect(companyBaseRoute.children[0].path).toBe('docs');

    const docsComponentPromise = companyBaseRoute.children[0].component();
    await expect(docsComponentPromise).resolves.toBeDefined();
  });
});
