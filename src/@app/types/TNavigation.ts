import { TRouteAuth } from './TRoutes';

export interface TNavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group' | 'divider' | 'heading';
  icon?: string | false;
  url?: string;
  auth?: TRouteAuth[] | null;
  badge?: {
    title: string;
    bg: string;
    fg: string;
  };
  children?: TNavigationItem[];
}
