import { settingsConfig } from 'app/config/settingsConfig';
import { Navigate } from 'react-router-dom';
import Loading from 'src/@app/core/Loading';
import FuseUtils from 'src/@app/utils';
import { IRoute, ISingleRouteConfig } from '../../@app/types/TRoutes';
import appsConfigs from '../libs/apps/appsConfigs';
import ForgotPasswordConfig from '../libs/auth/forgot-password/ForgotPasswordConfig';
import SignInConfig from '../libs/auth/sign-in/SignInConfig';
import SignOutConfig from '../libs/auth/sign-out/SignOutConfig';
import SignUpConfig from '../libs/auth/sign-up/SignUpConfig';
import pagesConfigs from '../libs/pages/pagesConfigs';

const routeConfigs: ISingleRouteConfig[] = [
  ...appsConfigs,
  ...pagesConfigs,
  SignOutConfig,
  SignInConfig,
  SignUpConfig,
  ForgotPasswordConfig,
];

const routes = [
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
    element: <Navigate to="/404" />,
  },
];

export default routes;
