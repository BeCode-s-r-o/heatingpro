import SplashScreen from '@app/core/SplashScreen';
import { TContact } from '@app/types/TContact';
import { showMessage } from 'app/store/fuse/messageSlice';
import { logoutUser, setUser } from 'app/store/userSlice';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import jwtService from './services/jwtService';

const AuthContext = React.createContext({ isAuthenticated: false });

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [waitAuthCheck, setWaitAuthCheck] = useState<boolean>(true);
  const dispatch = useDispatch();

  useEffect(() => {
    jwtService.on('onAutoLogin', () => {
      dispatch(showMessage({ message: 'Automatické prihlásenie' }));
      setIsAuthenticated(true);
      /**
       * Sign in and retrieve user data with stored token
       */
      jwtService
        .signInWithToken()
        .then((user) => {
          success(user, 'Automatické prihlásenie');
        })
        .catch((error) => {
          pass(error.message);
        });
    });

    jwtService.on('onLogin', (user) => {
      console.log(user);
      setIsAuthenticated(true);
      success(user, 'Boli ste prihlásený');
    });

    jwtService.on('onLogout', () => {
      pass('Boli ste odhlásený');
      //@ts-ignore
      dispatch(logoutUser());
    });

    jwtService.on('onAutoLogout', (message) => {
      pass(message);
      //@ts-ignore
      dispatch(logoutUser());
    });

    jwtService.on('onNoAccessToken', () => {
      pass();
    });

    jwtService.init();

    function success(user, message) {
      if (message) {
        dispatch(showMessage({ message }));
      }

      Promise.all([
        //@ts-ignore
        dispatch(setUser(user)),
        // You can receive data in here before app initialization
      ]).then((values) => {
        setWaitAuthCheck(false);
        setIsAuthenticated(true);
      });
    }

    function pass(message?: string) {
      if (message) {
        dispatch(showMessage({ message }));
      }

      setWaitAuthCheck(false);
      setIsAuthenticated(false);
    }
  }, [dispatch]);

  return waitAuthCheck ? (
    <SplashScreen />
  ) : (
    <AuthContext.Provider value={{ isAuthenticated }}>{children}</AuthContext.Provider>
  );
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
