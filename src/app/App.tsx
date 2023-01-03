import FuseAuthorization from '@app/core/Authorization';
import FuseTheme from '@app/core/Theme';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import '@mock-api';
import { selectMainTheme } from 'app/store/fuse/settingsSlice';
import { selectUser } from 'app/store/userSlice';
import { SnackbarProvider } from 'notistack';
import { useSelector } from 'react-redux';
import BrowserRouter from 'src/@app/core/BrowserRouter';
import { Layout } from 'src/@app/core/Layout';
import settingsConfig from 'src/app/config/settingsConfig';
import { AuthProvider } from './auth/AuthContext';
import withAppProviders from './withAppProviders';

const emotionCacheOption = {
  key: 'muiltr',
  stylisPlugins: [],
  insertionPoint: document.getElementById('emotion-insertion-point') ?? undefined,
};

const App = () => {
  const user: any = useSelector(selectUser);
  const mainTheme = useSelector(selectMainTheme);

  return (
    <CacheProvider value={createCache(emotionCacheOption)}>
      <FuseTheme theme={mainTheme} direction={'ltg'}>
        <AuthProvider>
          <BrowserRouter>
            <FuseAuthorization userRole={user.role} loginRedirectUrl={settingsConfig.loginRedirectUrl}>
              <SnackbarProvider
                maxSnack={5}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                classes={{
                  containerRoot: 'bottom-0 right-0 mb-52 md:mb-68 mr-8 lg:mr-80 z-99',
                }}
              >
                <Layout />
              </SnackbarProvider>
            </FuseAuthorization>
          </BrowserRouter>
        </AuthProvider>
      </FuseTheme>
    </CacheProvider>
  );
};

export default withAppProviders(App)();
