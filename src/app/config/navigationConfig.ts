import { authRoles } from '../auth/authRoles';

const navigationConfig = [
  {
    id: 'dashboards',
    title: 'Hlavné aplikácie',
    subtitle: 'Viditelné len pre administrátora',
    type: 'group',
    icon: 'heroicons-outline:home',
    translate: 'VŠETKY SYSTÉMY',
    auth: authRoles.admin,
    children: [
      {
        id: 'dashboards.project',
        title: 'Zoznam bojlerov',
        type: 'item',
        icon: 'developer_board',
        url: '/systemy/',
      },

      {
        id: 'dashboards.errors',
        title: 'Alarmy',
        type: 'item',
        badge: {
          title: '2',
          classes: 'px-8 bg-red-600 text-white rounded-full',
        },
        icon: 'heroicons-outline:exclamation-circle',
        url: '/alarmy',
      },
      // {
      //   id: 'dashboards.analytics',
      //   title: 'Štatistiky',
      //   type: 'item',
      //   icon: 'heroicons-outline:chart-pie',
      //   url: '/statistiky',
      // },
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
        title: 'Vaše bojlery',
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
        badge: {
          title: '1',
          classes: 'px-8 bg-red-600 text-white rounded-full',
        },
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
        // subtitle: '3 upcoming events',
        type: 'item',
        icon: 'heroicons-outline:calendar',
        url: '/kalendar',
      },
    ],
  },
  {
    id: 'settings',
    title: 'Nastavenia',
    subtitle: 'Nastavenia aplikácie',
    type: 'group',
    auth: authRoles.admin,
    icon: 'heroicons-outline:document',
    children: [
      {
        id: 'pages.activities',
        title: 'Nastavenia',
        type: 'item',
        icon: 'heroicons-outline:cog',
        url: '/nastavenia',
      },
    ],
  },
  // {
  //   id: 'pages',
  //   title: 'Budúce stránky',
  //   auth: authRoles.admin,
  //   subtitle: 'Tieto stránky budú pridané v budúcnosti',
  //   type: 'group',
  //   icon: 'heroicons-outline:document',
  //   children: [
  //     {
  //       id: 'pages.invoice',
  //       title: 'Faktúry',
  //       type: 'item',
  //       url: '/pages/invoice/printable/modern',
  //       icon: 'heroicons-outline:calculator',
  //     },
  //     {
  //       id: 'pages.pricing',
  //       title: 'Cenník',
  //       type: 'item',
  //       icon: 'heroicons-outline:cash',
  //       url: '/pages/pricing/simple',
  //     },
  //     {
  //       id: 'apps.file-manager',
  //       title: 'Súbory',
  //       type: 'item',
  //       icon: 'heroicons-outline:cloud',
  //       url: '/apps/file-manager',
  //       end: true,
  //     },
  //   ],
  // },
];

export default navigationConfig;
