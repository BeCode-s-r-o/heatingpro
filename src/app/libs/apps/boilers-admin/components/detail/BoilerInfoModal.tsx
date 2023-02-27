import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import { showMessage } from 'app/store/slices/messageSlice';
import 'firebase/firestore';
import { doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';

import { TBoiler, TBoilerInfo } from '@app/types/TBoilers';
import { AppDispatch } from 'app/store/index';
import { useDispatch } from 'react-redux';
import { db } from 'src/firebase-config';
import { getBoiler } from '../../store/boilersSlice';
interface Props {
  boilerInfo: TBoilerInfo;
  boilerData: TBoiler;
  isOpen: boolean;
  toggleOpen: () => void;
}

function ChangeHeaderInfoModal({ boilerInfo, boilerData, isOpen, toggleOpen }: Props) {
  const [headerData, setHeaderData] = useState(boilerInfo);
  const dispatch = useDispatch<AppDispatch>();

  const handleChange = (e) => {
    const value = e.target.value;
    setHeaderData((prev) => ({
      ...prev,
      [e.target.name]: value,
    }));
  };

  const uptadeHeaderInfo = (id, data) => {
    const newBoilerRef = doc(db, 'boilers', id);
    updateDoc(newBoilerRef, data);
  };

  const updateBoilerDocument = () => {
    try {
      const data = { ...boilerData, header: headerData };
      uptadeHeaderInfo(boilerData.id, data);
      dispatch(getBoiler(boilerData.id || ''));
      dispatch(showMessage({ message: 'Zmeny boli uložené' }));
      toggleOpen();
    } catch (error) {
      toggleOpen();

      dispatch(showMessage({ message: 'Vyskytol sa nejaký problém' }));
    }
  };

  return (
    <Drawer anchor="right" open={isOpen} onClose={toggleOpen}>
      <List className="w-[300px]">
        <ListItem>
          <ListItemText primary="Nastavenie Info" />
        </ListItem>
        <ListItem>
          <TextField
            className="w-full"
            type="text"
            label="Názov"
            value={headerData.name}
            name="name"
            onChange={handleChange}
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
          />
        </ListItem>
        <ListItem>
          <TextField
            className="w-full"
            type="text"
            label="Prevádzkovateľ"
            value={headerData.provider}
            name="provider"
            onChange={handleChange}
          />
        </ListItem>
        <ListItem>
          <TextField
            className="w-full"
            type="text"
            label="Obsluha"
            value={headerData.maintenance}
            name="maintenance"
            onChange={handleChange}
          />
        </ListItem>
        <ListItem>
          <TextField
            className="w-full"
            type="text"
            label="Kúrič 1"
            value={headerData.staff1}
            name="staff1"
            onChange={handleChange}
          />
        </ListItem>
        <ListItem>
          <TextField
            className="w-full"
            type="text"
            label="Kúrič 2"
            value={headerData.staff2}
            name="staff2"
            onChange={handleChange}
          />
        </ListItem>
        <ListItem>
          <TextField
            className="w-full"
            type="text"
            label="ID"
            value={headerData.monitoringDeviceID}
            name="monitoringDeviceID"
            onChange={handleChange}
          />
        </ListItem>
        <ListItem className="flex justify-around">
          <Button
            className="whitespace-nowrap"
            variant="contained"
            color="secondary"
            onClick={() => updateBoilerDocument()}
          >
            Uložiť
          </Button>
          <Button className="whitespace-nowrap" variant="contained" color="primary" onClick={toggleOpen}>
            Zrušiť
          </Button>
        </ListItem>
      </List>
    </Drawer>
  );
}

export default ChangeHeaderInfoModal;
