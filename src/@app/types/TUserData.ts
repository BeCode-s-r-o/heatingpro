import { TContactHeater } from './TContact';

export interface TUserData {
  role: string[];
  data: {
    displayName: string;
    photoURL: string;
    shortcuts: string[];
    id: string;
    name: string;
    address: string;
    avatar: string | null;
    background: string | null;
    phone: string;
    email: string;
    birthNumber: string;
    role: 'guest' | 'user' | 'admin' | '';
    notes: string;
    heaters: TContactHeater[];
  };
}
