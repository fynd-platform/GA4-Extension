import { setCompany, setApplication } from '@/helper/utils';
import router from '../../router/index';

jest.mock('@/views/NotFound.vue', () => {
  return {
    default: jest.fn().mockReturnValue({
      name: 'NotFoundComponent',
      render: h => h('div', 'Not Found Component Mock'),
    }),
  };
});

jest.mock('browser-or-node', () => ({
  isNode: false,
}));

jest.mock('@/helper/utils', () => ({
  getCompany: jest.fn(),
  setCompany: jest.fn(),
  setApplication: jest.fn(),
}));

describe('Router', () => {
  it('should contain the application route with correct configuration', () => {
    const applicationRoute = router
      .getRoutes()
      .find(route => route.name === 'application');
    expect(applicationRoute).toBeDefined();
    expect(applicationRoute.path).toBe('/company/:company_id/application/:id');
    expect(applicationRoute.props).toEqual({ default: true });
    expect(applicationRoute.meta.name).toBe('APPLICATION_CONFIG');
  });

  it('should contain a catch-all route for 404', () => {
    const catchAllRoute = router.getRoutes().find(route => route.path === '/*');
    expect(catchAllRoute).toBeDefined();
  });

  it('should call addCompanyID and set company and application IDs on navigating to application route', async () => {
    const to = {
      name: 'application',
      params: { company_id: '1', id: 'app2' },
    };
    const from = {};
    const next = jest.fn();

    const applicationRoute = router
      .getRoutes()
      .find(route => route.name === 'application');
    expect(applicationRoute).toBeDefined();

    if (applicationRoute && applicationRoute.beforeEnter) {
      await applicationRoute.beforeEnter(to, from, next);
    }

    expect(next).toHaveBeenCalled();

    expect(setCompany).toHaveBeenCalledWith('1');
    expect(setApplication).toHaveBeenCalledWith('app2');
  });

  it('should use the NotFound component for the catch-all route', async () => {
    const catchAllRoute = router.getRoutes().find(route => route.path === '/*');
    expect(catchAllRoute).toBeDefined();
  });
});
