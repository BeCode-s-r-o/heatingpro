import { settingsConfig } from "@app/configs";
import { themeLayouts } from "@app/layout";
import {
  selectCurrentLanguageDirection,
  selectMainTheme,
  selectUser,
} from "@app/store";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import "@mock-api";
import { SnackbarProvider } from "notistack";
import * as React from "react";
import { useSelector } from "react-redux";
import {
  BrowserRouter,
  FuseAuthorization,
  FuseLayout,
  FuseTheme,
} from "src/@app/core";
import rtlPlugin from "stylis-plugin-rtl";
import { AuthProvider } from "./auth/AuthContext";
import withAppProviders from "./withAppProviders";

// import axios from 'axios';
/**
 * Axios HTTP Request defaults
 */
// axios.defaults.baseURL = "";
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
// axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';

const emotionCacheOptions = {
  rtl: {
    key: "muirtl",
    stylisPlugins: [rtlPlugin],
    insertionPoint: document.getElementById("emotion-insertion-point"),
  },
  ltr: {
    key: "muiltr",
    stylisPlugins: [],
    insertionPoint: document.getElementById("emotion-insertion-point"),
  },
};

const App = () => {
  const user = useSelector(selectUser);
  const langDirection = useSelector(selectCurrentLanguageDirection);
  const mainTheme = useSelector(selectMainTheme);

  return (
    <CacheProvider
      value={createCache(emotionCacheOptions[langDirection] as any)}
    >
      <FuseTheme theme={mainTheme} direction={langDirection}>
        <AuthProvider>
          <BrowserRouter basename={undefined} window={undefined}>
            <FuseAuthorization
              userRole={user.role}
              loginRedirectUrl={settingsConfig.loginRedirectUrl}
            >
              <SnackbarProvider
                maxSnack={5}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                classes={{
                  containerRoot:
                    "bottom-0 right-0 mb-52 md:mb-68 mr-8 lg:mr-80 z-99",
                }}
              >
                <FuseLayout layouts={themeLayouts} />
              </SnackbarProvider>
            </FuseAuthorization>
          </BrowserRouter>
        </AuthProvider>
      </FuseTheme>
    </CacheProvider>
  );
};

export default withAppProviders(App)();
