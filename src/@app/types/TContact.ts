export enum TUserRoles {
  none = '',
  guest = 'guest',
  user = 'user',
  admin = 'admin',
  staff = 'staff',
  instalater = 'instalater',
  obsluha = 'obsluha',
}

export interface TContact {
  id: string;
  name: string;
  avatar: null | string;
  phone: string;
  email: string;
  role: TUserRoles;
  heaters: string[];
  isPaid: boolean;
}
