/**
 * Authorization Roles
 */
const authRoles = {
  admin: ['admin'],
  user: ['admin', 'user'],
  guest: ['admin', 'guest', 'user'],
  onlyGuest: [],
};

export default authRoles;
