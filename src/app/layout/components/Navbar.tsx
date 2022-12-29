import Hidden from '@mui/material/Hidden';
import { styled } from '@mui/material/styles';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { useDispatch, useSelector } from 'react-redux';
import { navbarCloseMobile, selectFuseNavbar } from 'app/store/fuse/navbarSlice';
import { selectFuseCurrentLayoutConfig } from 'app/store/fuse/settingsSlice';
import NavbarContent from './NavbarContent';

const navbarWidth = 280;

interface ExtendedMuiStyles {
  theme?: any;
  open: boolean;
  position: string;
}

const StyledNavBar = styled('div')(({ theme, open, position }: ExtendedMuiStyles) => ({
  minWidth: navbarWidth,
  width: navbarWidth,
  maxWidth: navbarWidth,
  ...(!open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(position === 'left' && {
      marginLeft: `-${navbarWidth}px`,
    }),
    ...(position === 'right' && {
      marginRight: `-${navbarWidth}px`,
    }),
  }),
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const StyledNavBarMobile = styled(SwipeableDrawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    minWidth: navbarWidth,
    width: navbarWidth,
    maxWidth: navbarWidth,
  },
}));

const Navbar = () => {
  const dispatch = useDispatch();
  const config = useSelector(selectFuseCurrentLayoutConfig);
  const navbar: any = useSelector(selectFuseNavbar);

  return (
    <>
      <Hidden lgDown>
        <StyledNavBar
          className="flex-col flex-auto sticky top-0 overflow-hidden h-screen shrink-0 z-20 shadow-5"
          open={navbar.open}
          position={config.navbar.position}
        >
          <NavbarContent />
        </StyledNavBar>
      </Hidden>

      <Hidden lgUp>
        <StyledNavBarMobile
          classes={{
            paper: 'flex-col flex-auto h-full',
          }}
          anchor={config.navbar.position}
          variant="temporary"
          open={navbar.mobileOpen}
          onClose={() => dispatch(navbarCloseMobile())}
          onOpen={() => {}}
          disableSwipeToOpen
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          <NavbarContent />
        </StyledNavBarMobile>
      </Hidden>
    </>
  );
};

export default Navbar;
