import FuseSvgIcon from '@app/core/SvgIcon';
import { TBoiler, TBoilerInfo } from '@app/types/TBoilers';
import { Switch, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import { AppDispatch } from 'app/store/index';
import { showMessage } from 'app/store/slices/messageSlice';
import { selectUser } from 'app/store/userSlice';
import 'firebase/firestore';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { db } from 'src/firebase-config';
import { getBoiler } from '../../../store/boilersSlice';
import { getCurrentDate } from '../functions/datesOperations';
interface Props {
  boilerInfo: TBoilerInfo;
  boilerData: TBoiler;
  isOpen: boolean;
  toggleOpen: () => void;
}

function ChangeHeaderInfoModal({ boilerInfo, boilerData, isOpen, toggleOpen }: Props) {
  const [image, setImage] = useState(boilerInfo.avatar || '');
  const [headerData, setHeaderData] = useState(boilerInfo);
  const [boilerAddress, setBoilerAddress] = useState(boilerData.address);
  const { data: user } = useSelector(selectUser);
  const dispatch = useDispatch<AppDispatch>();

  const handleInputChange = (e, setState) => {
    const { name, value } = e.target;

    setState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChange = (e) => {
    handleInputChange(e, setHeaderData);
  };

  const handleAddressChange = (e) => {
    handleInputChange(e, setBoilerAddress);
  };
  const uptadeHeaderInfo = (id, data) => {
    const newBoilerRef = doc(db, 'boilers', id);
    updateDoc(newBoilerRef, data);
  };

  const addChangeToHeaderHistory = async (newData, id) => {
    try {
      const headerHistoryRef = doc(db, 'headers-history', id);
      const headerHistoryDoc = await getDoc(headerHistoryRef);
      const headerHistoryData = headerHistoryDoc.data();

      const updatedHistory = headerHistoryData?.history?.filter(
        (record) => record.dateOfChange !== newData.dateOfChange
      );

      const updatedData = {
        history: [newData, ...updatedHistory],
      };

      await updateDoc(headerHistoryRef, updatedData);
    } catch (error) {
      throw error;
    }
  };

  const updateBoilerDocument = () => {
    try {
      const { sms, ...boiler } = boilerData;
      const data = { header: { ...headerData, avatar: image }, address: boilerAddress };
      uptadeHeaderInfo(boilerData.id, data);
      addChangeToHeaderHistory({ dateOfChange: getCurrentDate(), header: headerData }, boilerData.id);
      dispatch(getBoiler(boilerData.id || ''));
      dispatch(showMessage({ message: 'Zmeny boli uložené' }));
      toggleOpen();
    } catch (error) {
      toggleOpen();

      dispatch(showMessage({ message: 'Vyskytol sa nejaký problém' }));
    }
  };

  const handlePicture = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      //@ts-ignore
      setImage(`data:${file.type};base64,${btoa(reader.result)}`);
    };
    reader.readAsBinaryString(file);
  };

  const handleRemovePicture = () => {
    setImage('');
  };

  return (
    <Drawer anchor="right" open={isOpen} onClose={toggleOpen}>
      <div className="max-w-[98vw] overflow-x-scroll">
        <List className="w-[300px]">
          <ListItem>
            <ListItemText primary="Nastavenie Info" />
          </ListItem>
          <ListItem>
            <Box
              sx={{
                borderWidth: 4,
                borderStyle: 'solid',
                borderColor: 'background.paper',
              }}
              className="relative flex items-center justify-center w-128 h-128 overflow-hidden rounded mx-auto"
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
                  <IconButton onClick={handleRemovePicture}>
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
                src={image}
                alt={boilerData.name}
              >
                {boilerData.name?.charAt(0)}
              </Avatar>
            </Box>
          </ListItem>
          <ListItem className="flex flex-col">
            <Typography className="font-bold">Upozornenie o nezaplatení</Typography>
            <Box className="flex flex-row justify-center items-center">
              <Typography>Zaplatené</Typography>
              <Switch
                checked={headerData.isPaid}
                name="isPaid"
                readOnly={user?.role !== 'admin'}
                onChange={(e) =>
                  setHeaderData((prev) => ({
                    ...prev,
                    isPaid: e.target.checked,
                  }))
                }
              />
            </Box>
          </ListItem>
          <ListItem className="flex flex-col">
            <Typography className="font-bold">Schéma kotolne</Typography>
            <Box className="flex flex-row justify-center items-center">
              <Typography>S obsluhou</Typography>
              <Switch
                checked={headerData.withService}
                name="withService"
                onChange={(e) =>
                  setHeaderData((prev) => ({
                    ...prev,
                    withService: e.target.checked,
                  }))
                }
              />
            </Box>
          </ListItem>
          <ListItem>
            <TextField
              className="w-full"
              type="text"
              label="Názov Kotolne"
              value={headerData.name}
              name="name"
              onChange={handleChange}
              disabled={user?.role !== 'admin'}
            />
          </ListItem>
          <ListItem>
            <TextField
              className="w-full"
              type="text"
              label="Sériové číslo"
              value={headerData.serialNumber}
              name="serialNumber"
              onChange={handleChange}
              disabled={user?.role === 'obsluha' || user?.role === 'user'}
            />
          </ListItem>
          <ListItem>
            <TextField
              className="w-full"
              type="text"
              label="Dátum inštalácie"
              value={headerData.instalationDate}
              name="instalationDate"
              onChange={handleChange}
              disabled={user?.role === 'obsluha' || user?.role === 'user'} //todo who can edit this?
            />
          </ListItem>

          <ListItem>
            <TextField
              className="w-full"
              type="text"
              label="Mesto"
              value={boilerAddress.city}
              name="city"
              onChange={handleAddressChange}
              disabled={user?.role !== 'admin'}
            />
          </ListItem>
          <ListItem>
            <TextField
              className="w-full"
              type="text"
              label="Ulica"
              value={boilerAddress.street}
              name="street"
              onChange={handleAddressChange}
              disabled={user?.role !== 'admin'}
            />
          </ListItem>
          <ListItem>
            <TextField
              className="w-full"
              type="text"
              label="PSČ"
              value={boilerAddress.zip}
              name="zip"
              onChange={handleAddressChange}
              disabled={user?.role !== 'admin'}
            />
          </ListItem>
          <ListItem>
            <TextField
              className="w-full"
              type="text"
              label="Verzia softvéru"
              value={headerData.softwareVersion}
              name="softwareVersion"
              onChange={handleChange}
              disabled
            />
          </ListItem>

          <ListItem>
            <TextField
              className="w-full"
              type="text"
              label="Umiestnenie"
              value={headerData.location}
              name="location"
              onChange={handleChange}
              disabled={user?.role === 'obsluha' || user?.role === 'user'}
            />
          </ListItem>

          <ListItem>
            <TextField
              className="w-full"
              type="text"
              label="Prevádzkovateľ"
              value={headerData.operator}
              name="operator"
              onChange={handleChange}
              disabled={user?.role === 'obsluha' || user?.role === 'user'}
            />
          </ListItem>
          <ListItem>
            <TextField
              className="w-full"
              type="text"
              label="Obsluha"
              value={headerData.provider}
              name="provider"
              onChange={handleChange}
              disabled={user?.role === 'obsluha' || user?.role === 'user'}
            />
          </ListItem>
          <ListItem>
            <TextField
              className="w-full"
              type="text"
              label="Kurič 1, Meno + tel. číslo"
              value={headerData.staff1}
              name="staff1"
              onChange={handleChange}
              disabled={user?.role === 'user' && headerData.withService}
            />
          </ListItem>
          <ListItem>
            <TextField
              className="w-full"
              type="text"
              label="Kurič 2, Meno + tel. číslo"
              value={headerData.staff2}
              name="staff2"
              onChange={handleChange}
              disabled={user?.role === 'user' && headerData.withService}
            />
          </ListItem>
          <ListItem className="flex justify-end gap-12 sticky bottom-0 z-50 bg-white">
            <Button
              className="whitespace-nowrap"
              variant="contained"
              color="primary"
              onClick={() => updateBoilerDocument()}
            >
              Uložiť
            </Button>
            <Button className="whitespace-nowrap" variant="contained" color="secondary" onClick={toggleOpen}>
              Zrušiť
            </Button>
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
}

export default ChangeHeaderInfoModal;
