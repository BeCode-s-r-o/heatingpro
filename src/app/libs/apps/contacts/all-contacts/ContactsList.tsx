import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ContactListItem from './ContactListItem';
import {
  selectFilteredContacts,
  selectGroupedFilteredContacts,
} from '../../../../layout/shared/chatPanel/store/contactsSlice';

import withReducer from 'app/store/withReducer';
import { getBoilers, boilersSlice } from '../../boilers-admin/store/boilersSlice';
import { useEffect } from 'react';
import { AppDispatch } from 'app/store/index';

const ContactsList = () => {
  const filteredData = useSelector(selectFilteredContacts);
  const groupedFilteredContacts = useSelector(selectGroupedFilteredContacts);

  if (!filteredData) {
    return null;
  }

  if (filteredData.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <Typography color="text.secondary" variant="h5">
          Žiadny používatelia
        </Typography>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
      className="flex flex-col flex-auto w-full max-h-full"
    >
      {Object.entries(groupedFilteredContacts).map(([key, group]) => {
        return (
          <div key={key} className="relative">
            <Typography color="text.secondary" className="px-32 py-4 text-14 font-medium">
              {key}
            </Typography>
            <Divider />
            <List className="w-full m-0 p-0">
              {/* @ts-ignore */}
              {group.children.map((item) => (
                <ContactListItem key={item.id} contact={item} />
              ))}
            </List>
          </div>
        );
      })}
    </motion.div>
  );
};
export default ContactsList;
