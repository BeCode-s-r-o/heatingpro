import { TContact, TUserRoles } from './TContact';

export interface TUserState {
  role: string;
  data: TContact | undefined;
}
