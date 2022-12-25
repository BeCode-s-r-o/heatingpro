import FuseUtils from '@fuse/utils';
import Loading from '@fuse/core/Loading';
import { Navigate } from 'react-router-dom';
import settingsConfig from 'app/configs/settingsConfig';
import userInterfaceConfigs from '../main/user-interface/UserInterfaceConfigs';
import SignInConfig from '../main/sign-in/SignInConfig';
import SignUpConfig from '../main/sign-up/SignUpConfig';
import SignOutConfig from '../main/sign-out/SignOutConfig';
import ForgotPasswordConfig from '../main/forgot-password/ForgotPasswordConfig';
import dashboardsConfigs from '../main/dashboards/dashboardsConfigs';
import appsConfigs from '../main/apps/appsConfigs';
import pagesConfigs from '../main/pages/pagesConfigs';
import authRoleExamplesConfigs from '../main/auth/authRoleExamplesConfigs';
import DocumentationConfig from '../main/documentation/DocumentationConfig';
import { TRoute, TRouteConfig } from '../types/TRoutes';

const routeConfigs: TRouteConfig[] = [
  ...appsConfigs,
  ...dashboardsConfigs,
  ...pagesConfigs,
  ...authRoleExamplesConfigs,
  ...userInterfaceConfigs,
  DocumentationConfig,
  SignOutConfig,
  SignInConfig,
  SignUpConfig,
  ForgotPasswordConfig,
];

const routes: TRoute[] = [
  ...FuseUtils.generateRoutesFromConfigs(routeConfigs, settingsConfig.defaultAuth),
  {
    path: '/',
    element: <Navigate to="dashboards/analytics" />,
    auth: settingsConfig.defaultAuth,
  },
  {
    path: 'loading',
    element: <Loading />,
  },
  {
    path: '*',
    element: <Navigate to="pages/error/404" />,
  },
];

export default routes;
