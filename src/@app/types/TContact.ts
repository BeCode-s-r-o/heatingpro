export interface TContact {
  id: string;
  name: string;
  address: string;
  avatar: null | string;
  background: null | string;
  phone: string;
  email: string;
  birthNumber: string;
  role: 'guest' | 'user' | 'admin' | '';
  notes: string;
  heaters: TContactHeater[];
}

export interface TContactHeater {
  heater: string;
  label: string;
  phone: string;
}
