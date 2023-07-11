import { authRoles } from '../auth/authRoles';

const navigationConfig = [
  {
    id: 'dashboards',
    title: 'Hlavné aplikácie',
    subtitle: 'Viditelné len pre administrátora',
    type: 'group',
    icon: 'heroicons-outline:home',
    translate: 'VŠETKY SYSTÉMY',
    auth: authRoles.allRoles,
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
    id: 'apps',
    title: 'Správa používateľov',
    subtitle: 'Viditelné len pre administrátora',
    type: 'group',
    auth: authRoles.rolesEnabledAddPeople,
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
        auth: authRoles.none,
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
];

export default navigationConfig;
