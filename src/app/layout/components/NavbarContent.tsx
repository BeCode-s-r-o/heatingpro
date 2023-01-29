import FuseScrollbars from '@app/core/Scrollbars';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import { memo } from 'react';
// @ts-ignore
import packagejson from '../../../../package.json';
import Logo from '../shared/Logo';
import NavbarToggleButton from '../shared/NavbarToggleButton';
import Navigation from '../shared/Navigation';
import UserNavbarHeader from '../shared/UserNavbarHeader';

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
  const getBuildDate = () => {
    if (!packagejson.buildDate) return '';
    const date = new Date(packagejson.buildDate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return `${day}.${month}.${year} ${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${
      seconds < 10 ? `0${seconds}` : seconds
    }`;
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
