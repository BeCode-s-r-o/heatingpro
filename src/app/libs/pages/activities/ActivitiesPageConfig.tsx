import { lazy } from 'react';

const ActivitiesPage = lazy(() => import('./ActivitiesPage'));
const ContactView = lazy(() => import('../contacts/contact/ContactView'));

const activitiesPageConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: '/nastavenia',
      element: <ActivitiesPage />,
    },
    {
      path: '/kontakt',
      element: <ContactView />,
    },
  ],
};

export default activitiesPageConfig;
