import NavLinkAdapter from '@app/core/NavLinkAdapter';
import FuseSvgIcon from '@app/core/SvgIcon';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectFilteredContacts,
  selectSearchText,
  setContactsSearchText,
} from '../../../../layout/shared/chatPanel/store/contactsSlice';

const ContactsHeader = () => {
  const dispatch = useDispatch();
  const searchText = useSelector(selectSearchText);
  const filteredData = useSelector(selectFilteredContacts);

  const getUsersCountLabel = (count) => {
    if (count === 0) {
      return 'Žiadni používatelia';
    }
    if (count === 1) {
      return 'používateľ';
    }
    if (count > 1 && count < 5) {
      return 'používatelia';
    }
    return 'používateľov';
  };

  return (
    <div className="p-24 sm:p-32 w-full border-b-1">
      <div className="flex flex-col items-center sm:items-start">
        <Typography component={motion.span} className="text-24 md:text-32 font-extrabold tracking-tight leading-none">
          Používatelia
        </Typography>
        <Typography component={motion.span} className="text-14 font-medium ml-2" color="text.secondary">
          {`${filteredData.length > 0 ? filteredData.length : ''} ${getUsersCountLabel(filteredData.length)}`}
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
        <Button className="mx-8" variant="contained" color="secondary" component={NavLinkAdapter} to="/novy-pouzivatel">
          <FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>
          <span className="mx-8">Pridať</span>
        </Button>
      </div>
    </div>
  );
};

export default ContactsHeader;
