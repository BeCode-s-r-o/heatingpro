import { lazy } from 'react';
import ContactView from './contact/ContactView';
import ContactForm from './contact/ContactForm';
import NewContactForm from './contact/NewContactForm';

const ContactsApp = lazy(() => import('./ContactsApp'));

const ContactsAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: '/pouzivatelia',
      element: <ContactsApp />,
      children: [
        {
          path: ':id',
          element: <ContactView />,
        },
        {
          path: ':id/edit',
          element: <ContactForm />,
        },
      ],
    },
    {
      path: '/novy-pouzivatel',
      element: <NewContactForm />,
    },
  ],
};

export default ContactsAppConfig;
