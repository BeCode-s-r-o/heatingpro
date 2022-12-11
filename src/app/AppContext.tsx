import { createContext } from "react";
import { RouteObject } from "react-router-dom";

type ExtendedRouteObject = RouteObject & {
  settings?: any;
};

interface AppContextProps {
  routes: ExtendedRouteObject[];
}

export const AppContext = createContext<AppContextProps>({
  routes: [],
});
