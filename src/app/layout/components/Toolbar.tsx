import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Typography } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Hidden from '@mui/material/Hidden';
import { ThemeProvider } from '@mui/material/styles';
import { default as ToolbarMUI } from '@mui/material/Toolbar';
import { selectFuseNavbar } from 'app/store/fuse/navbarSlice';
import { selectFuseCurrentLayoutConfig, selectToolbarTheme } from 'app/store/fuse/settingsSlice';
import clsx from 'clsx';
import { memo, useState } from 'react';
import { useSelector } from 'react-redux';
import ChatPanelToggleButton from '../shared-components/chatPanel/ChatPanelToggleButton';
import NavbarToggleButton from '../shared-components/NavbarToggleButton';
import NavigationSearch from '../shared-components/NavigationSearch';
import NavigationShortcuts from '../shared-components/NavigationShortcuts';
import NotificationPanelToggleButton from '../shared-components/notificationPanel/NotificationPanelToggleButton';
import UserMenu from '../shared-components/UserMenu';

const Toolbar = (props) => {
  const config = useSelector(selectFuseCurrentLayoutConfig);
  const navbar: any = useSelector(selectFuseNavbar);
  const toolbarTheme = useSelector(selectToolbarTheme);
  //TODO - add maintanance from backend
  const [maintenanceMode, setMaintenanceMoce] = useState(false);

  return (
    <ThemeProvider theme={toolbarTheme}>
      <AppBar
        id="fuse-toolbar"
        className={clsx('flex relative z-20 shadow-md', props.className)}
        color="default"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? toolbarTheme.palette.background.paper
              : toolbarTheme.palette.background.default,
        }}
        position="static"
      >
        <ToolbarMUI className="p-0 min-h-48 md:min-h-64">
          <div className="flex flex-1 px-16">
            {config.navbar.display && config.navbar.position === 'left' && (
              <>
                {maintenanceMode && (
                  <>
                    <FuseSvgIcon color="red">heroicons-outline:exclamation</FuseSvgIcon>
                    <Typography color="red" fontWeight="bold">
                      STRÁNKA JE V REŽIME ÚDRŽBY
                    </Typography>
                    <FuseSvgIcon color="red">heroicons-outline:exclamation</FuseSvgIcon>
                  </>
                )}

                <Hidden lgDown>
                  {(config.navbar.style === 'style-3' || config.navbar.style === 'style-3-dense') && (
                    <NavbarToggleButton className="w-40 h-40 p-0 mx-0" />
                  )}

                  {config.navbar.style === 'style-1' && !navbar.open && (
                    <NavbarToggleButton className="w-40 h-40 p-0 mx-0" />
                  )}
                </Hidden>
                <Hidden lgUp>
                  <NavbarToggleButton className="w-40 h-40 p-0 mx-0 sm:mx-8" />
                </Hidden>
              </>
            )}

            <Hidden lgDown>
              <NavigationShortcuts />
            </Hidden>
          </div>

          <div className="flex items-center px-8 h-full overflow-x-auto">
            <NavigationSearch />

            <Hidden lgUp>
              <ChatPanelToggleButton />
            </Hidden>

            {/* 
            TODO - might be used again in the future
            <QuickPanelToggleButton />
             */}

            <NotificationPanelToggleButton />

            <UserMenu />
          </div>

          {config.navbar.display && config.navbar.position === 'right' && (
            <>
              <Hidden lgDown>{!navbar.open && <NavbarToggleButton className="w-40 h-40 p-0 mx-0" />}</Hidden>

              <Hidden lgUp>
                <NavbarToggleButton className="w-40 h-40 p-0 mx-0 sm:mx-8" />
              </Hidden>
            </>
          )}
        </ToolbarMUI>
      </AppBar>
    </ThemeProvider>
  );
};

export default memo(Toolbar);
