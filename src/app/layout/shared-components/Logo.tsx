import { styled } from '@mui/material/styles';

const Root = styled('div')(({ theme }) => ({
  '& > .logo-icon': {
    transition: theme.transitions.create(['width', 'height'], {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeInOut,
    }),
  },
  '& > .badge': {
    transition: theme.transitions.create('opacity', {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeInOut,
    }),
  },
}));

const Logo = () => {
  return (
    <Root className="flex items-center">
      <img className="logo-icon w-120 h-32" src="assets/images/logo/logo.png" alt="logo" />
    </Root>
  );
};

export default Logo;
