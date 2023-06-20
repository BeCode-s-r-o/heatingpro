import themesConfig from 'app/config/themesConfig';
import { authRoles } from '../auth/authRoles';

export const settingsConfig = {
  layout: {
    style: 'layout1',
    config: {},
  },
  customScrollbars: true,
  direction: 'ltr',
  theme: {
    main: themesConfig.default,
    navbar: themesConfig.defaultDark,
    toolbar: themesConfig.default,
    footer: themesConfig.defaultDark,
  },
  defaultAuth: authRoles.allRoles,
  loginRedirectUrl: '/',
};
