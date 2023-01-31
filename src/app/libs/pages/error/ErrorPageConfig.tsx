import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const Error404Page = lazy(() => import('./Error404Page'));

const ErrorPagesConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: '',
      element: <Error404Page />,
    },
  ],
};

export default ErrorPagesConfig;
