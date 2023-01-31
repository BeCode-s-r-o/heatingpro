import MessageBox from '@app/core/MessageBox';
import FuseDialog from '@app/core/Dialog';
import FuseSuspense from '@app/core/Suspense';
import { styled } from '@mui/material/styles';
import AppContext from 'app/AppContext';
import { selectFuseCurrentLayoutConfig } from 'app/store/slices/settingsSlice';
import { memo, useContext } from 'react';
import { useSelector } from 'react-redux';
import { useRoutes } from 'react-router-dom';
import NavbarWrapperLayout1 from './components/NavbarWrapper';
import RightSide from './components/RightSide';
import Toolbar from './components/Toolbar';

interface ExtendedRootProps {
  config: any;
}

const Root = styled('div')(({ config }: ExtendedRootProps) => ({
  '& .container': {
    maxWidth: `${config.containerWidth}px`,
    width: '100%',
    margin: '0 auto',
  },
}));

const Layout = (props) => {
  const config = useSelector(selectFuseCurrentLayoutConfig);
  const appContext: any = useContext(AppContext);
  const routes = appContext.routes || [];

  return (
    <Root id="fuse-layout" config={config} className="w-full flex">
      <div className="flex flex-auto min-w-0">
        <NavbarWrapperLayout1 />
        <main id="fuse-main" className="flex flex-col flex-auto min-h-full min-w-0 relative z-10">
          <Toolbar className="sticky top-0" />
          <div className="flex flex-col flex-auto min-h-0 relative z-10">
            <FuseDialog />
            <FuseSuspense>{useRoutes(routes)}</FuseSuspense>
            {props.children}
          </div>
        </main>
      </div>
      <RightSide />
      <MessageBox />
    </Root>
  );
};

export default memo(Layout);
