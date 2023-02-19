/**
 * Authorization Roles
 */
export const authRoles = {
  admin: ['admin'],
  staff: ['admin', 'staff'],
  user: ['admin', 'user'],
  guest: ['admin', 'guest', 'user'],
  onlyUser: ['user'],
  onlyGuest: [],
};
