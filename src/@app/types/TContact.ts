export enum TUserRoles {
  none = '',
  guest = 'guest',
  user = 'user',
  admin = 'admin',
}

export interface TContact {
  id: string;
  name: string;
  avatar: null | string;
  phone: string;
  email: string;
  role: TUserRoles;
}

export interface TContactHeater {
  heater: string;
  label: string;
  phone: string;
}
