export interface TRouteConfig {
  settings: TRouteSettings;
  auth: TRouteAuth[];
  routes: TRoute[];
}

export interface TRoute {
  path: string;
  element: JSX.Element;
  auth?: TRouteAuth[];
}

export interface TRouteAuth {
  path: 'guest' | 'user' | 'admin' | '';
}

interface TRouteSettings {
  layout: {
    config: {
      navbar: {
        display: boolean;
      };
      toolbar: {
        display: boolean;
      };
      footer: {
        display: boolean;
      };
      leftSidePanel: {
        display: boolean;
      };
      rightSidePanel: {
        display: boolean;
      };
    };
  };
}
