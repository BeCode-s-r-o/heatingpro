import { authRoles } from '../auth/authRoles';

const navigationConfig = [
  {
    id: 'dashboards',
    title: 'Hlavné aplikácie',
    subtitle: 'Viditelné len pre administrátora',
    type: 'group',
    icon: 'heroicons-outline:home',
    translate: 'VŠETKY SYSTÉMY',
    auth: authRoles.admin && authRoles.staff && authRoles.instalater,
    children: [
      {
        id: 'dashboards.project',
        title: 'Zoznam kotolní',
        type: 'item',
        icon: 'developer_board',
        url: '/systemy/',
      },
    ],
  },
  {
    id: 'dashboard-user',
    title: 'Vaše aplikácie',
    type: 'group',
    auth: authRoles.onlyUser,
    icon: 'heroicons-outline:home',
    translate: 'VAŠE APLIKÁCIE',

    children: [
      {
        id: 'dashboards.project',
        title: 'Vaše kotolne',
        type: 'item',
        icon: 'developer_board',
        url: '/pouzivatelske-systemy/',
      },

      {
        id: 'dashboards.errors',
        title: 'Alarmy',
        type: 'item',
        icon: 'heroicons-outline:exclamation-circle',
        url: '/pouzivatelske-alarmy/',
      },
    ],
  },
  {
    id: 'apps',
    title: 'Aplikácie',
    subtitle: 'Všetky aplikácie, ktoré ponúka systém',
    type: 'group',
    auth: authRoles.admin,
    icon: 'heroicons-outline:cube',
    children: [
      {
        id: 'apps.contacts',
        title: 'Používatelia',
        type: 'item',
        icon: 'heroicons-outline:user-group',
        url: '/pouzivatelia',
      },
      {
        id: 'apps.calendar',
        title: 'Kalendár',
        type: 'item',
        icon: 'heroicons-outline:calendar',
        url: '/kalendar',
      },
    ],
  },
  // {
  //   id: 'settings',
  //   title: 'Nastavenia',
  //   subtitle: 'Nastavenia aplikácie',
  //   type: 'group',
  //   auth: authRoles.admin,
  //   icon: 'heroicons-outline:document',
  //   children: [
  //     {
  //       id: 'pages.activities',
  //       title: 'Nastavenia',
  //       type: 'item',
  //       icon: 'heroicons-outline:cog',
  //       url: '/nastavenia',
  //     },
  //   ],
  // },
];

export default navigationConfig;
