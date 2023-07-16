import FusePageSimple from '@app/core/PageSimple';
import { useDeepCompareEffect } from '@app/hooks';
import useThemeMediaQuery from '@app/hooks/useThemeMediaQuery';
import { TUserState } from '@app/types/TUserData';
import { styled } from '@mui/material/styles';
import { AppDispatch } from 'app/store/index';
import { selectUser } from 'app/store/userSlice';
import withReducer from 'app/store/withReducer';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';
import { contactsReducers } from '../../../layout/shared/chatPanel/store';
import { getContacts } from '../../../layout/shared/chatPanel/store/contactsSlice';
import ContactsHeader from './all-contacts/ContactsHeader';
import ContactsList from './all-contacts/ContactsList';
import ContactsSidebarContent from './contact/ContactsSidebarContent';

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.palette.background.paper,
  },
}));

const ContactsApp = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user: TUserState = useSelector(selectUser);
  const allowedRoles = ['admin', 'instalater', 'user', 'obsluha'];
  const pageLayout = useRef(null);
  const routeParams = useParams();
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  useDeepCompareEffect(() => {
    dispatch(getContacts());
  }, [dispatch]);

  useEffect(() => {
    setRightSidebarOpen(Boolean(routeParams.id));
  }, [routeParams]);

  return allowedRoles.includes(user.role) ? (
    <Root
      header={<ContactsHeader />}
      content={<ContactsList />}
      ref={pageLayout}
      rightSidebarContent={<ContactsSidebarContent />}
      rightSidebarOpen={rightSidebarOpen}
      rightSidebarOnClose={() => setRightSidebarOpen(false)}
      rightSidebarWidth={640}
      scroll={isMobile ? 'normal' : 'content'}
    />
  ) : (
    <Navigate to="/" />
  );
};

export default withReducer('contacts', contactsReducers)(ContactsApp);
