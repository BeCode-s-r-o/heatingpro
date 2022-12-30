import GlobalStyles from '@mui/material/GlobalStyles';
import { alpha } from '@mui/material/styles';
import { memo, useState } from 'react';
import { useSelector } from 'react-redux';
import Layout from '../../../app/layout/Layout';
import MaintenancePage from './MaintenancePage';
import { selectUser } from 'app/store/userSlice';

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
