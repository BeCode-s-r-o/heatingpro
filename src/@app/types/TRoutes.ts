export interface TRouteConfig {
  settings: TRouteSettings;
  auth?: TRouteAuth[];
  routes: IRoute[];
}

export interface IRoute {
  path: string;
  element?: JSX.Element;
  auth?: TRouteAuth[];
  children?: IRoute[];
}

export type TRouteAuth = {
  path: 'guest' | 'user' | 'admin' | '';
};

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

type TSettings = {
  layout: {
    config: {};
  };
};

export interface ISingleRouteConfig {
  settings?: TSettings;
  routes: IRoute[];
}

export type TSingleRouteConfigArray = ISingleRouteConfig[];
