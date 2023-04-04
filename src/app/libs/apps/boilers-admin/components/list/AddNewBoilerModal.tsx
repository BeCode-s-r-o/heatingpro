import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import { setDoc, doc } from 'firebase/firestore';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { db } from 'src/firebase-config';
import { showMessage } from 'app/store/slices/messageSlice';
import { Typography } from '@mui/material';
import FuseSvgIcon from '@app/core/SvgIcon';
import { Box } from '@mui/system';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import axios from 'axios';
import { getBoilers } from '../../store/boilersSlice';
import { AppDispatch } from 'app/store/index';
interface Props {
  isOpen: boolean;
  toggleOpen: () => void;
}

const AddNewBoilerModal = ({ isOpen, toggleOpen }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const [pageNumber, setPageNumber] = useState(1);
  const [header, setHeader] = useState({
    avatar: '',
    name: '',
    location: '',
    provider: '',
    maintenance: '',
    staff1: '',
    staff2: '',
    monitoringDeviceID: '',
  });
  const [address, setAddress] = useState({ city: '', zip: '', street: '' });
  const [newBoiler, setNewBoiler] = useState({
    phoneNumber: '',
    assignedTo: '',
    id: '',
    period: '24',
    notes: [],
    monthTable: { columns: [], rows: [] },
    columns: [],
  });

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
            <TextField
              className="w-[500px]"
              type="text"
              label="Názov kotolne"
              value={header.name}
              name="name"
              onChange={handleHeaderChange}
            />
          </ListItem>
          <ListItem>
            <TextField
              className="w-[500px]"
              type="text"
              label="ID"
              value={newBoiler.id}
              name="id"
              onChange={handleBoilerChange}
            />
          </ListItem>
          <ListItem>
            <TextField
              className="w-[500px]"
              type="text"
              label="Ulica"
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
              label="Mesto"
              value={address.city}
              name="city"
              onChange={handleAddressChange}
            />
          </ListItem>
          <ListItem>
            <TextField
              className="w-[500px]"
              type="text"
              label="PSČ"
              value={address.zip}
              name="zip"
              onChange={handleAddressChange}
            />
          </ListItem>

          <ListItem>
            <TextField
              className="w-[500px]"
              type="text"
              label="Telefónne číslo"
              value={newBoiler.phoneNumber}
              name="phoneNumber"
              onChange={handleBoilerChange}
            />
          </ListItem>
          <ListItem>
            <TextField
              className="w-[500px]"
              type="text"
              label="Perióda"
              value={newBoiler.period}
              name="period"
              onChange={handleBoilerChange}
            />
          </ListItem>
          <ListItem>
            <TextField
              className="w-[500px]"
              type="text"
              label="Majiteľ"
              value={newBoiler.assignedTo}
              name="assignedTo"
              onChange={handleBoilerChange}
            />
          </ListItem>
        </>
      ),
    },
    {
      number: 2,
      content: (
        <>
          <ListItem>
            <Box
              sx={{
                borderWidth: 4,
                borderStyle: 'solid',
                borderColor: 'background.paper',
              }}
              className="relative flex items-center justify-center w-128 h-128 rounded-full overflow-hidden mx-auto"
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
                className="object-cover w-full h-full text-64 font-bold"
                src={header.avatar}
              >
                {header.name.charAt(0)}
              </Avatar>
            </Box>
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
              label="Prevádzkovateľ"
              value={header.provider}
              name="provider"
              onChange={handleHeaderChange}
            />
          </ListItem>
          <ListItem>
            <TextField
              className="w-[500px]"
              type="text"
              label="Kúrič 1"
              placeholder="meno + číslo"
              value={header.maintenance}
              name="maintenance"
              onChange={handleHeaderChange}
            />
          </ListItem>
          <ListItem>
            <TextField
              className="w-[500px]"
              type="text"
              label="Kúrič 2"
              placeholder="meno + číslo"
              value={header.staff1}
              name="staff1"
              onChange={handleHeaderChange}
            />
          </ListItem>
          <ListItem>
            <TextField
              className="w-[500px]"
              data-header=""
              type="text"
              label="ID monit. zariadenia"
              value={header.staff2}
              name="staff2"
              onChange={handleHeaderChange}
            />
          </ListItem>
        </>
      ),
    },
  ];
  const createBoilerOnBackend = async () => {
    /*   try {
      const response = await axios.post('/', {});
      console.log(response.data);
    } catch (error) {
      console.log(error);
    } */
  };
  const saveNewBoiler = () => {
    try {
      const boilerRef = doc(db, 'boilers', newBoiler.id);
      setDoc(boilerRef, { ...newBoiler, name: header.name, address: address, header: header });
      createBoilerOnBackend();
      dispatch(getBoilers());
      toggleOpen();
      dispatch(showMessage({ message: 'Boiler bol úspšene pridaný' }));
    } catch (error) {
      toggleOpen();
      dispatch(showMessage({ message: 'Vyskytol sa nejaký problém' }));
    }
  };
  return (
    <Drawer anchor="right" open={isOpen} onClose={toggleOpen}>
      <List className="w-[500px]">
        <ListItem>
          <ListItemText primary="Pridať nový systém" className="text-center" />
        </ListItem>
        {pages.map((page, i) => (
          <div key={i}>{page.number === pageNumber && page.content}</div>
        ))}
        <ListItem className="flex justify-center">
          {pageNumber > 1 && (
            <FuseSvgIcon
              className="text-48 cursor-pointer"
              size={24}
              color="action"
              onClick={() => {
                setPageNumber((prev) => prev - 1);
              }}
            >
              heroicons-outline:arrow-left
            </FuseSvgIcon>
          )}

          {pageNumber === 1 && (
            <FuseSvgIcon
              className="text-48 cursor-pointer"
              size={24}
              color="action"
              onClick={() => {
                setPageNumber((prev) => prev + 1);
              }}
            >
              heroicons-outline:arrow-right
            </FuseSvgIcon>
          )}
        </ListItem>
        <ListItem>
          <Typography className=" text-lg mx-auto">{pageNumber}/2</Typography>
        </ListItem>
        <ListItem className="flex  justify-end gap-12">
          <Button
            className="whitespace-nowrap"
            variant="contained"
            color="primary"
            onClick={saveNewBoiler}
            disabled={pageNumber === 1}
          >
            Vytvoriť
          </Button>
          <Button className="whitespace-nowrap" variant="contained" color="secondary" onClick={toggleOpen}>
            Zrušiť
          </Button>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default AddNewBoilerModal;
