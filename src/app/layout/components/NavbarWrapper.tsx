import { ThemeProvider } from '@mui/material/styles';
import { selectFuseNavbar } from 'app/store/fuse/navbarSlice';
import { selectFuseCurrentLayoutConfig, selectNavbarTheme } from 'app/store/fuse/settingsSlice';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import NavbarToggleFab from '../shared/NavbarToggleFab';
import Navbar from './Navbar';

function NavbarWrapper() {
  const config = useSelector(selectFuseCurrentLayoutConfig);
  const navbar: any = useSelector(selectFuseNavbar);
  const navbarTheme = useSelector(selectNavbarTheme);

  return (
    <>
      <ThemeProvider theme={navbarTheme}>
        <Navbar />
      </ThemeProvider>
      {config.navbar.display && !config.toolbar.display && !navbar.open && <NavbarToggleFab />}
    </>
  );
}

export default memo(NavbarWrapper);
