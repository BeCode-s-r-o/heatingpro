import _ from '@lodash';
import GlobalStyles from '@mui/material/GlobalStyles';
import { alpha } from '@mui/material/styles';
import AppContext from 'app/AppContext';
import {
  generateSettings,
  selectFuseCurrentSettings,
  selectFuseDefaultSettings,
  setSettings,
} from 'app/store/fuse/settingsSlice';
import { selectUser } from 'app/store/userSlice';
import { memo, useCallback, useContext, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { matchRoutes, useLocation } from 'react-router-dom';
import { useDeepCompareEffect } from 'src/@app/hooks';
import Layout from '../../../app/layout/Layout';
import MaintenancePage from './MaintenancePage';

const inputGlobalStyles = (
  <GlobalStyles
    styles={(theme) => ({
      html: {
        backgroundColor: `${theme.palette.background.default}!important`,
        color: `${theme.palette.text.primary}!important`,
      },
      body: {
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      },
      'table.simple tbody tr th': {
        borderColor: theme.palette.divider,
      },
      'table.simple thead tr th': {
        borderColor: theme.palette.divider,
      },
      'a:not([role=button]):not(.MuiButtonBase-root)': {
        color: theme.palette.secondary.main,
        textDecoration: 'underline',
        '&:hover': {},
      },
      'a.link, a:not([role=button])[target=_blank]': {
        background: alpha(theme.palette.secondary.main, 0.2),
        color: 'inherit',
        borderBottom: `1px solid ${theme.palette.divider}`,
        textDecoration: 'none',
        '&:hover': {
          background: alpha(theme.palette.secondary.main, 0.3),
          textDecoration: 'none',
        },
      },
      '[class^="border"]': {
        borderColor: theme.palette.divider,
      },
      '[class*="border"]': {
        borderColor: theme.palette.divider,
      },
      '[class*="divide-"] > :not([hidden]) ~ :not([hidden])': {
        borderColor: theme.palette.divider,
      },
      hr: {
        borderColor: theme.palette.divider,
      },

      '::-webkit-scrollbar-thumb': {
        boxShadow: `inset 0 0 0 20px ${
          theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.24)' : 'rgba(255, 255, 255, 0.24)'
        }`,
      },
      '::-webkit-scrollbar-thumb:active': {
        boxShadow: `inset 0 0 0 20px ${
          theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.37)' : 'rgba(255, 255, 255, 0.37)'
        }`,
      },
    })}
  />
);

const MainLayout = () => {
  const dispatch = useDispatch();
  const settings = useSelector(selectFuseCurrentSettings);
  const defaultSettings = useSelector(selectFuseDefaultSettings);

  const appContext: any = useContext(AppContext);
  const routes = appContext.routes || [];

  const location = useLocation();
  const { pathname } = location;

  const matchedRoutes = matchRoutes(routes, pathname);
  const matched = matchedRoutes ? matchedRoutes[0] : false;

  const newSettings = useRef(null);

  const shouldAwaitRender = useCallback(() => {
    let _newSettings;
    //@ts-ignore
    if (matched && matched.route.settings) {
      //@ts-ignore
      const routeSettings = matched.route.settings;
      _newSettings = generateSettings(defaultSettings, routeSettings);
    } else if (!_.isEqual(newSettings.current, defaultSettings)) {
      _newSettings = _.merge({}, defaultSettings);
    } else {
      _newSettings = newSettings.current;
    }
    if (!_.isEqual(newSettings.current, _newSettings)) {
      newSettings.current = _newSettings;
    }
  }, [defaultSettings, matched]);

  shouldAwaitRender();

  useDeepCompareEffect(() => {
    if (!_.isEqual(newSettings.current, settings)) {
      dispatch(setSettings(newSettings.current));
    }
  }, [dispatch, newSettings.current, settings]);

  const user: any = useSelector(selectUser);

  //TODO - add maintanance from backend
  const [maintenanceMode, setMaintenanceMoce] = useState(false);

  if (maintenanceMode && user.role !== 'admin') {
    return <MaintenancePage />;
  }
  return (
    <>
      {inputGlobalStyles}
      <Layout />
    </>
  );
};

export default memo(MainLayout);
