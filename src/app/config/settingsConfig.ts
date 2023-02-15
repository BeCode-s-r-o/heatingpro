import themesConfig from 'app/config/themesConfig';

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
  defaultAuth: ['admin', 'user', 'guest', 'staff'],
  loginRedirectUrl: '/',
};
