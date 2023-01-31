import { TContactHeater, TUserRoles } from './TContact';

export interface TUserState {
  role: string;
  data:
    | {
        id: string;
        name: string;
        avatar: string | null;
        phone: string;
        email: string;
        role: TUserRoles;
      }
    | undefined;
}
