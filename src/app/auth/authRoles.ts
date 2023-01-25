/**
 * Authorization Roles
 */
export const authRoles = {
  admin: ['admin'],
  user: ['admin', 'user'],
  guest: ['admin', 'guest', 'user'],
  onlyUser: ['user'],
  onlyGuest: [],
};
