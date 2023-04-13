import SplashScreen from '@app/core/SplashScreen';
import { showMessage } from 'app/store/slices/messageSlice';
import { logoutUser, setUser } from 'app/store/userSlice';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { authInstance } from './jwtService';

const AuthContext = React.createContext({ isAuthenticated: false });

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [waitAuthCheck, setWaitAuthCheck] = useState<boolean>(true);
  const dispatch = useDispatch();

  useEffect(() => {
    authInstance.on('onAutoLogin', () => {
      dispatch(showMessage({ message: 'Prihaslujem...' }));
      setIsAuthenticated(true);

      authInstance
        .signInWithToken()
        .then((user) => {
          success(user, 'Prihaslujem...');
        })
        .catch((error) => {
          pass(error.message);
        });
    });

    authInstance.on('onLogin', (user) => {
      setIsAuthenticated(true);
      success(user, 'Boli ste prihlásený');
    });

    authInstance.on('onLogout', () => {
      pass('Boli ste odhlásený');
      //@ts-ignore
      dispatch(logoutUser());
    });

    authInstance.on('onAutoLogout', (message) => {
      pass(message);
      //@ts-ignore
      dispatch(logoutUser());
    });

    authInstance.on('onNoAccessToken', () => {
      pass();
    });

    authInstance.init();

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
