import settingsConfig from 'app/config/settingsConfig';
import { Navigate } from 'react-router-dom';
import Loading from 'src/@app/core/Loading';
import FuseUtils from 'src/@app/utils';
import { IRoute, TRouteConfig } from '../../@app/types/TRoutes';
import appsConfigs from '../libs/apps/appsConfigs';
import authRoleExamplesConfigs from '../libs/auth/authRoleExamplesConfigs';
import ForgotPasswordConfig from '../libs/auth/forgot-password/ForgotPasswordConfig';
import SignInConfig from '../libs/auth/sign-in/SignInConfig';
import SignOutConfig from '../libs/auth/sign-out/SignOutConfig';
import SignUpConfig from '../libs/auth/sign-up/SignUpConfig';
import pagesConfigs from '../libs/pages/pagesConfigs';
import userInterfaceConfigs from '../libs/user-interface/UserInterfaceConfigs';

const routeConfigs: TRouteConfig[] = [
  ...appsConfigs,
  ...pagesConfigs,
  ...authRoleExamplesConfigs,
  ...userInterfaceConfigs,
  SignOutConfig,
  SignInConfig,
  SignUpConfig,
  ForgotPasswordConfig,
];

const routes: IRoute[] = [
  ...FuseUtils.generateRoutesFromConfigs(routeConfigs, settingsConfig.defaultAuth),
  {
    path: '/',
    element: <Navigate to="systemy" />,
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
