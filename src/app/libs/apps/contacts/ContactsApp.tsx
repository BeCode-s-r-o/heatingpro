import FusePageSimple from '@app/core/PageSimple';
import { useDeepCompareEffect } from '@app/hooks';
import useThemeMediaQuery from '@app/hooks/useThemeMediaQuery';
import { styled } from '@mui/material/styles';
import { AppDispatch } from 'app/store/index';
import withReducer from 'app/store/withReducer';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import ContactsHeader from './ContactsHeader';
import ContactsList from './ContactsList';
import ContactsSidebarContent from './ContactsSidebarContent';
import reducer from './store';
import { getContacts } from './store/contactsSlice';

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
      header={<ContactsHeader pageLayout={pageLayout} />}
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

export default withReducer('contacts', reducer)(ContactsApp);
