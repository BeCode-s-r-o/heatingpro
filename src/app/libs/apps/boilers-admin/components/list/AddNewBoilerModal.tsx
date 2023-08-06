import FuseSvgIcon from '@app/core/SvgIcon';
import { Switch, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';
import * as Sentry from '@sentry/react';
import { AppDispatch } from 'app/store/index';
import { showMessage } from 'app/store/slices/messageSlice';
import { selectUser } from 'app/store/userSlice';
import axios from 'axios';
import { doc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { db } from 'src/firebase-config';
import { getBoilers, selectAllBoilers } from '../../store/boilersSlice';

interface Props {
  isOpen: boolean;
  toggleOpen: () => void;
}

const AddNewBoilerModal = ({ isOpen, toggleOpen }: Props) => {
  const boilers = useSelector(selectAllBoilers);
  const { data: user } = useSelector(selectUser);
  const dispatch = useDispatch<AppDispatch>();
  const [error, setError] = useState<string>('');
  const initialHeaderState = {
    serialNumber: '',
    instalationDate: '',
    avatar: '',
    name: '',
    location: '',
    provider: '',
    operator: '',
    maintenance: '',
    staff1: '',
    staff2: '',
    withService: true,
    isPaid: true,
  };
  const initialAddressState = { city: '', zip: '', street: '' };
  const initialNewBoilerState = {
    phoneNumber: '',
    id: '',
    period: '24',
    notes: [],
    monthTable: { columns: [], rows: [] },
    columns: [],
    contactsForNotification: [],
    requestedSMS: [],
  };
  const [pageNumber, setPageNumber] = useState(1);
  const [header, setHeader] = useState(initialHeaderState);
  const [address, setAddress] = useState(initialAddressState);
  const [newBoiler, setNewBoiler] = useState(initialNewBoilerState);

  const resetForm = () => {
    setHeader(initialHeaderState);
    setAddress(initialAddressState);
    setNewBoiler(initialNewBoilerState);
  };
  const filledRequiredFields = () => {
    if (
      newBoiler.id === '' ||
      header.name === '' ||
      newBoiler.phoneNumber === '' ||
      Object.values(address).some((value) => value === '')
    ) {
      return false;
    }

    return true;
  };
  const handleChange = (setValue) => (e) => {
    const { name, value } = e.target;
    setValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleHeaderChange = handleChange(setHeader);
  const handleAddressChange = handleChange(setAddress);
  const handleBoilerChange = handleChange(setNewBoiler);

  const handlePicture = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();

    reader.onload = () => {
      //@ts-ignore
      setHeader((prev) => ({ ...prev, avatar: `data:${file.type};base64,${btoa(reader.result)}` }));
    };

    reader.readAsBinaryString(file);
  };

  const handleRemove = () => {
    setHeader((prev) => ({ ...prev, avatar: '' }));
  };

  const pages = [
    {
      number: 1,
      content: (
        <>
          <ListItem>
            <Box
              sx={{
                borderWidth: 4,
                borderStyle: 'solid',
                borderColor: 'background.paper',
              }}
              className="relative flex items-center justify-center w-128 h-128  overflow-hidden mx-auto"
            >
              <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div>
                  <label htmlFor="button-avatar" className="flex p-8 cursor-pointer">
                    <input
                      accept="image/*"
                      className="hidden"
                      id="button-avatar"
                      type="file"
                      onChange={handlePicture}
                    />
                    <FuseSvgIcon className="text-white">heroicons-outline:camera</FuseSvgIcon>
                  </label>
                </div>
                <div>
                  <IconButton onClick={handleRemove}>
                    <FuseSvgIcon className="text-white">heroicons-solid:trash</FuseSvgIcon>
                  </IconButton>
                </div>
              </div>
              <Avatar
                sx={{
                  backgroundColor: 'background.default',
                  color: 'text.secondary',
                }}
                variant="rounded"
                className="object-cover w-full h-full text-64 font-bold"
                src={header.avatar}
              >
                {header.name.charAt(0)}
              </Avatar>
            </Box>
          </ListItem>
          <ListItem className="flex flex-col">
            <Typography className="font-bold">Schéma kotolne</Typography>
            <Box className="flex flex-row justify-center items-center">
              <Typography>S obsluhou</Typography>
              <Switch
                checked={header.withService}
                name="withService"
                onChange={(e) =>
                  setHeader((prev) => ({
                    ...prev,
                    withService: e.target.checked,
                  }))
                }
                disabled={!(user?.role === 'instalater' || user?.role === 'admin')}
              />
            </Box>
          </ListItem>
          <ListItem>
            <TextField
              className="w-[500px]"
              type="text"
              label="Sériové číslo"
              value={header.serialNumber}
              placeholder="Sériové číslo"
              name="serialNumber"
              onChange={handleHeaderChange}
            />
          </ListItem>
          <ListItem>
            <TextField
              className="w-[500px]"
              type="text"
              label="Dátum inštalácie"
              value={header.instalationDate}
              placeholder="DD.MM.YYYY"
              name="instalationDate"
              onChange={handleHeaderChange}
            />
          </ListItem>
          <ListItem>
            <TextField
              className="w-[500px]"
              type="text"
              label="Názov kotolne *"
              value={header.name}
              name="name"
              onChange={handleHeaderChange}
            />
          </ListItem>
          <ListItem>
            <TextField
              className="w-[500px]"
              type="text"
              label="ID  *"
              value={newBoiler.id}
              name="id"
              onChange={handleBoilerChange}
            />
          </ListItem>
          <ListItem>
            <TextField
              className="w-[500px]"
              type="text"
              label="Ulica  *"
              placeholder="Ulica + číslo"
              value={address.street}
              name="street"
              onChange={handleAddressChange}
            />
          </ListItem>
          <ListItem>
            <TextField
              className="w-[500px]"
              type="text"
              label="Mesto  *"
              value={address.city}
              name="city"
              onChange={handleAddressChange}
            />
          </ListItem>
          <ListItem>
            <TextField
              className="w-[500px]"
              type="text"
              label="PSČ  *"
              value={address.zip}
              name="zip"
              onChange={handleAddressChange}
            />
          </ListItem>

          <ListItem>
            <TextField
              className="w-[500px]"
              type="text"
              label="Telefónne číslo kotolne  *"
              value={newBoiler.phoneNumber}
              name="phoneNumber"
              onChange={handleBoilerChange}
            />
          </ListItem>

          <ListItem>
            <TextField
              className="w-[500px]"
              type="text"
              label="Prevádzkovateľ"
              value={header.operator}
              name="operator"
              onChange={handleHeaderChange}
            />
          </ListItem>
          <ListItem>
            <TextField
              className="w-[500px]"
              type="text"
              label="Umiestnenie v objekte"
              value={header.location}
              name="location"
              onChange={handleHeaderChange}
            />
          </ListItem>
          <ListItem>
            <TextField
              className="w-[500px]"
              type="text"
              label="Obsluha kotolne"
              value={header.provider}
              name="provider"
              onChange={handleHeaderChange}
            />
          </ListItem>
          <ListItem>
            <TextField
              className="w-[500px]"
              type="text"
              label="Kurič 1"
              placeholder="Meno + tel. číslo"
              value={header.staff1}
              name="staff1"
              onChange={handleHeaderChange}
            />
          </ListItem>
          <ListItem>
            <TextField
              className="w-[500px]"
              type="text"
              label="Kurič 2"
              placeholder="Meno + tel. číslo"
              value={header.staff2}
              name="staff2"
              onChange={handleHeaderChange}
            />
          </ListItem>
        </>
      ),
    },
  ];
  const existBoilerID = (id) => {
    return boilers?.some((boiler) => boiler.id === id);
  };
  const createBoilerOnBackend = async (boilerPhoneNumber, boilerID) => {
    const data = {
      phoneNumber: boilerPhoneNumber,
      boilerId: boilerID,
    };
    try {
      await axios.post('https://api.monitoringpro.sk/config-boiler', data);
    } catch (error) {
      Sentry.captureException(error);
      dispatch(showMessage({ message: 'Vyskytla sa chyba pri vytváraní kotolne!' }));
    }
  };
  const assignBoilerToUser = (userID, boilers) => {
    const userRef = doc(getFirestore(), 'users', userID);
    updateDoc(userRef, {
      boilers: boilers,
    })
      .then(() => {})
      .catch((error) => {
        throw error;
      });
  };

  const saveNewBoiler = () => {
    if (!filledRequiredFields()) {
      setError('Vyplnte prosím všetky povinné polia *');
      return;
    }
    if (existBoilerID(newBoiler.id)) {
      setError('Kotolňa s týmto ID už existuje');
      return;
    }
    setError('');
    try {
      user?.role === 'instalater' && assignBoilerToUser(user?.id, [...(user?.heaters || []), newBoiler.id]);

      const boilerRef = doc(db, 'boilers', newBoiler.id);

      setDoc(boilerRef, { ...newBoiler, name: header.name, address: address, header: header });
      const boilerHeaderHistoryRef = doc(db, 'headers-history', newBoiler.id);
      setDoc(boilerHeaderHistoryRef, { history: [] });
      createBoilerOnBackend(newBoiler.phoneNumber, newBoiler.id);
      toggleOpen();
      dispatch(showMessage({ message: 'Boiler bol úspšene pridaný' }));
      resetForm();
      dispatch(getBoilers());
    } catch (error) {
      toggleOpen();
      dispatch(showMessage({ message: 'Vyskytol sa nejaký problém' }));
    }
  };

  return (
    <Drawer anchor="right" open={isOpen} onClose={toggleOpen}>
      <div className="max-w-[98vw] overflow-x-scroll">
        <List className="w-[500px]">
          <ListItem>
            <ListItemText primary="Pridať nový systém" className="text-center" />
          </ListItem>
          {pages.map((page, i) => (
            <div key={i}>{page.number === pageNumber && page.content}</div>
          ))}
          <ListItem>
            <Typography color="error">{error}</Typography>
          </ListItem>
          <ListItem className="flex  justify-end gap-12">
            <Button className="whitespace-nowrap" variant="contained" color="primary" onClick={saveNewBoiler}>
              Vytvoriť
            </Button>
            <Button className="whitespace-nowrap" variant="contained" color="secondary" onClick={toggleOpen}>
              Zrušiť
            </Button>
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
};

export default AddNewBoilerModal;
