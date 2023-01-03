import { styled } from '@mui/material/styles';
import AppContext from 'app/AppContext';
import { selectFuseCurrentLayoutConfig } from 'app/store/fuse/settingsSlice';
import { memo, useContext } from 'react';
import { useSelector } from 'react-redux';
import { useRoutes } from 'react-router-dom';
import FuseDialog from 'src/@app/core/FuseDialog';
import FuseMessage from 'src/@app/core/FuseMessage';
import FuseSuspense from 'src/@app/core/FuseSuspense';
import NavbarWrapperLayout1 from './components/NavbarWrapper';
import RightSideLayout1 from './components/RightSide';
import Toolbar from './components/Toolbar';

interface ExtendedRootProps {
  config: any;
}

const Root = styled('div')(({ config }: ExtendedRootProps) => ({
  ...(config.mode === 'boxed' && {
    clipPath: 'inset(0)',
    maxWidth: `${config.containerWidth}px`,
    margin: '0 auto',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  }),
  ...(config.mode === 'container' && {
    '& .container': {
      maxWidth: `${config.containerWidth}px`,
      width: '100%',
      margin: '0 auto',
    },
  }),
}));

const Layout = (props) => {
  const config: any = useSelector(selectFuseCurrentLayoutConfig);
  const appContext: any = useContext(AppContext);
  const routes = appContext.routes || [];

  return (
    <Root id="fuse-layout" config={config} className="w-full flex">
      <div className="flex flex-auto min-w-0">
        {config.navbar.display && config.navbar.position === 'left' && <NavbarWrapperLayout1 />}

        <main id="fuse-main" className="flex flex-col flex-auto min-h-full min-w-0 relative z-10">
          {config.toolbar.display && <Toolbar className={config.toolbar.style === 'fixed' && 'sticky top-0'} />}

          <div className="flex flex-col flex-auto min-h-0 relative z-10">
            <FuseDialog />

            <FuseSuspense>{useRoutes(routes)}</FuseSuspense>

            {props.children}
          </div>
        </main>

        {config.navbar.display && config.navbar.position === 'right' && <NavbarWrapperLayout1 />}
      </div>

      {config.rightSidePanel.display && <RightSideLayout1 />}
      <FuseMessage />
    </Root>
  );
};

export default memo(Layout);
