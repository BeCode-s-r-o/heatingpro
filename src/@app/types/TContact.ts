export enum TUserRoles {
  none = '',
  guest = 'guest',
  user = 'user',
  admin = 'admin',
  staff = 'staff',
}

export interface TContact {
  id: string;
  name: string;
  avatar: null | string;
  phone: string;
  email: string;
  role: TUserRoles;
  heaters: TContactHeater[];
}

export interface TContactHeater {
  heater: string;
  label: string;
  phone: string;
}
