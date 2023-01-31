import FuseSvgIcon from '@app/core/SvgIcon';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import { AppDispatch } from 'app/store/index';
import withReducer from 'app/store/withReducer';
import { memo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import ContactList from './ContactList';

import { contactsSlice, getContacts, selectAllContacts } from './store/contactsSlice';

const Root = styled('div')(({ theme }) => ({
  position: 'sticky',
  display: 'flex',
  top: 0,
  width: 70,
  maxWidth: 70,
  minWidth: 70,
  height: '100vh',
  zIndex: 1000,

  [theme.breakpoints.down('lg')]: {
    position: 'fixed',
    height: '100%',
    width: 0,
    maxWidth: 0,
    minWidth: 0,
  },

  '& > .panel': {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: 360,
    minWidth: 360,
    height: '100%',
    margin: 0,
    overflow: 'hidden',
    zIndex: 1000,
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    transform: 'translate3d(0,0,0)',
    transition: theme.transitions.create(['transform'], {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.standard,
    }),

    [theme.breakpoints.down('lg')]: {
      left: 'auto',
      position: 'fixed',
      transform: theme.direction === 'rtl' ? 'translate3d(-360px,0,0)' : 'translate3d(360px,0,0)',
      boxShadow: 'none',
      width: 320,
      minWidth: 320,
      maxWidth: '100%',
    },
  },
}));

const UsersSidebar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const contacts = useSelector(selectAllContacts);
  useEffect(() => {
    dispatch(getContacts());
  }, [dispatch]);

  return (
    <Root>
      <div className="panel flex flex-col max-w-full">
        <AppBar position="static" className="shadow-md">
          <Toolbar className="px-4">
            <div className="flex flex-1 items-center px-8 space-x-12">
              <IconButton className="" color="inherit" size="large">
                <FuseSvgIcon size={24}>heroicons-outline:users</FuseSvgIcon>
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        <Paper className="flex flex-1 flex-row min-h-px shadow-0">
          <ContactList contacts={contacts} />
        </Paper>
      </div>
    </Root>
  );
};

export default withReducer('contacts', contactsSlice.reducer)(memo(UsersSidebar));
