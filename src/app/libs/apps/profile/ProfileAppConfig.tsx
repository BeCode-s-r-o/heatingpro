import { lazy } from 'react';

const ProfileApp = lazy(() => import('./ProfileApp'));

const profileAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: '/profil',
      element: <ProfileApp />,
    },
  ],
};

export default profileAppConfig;
