import { useRef, useState } from 'react';
import { showMessage } from 'app/store/slices/messageSlice';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import {
  doc,
  updateDoc,
  getDoc,
  collection,
  deleteDoc,
  setDoc,
  getFirestore,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import firebase from 'firebase/app';
import 'firebase/firestore';

import { tempColumns } from '../../constants';
import { db } from 'src/firebase-config';
import { useDispatch } from 'react-redux';
import { TBoiler, TBoilerInfo, TSms } from '@app/types/TBoilers';
import { id } from 'date-fns/locale';
interface Props {
  boilerInfo: TBoilerInfo;
  isOpen: boolean;
  toggleOpen: () => void;
}

function BoilerInfoModal({ boilerInfo, isOpen, toggleOpen }: Props) {
  const [newBoiler, setNewBoiler] = useState(boilerInfo);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const value = e.target.value;
    setNewBoiler((prev) => ({
      ...prev,
      [e.target.name]: value,
    }));
  };

  const setNewBoilerDocument = (id, data) => {
    const newBoilerRef = doc(db, 'boilers', id);
    setDoc(newBoilerRef, data);
  };

  const updateBoilerDocument = () => {
    try {
      setNewBoilerDocument(newBoiler.monitoringDeviceID, newBoiler);
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
          <ListItemText primary="Nastavenie Parametrov" />
        </ListItem>

        <ListItem>
          <TextField type="text" label="id" value={newBoiler.name} name="id" onChange={handleChange} />
        </ListItem>
        <ListItem>
          <TextField type="text" label="meno" value={newBoiler.location} name="name" onChange={handleChange} />
        </ListItem>
        <ListItem>
          <TextField type="text" label="perióda" value={newBoiler.provider} name="period" onChange={handleChange} />
        </ListItem>
        <ListItem>
          <TextField type="text" label="perióda" value={newBoiler.maintenance} name="period" onChange={handleChange} />
        </ListItem>
        <ListItem>
          <TextField
            type="text"
            label="perióda"
            value={newBoiler.monitoringDeviceID}
            name="period"
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

export default BoilerInfoModal;
