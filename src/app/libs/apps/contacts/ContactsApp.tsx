import FusePageSimple from '@app/core/PageSimple';
import { useDeepCompareEffect } from '@app/hooks';
import useThemeMediaQuery from '@app/hooks/useThemeMediaQuery';
import { styled } from '@mui/material/styles';
import { AppDispatch } from 'app/store/index';
import withReducer from 'app/store/withReducer';
import { contactsReducers } from '../../../layout/shared/chatPanel/store';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
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

  return (
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
  );
};

export default withReducer('contacts', contactsReducers)(ContactsApp);
