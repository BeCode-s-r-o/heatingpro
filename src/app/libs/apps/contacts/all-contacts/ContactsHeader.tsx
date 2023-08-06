import React from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectFilteredContacts,
  selectGroupedFilteredContacts,
  selectSearchText,
  setContactsSearchText,
} from '../../../../layout/shared/chatPanel/store/contactsSlice';
import NavLinkAdapter from '@app/core/NavLinkAdapter';
import FuseSvgIcon from '@app/core/SvgIcon';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import { AppDispatch } from 'app/store/index';
import { selectUser } from 'app/store/userSlice';
import { TContact } from '@app/types/TContact';

const ContactsHeader = () => {
  const dispatch = useDispatch<AppDispatch>();
  const searchText = useSelector(selectSearchText);
  const filteredData = useSelector(selectFilteredContacts);
  const groupedFilteredContacts: { [key: string]: { children: TContact[] } } =
    useSelector(selectGroupedFilteredContacts);

  const getUsersCountLabel = (count) => {
    if (count === 0) {
      return 'Žiadny používatelia';
    }
    if (count === 1) {
      return 'používateľ';
    }
    if (count > 1 && count < 5) {
      return 'používatelia';
    }
    return 'používateľov';
  };
  const { data: user } = useSelector(selectUser);

  const isAdmin = user?.role === 'admin';
  const filteredContacts: any[] = [];

  Object.entries(groupedFilteredContacts).forEach(([key, group]: [any, any]) => {
    const hasMatchingHeaterInGroup = group.children.some((item) =>
      item.heaters.some((heater) => user?.heaters.includes(heater))
    );

    if (hasMatchingHeaterInGroup || isAdmin) {
      const filteredGroup = group.children.filter(
        (item) => item.heaters.some((heater) => user?.heaters.includes(heater)) || isAdmin
      );

      if (filteredGroup.length > 0 || isAdmin) {
        filteredContacts.push({ key, data: filteredGroup });
      }
    }
  });
  const countOfContacts = filteredContacts.reduce((count, { data }) => count + data.length, 0);
  return (
    <div className="p-24 sm:p-32 w-full border-b-1">
      <div className="flex flex-col items-center sm:items-start">
        <Typography component={motion.span} className="text-24 md:text-32 font-extrabold tracking-tight leading-none">
          Používatelia
        </Typography>
        <Typography component={motion.span} className="text-14 font-medium ml-2" color="text.secondary">
          {`${countOfContacts > 0 ? countOfContacts : ''} ${getUsersCountLabel(countOfContacts)}`}
        </Typography>
      </div>
      <div className="flex flex-col sm:flex-row space-y-16 sm:space-y-0 flex-1 items-center mt-16 -mx-8">
        <Box
          component={motion.div}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
          className="flex flex-1 w-full sm:w-auto items-center px-16 mx-8 border-1 rounded-full"
        >
          <FuseSvgIcon color="action" size={20}>
            heroicons-outline:search
          </FuseSvgIcon>

          <Input
            placeholder="Vyhľadávanie používateľov"
            className="flex flex-1 px-16"
            disableUnderline
            fullWidth
            value={searchText}
            inputProps={{
              'aria-label': 'Search',
            }}
            onChange={(ev) => dispatch(setContactsSearchText(ev))}
          />
        </Box>
        <Button className="mx-8" variant="contained" color="primary" component={NavLinkAdapter} to="/novy-pouzivatel">
          <FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>
          <span className="mx-8">Pridať</span>
        </Button>
      </div>
    </div>
  );
};

export default ContactsHeader;
