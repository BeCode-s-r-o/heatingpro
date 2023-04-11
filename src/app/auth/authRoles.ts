/**
 * Authorization Roles
 */
export const authRoles = {
  admin: ['admin'],
  instalater: ['admin', 'staff', 'instalater'],
  staff: ['admin', 'staff'],
  user: ['admin', 'user'],
  guest: ['admin', 'guest', 'user'],
  onlyUser: ['user'],
  onlyGuest: [],
};
