import { TContact } from '@app/types/TContact';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import { selectUser } from 'app/store/userSlice';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import {
  selectFilteredContacts,
  selectGroupedFilteredContacts,
} from '../../../../layout/shared/chatPanel/store/contactsSlice';
import ContactListItem from './ContactListItem';

const ContactsList = () => {
  const filteredData: TContact[] = useSelector(selectFilteredContacts);
  const groupedFilteredContacts: { [key: string]: { children: TContact[] } } =
    useSelector(selectGroupedFilteredContacts);
  const { data: user } = useSelector(selectUser);

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

  const userBoilers = user?.heaters;
  const isAdmin = user?.role === 'admin';
  const filteredContacts: any[] = [];

  Object.entries(groupedFilteredContacts).forEach(([key, group]: [any, any]) => {
    const hasMatchingHeaterInGroup = group.children.some((item) =>
      item.heaters.some((heater) => userBoilers?.includes(heater))
    );

    if (hasMatchingHeaterInGroup || isAdmin) {
      const filteredGroup = group.children.filter(
        (item) => item.heaters.some((heater) => userBoilers?.includes(heater)) || isAdmin
      );

      if (filteredGroup.length > 0 || isAdmin) {
        filteredContacts.push({ key, data: filteredGroup });
      }
    }
  });

  if (filteredContacts.length === 0 && !isAdmin) {
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
      {filteredContacts.map(({ key, data }) => (
        <div key={key} className="relative">
          <Typography color="text.secondary" className="px-32 py-4 text-14 font-medium">
            {key}
          </Typography>

          <Divider />
          <List className="w-full m-0 p-0">
            {/* @ts-ignore */}
            {data.map((item) => (
              <ContactListItem key={item.id} contact={item} />
            ))}
          </List>
        </div>
      ))}
    </motion.div>
  );
};

export default ContactsList;
