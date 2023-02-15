/**
 * Authorization Roles
 */
export const authRoles = {
  admin: ['admin'],
  user: ['admin', 'user'],
  staff: ['admin', 'staff'],
  guest: ['admin', 'guest', 'user'],
  onlyUser: ['user'],
  onlyGuest: [],
};
