import FuseScrollbars from '@fuse/core/FuseScrollbars';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import { memo } from 'react';
import Logo from '../shared-components/Logo';
import NavbarToggleButton from '../shared-components/NavbarToggleButton';
import UserNavbarHeader from '../shared-components/UserNavbarHeader';
import Navigation from '../shared-components/Navigation';
//@ts-ignore
import packagejson from '../../../../package.json';
import { Typography } from '@mui/material';

const Root = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  '& ::-webkit-scrollbar-thumb': {
    boxShadow: `inset 0 0 0 20px ${
      theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.24)' : 'rgba(255, 255, 255, 0.24)'
    }`,
  },
  '& ::-webkit-scrollbar-thumb:active': {
    boxShadow: `inset 0 0 0 20px ${
      theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.37)' : 'rgba(255, 255, 255, 0.37)'
    }`,
  },
}));

const StyledContent = styled(FuseScrollbars)(({ theme }) => ({
  overscrollBehavior: 'contain',
  overflowX: 'hidden',
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 40px, 100% 10px',
  backgroundAttachment: 'local, scroll',
}));

const NavbarContent = (props) => {
  const getEnv = () => {
    if (packagejson.version.includes('alpha')) {
      return 'alpha';
    } else if (packagejson.version.includes('beta')) {
      return 'beta';
    } else if (packagejson.version.includes('rc')) {
      return 'rc';
    } else {
      return 'stable';
    }
  };

  const getBuildDate = () => {
    if (!packagejson.buildDate) return '';
    const date = new Date(packagejson.buildDate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <Root className={clsx('flex flex-auto flex-col overflow-hidden h-full', props.className)}>
      <div className="flex flex-row items-center shrink-0 h-48 md:h-72 px-20">
        <div className="flex flex-1 mx-4">
          <Logo />
        </div>

        <NavbarToggleButton className="w-40 h-40 p-0" />
      </div>

      <StyledContent
        className="flex flex-1 flex-col min-h-0"
        option={{ suppressScrollX: true, wheelPropagation: false }}
      >
        <UserNavbarHeader />

        <Navigation layout="vertical" />

        <div className="flex flex-0 items-center justify-center py-48 opacity-10">
          <img className="w-full w-160" src="assets/images/logo/logo.png" alt="footer logo" />
        </div>
        <Typography textAlign="center" color="rgba(255,255,255,0.3)">
          v {packagejson.version} {packagejson.buildEnv || 'localhost'} {getBuildDate()}
        </Typography>
      </StyledContent>
    </Root>
  );
};

export default memo(NavbarContent);
