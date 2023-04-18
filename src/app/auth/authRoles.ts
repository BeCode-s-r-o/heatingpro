/**
 * Authorization Roles
 */
export const authRoles = {
  admin: ['admin'],
  instalater: ['admin', 'staff', 'instalater'],
  staff: ['admin', 'staff'],
  allRoles: ['admin', 'staff', 'instalater', 'user', 'obsluha'],
  rolesEnabledAddPeople: ['admin', 'instalater', 'user'],
  kuric: [],
  obsluha: [],
  user: ['admin', 'user'],
  guest: ['admin', 'guest', 'user'],
  onlyUser: ['user'],
  onlyGuest: [],
};
