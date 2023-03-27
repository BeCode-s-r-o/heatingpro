import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import { showMessage } from 'app/store/slices/messageSlice';
import 'firebase/firestore';
import { collection, deleteDoc, doc, getDocs, getFirestore, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { useState } from 'react';

import { TBoiler, TSms } from '@app/types/TBoilers';
import { useDispatch } from 'react-redux';
import { db } from 'src/firebase-config';
interface Props {
  boiler: TBoiler;
  isOpen: boolean;
  toggleOpen: () => void;
}

function TableParametersModal({ boiler, isOpen, toggleOpen }: Props) {
  const [newBoiler, setNewBoiler] = useState(boiler);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const value = e.target.value;
    setNewBoiler((prev) => ({
      ...prev,
      [e.target.name]: value,
    }));
  };

  const deleteOldBoilerDocument = (id) => {
    const oldBoilerRef = doc(db, 'boilers', id);
    deleteDoc(oldBoilerRef);
  };

  const setNewBoilerDocument = (id, data) => {
    const newBoilerRef = doc(db, 'boilers', id);
    setDoc(newBoilerRef, data);
  };

  const changeBoilerIdInSms = async (oldId, newId) => {
    const smsQuery = query(collection(getFirestore(), 'sms'), where('deviceID', '==', oldId));
    const sms = await getDocs(smsQuery);
    const smsData = sms.docs.map((doc) => doc.data() as TSms);

    if (!smsData.length) {
      return;
    }
    smsData.forEach((sms) => {
      const smsRef = doc(db, 'sms', sms.messageID);
      updateDoc(smsRef, { deviceID: newId });
    });
  };

  const updateBoilerDocument = () => {
    try {
      if (boiler.id === newBoiler.id) {
        setNewBoilerDocument(newBoiler.id, newBoiler);
        dispatch(showMessage({ message: 'Zmeny boli uložené' }));
        return;
      }
      changeBoilerIdInSms(boiler.id, newBoiler.id);
      setNewBoilerDocument(newBoiler.id, newBoiler);
      deleteOldBoilerDocument(boiler.id);
      toggleOpen();
      dispatch(showMessage({ message: 'Zmeny boli uložené' }));
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
          <TextField type="text" label="ID" value={newBoiler.id} name="id" disabled onChange={handleChange} />
        </ListItem>
        <ListItem>
          <TextField type="text" label="Meno" value={newBoiler.name} name="name" onChange={handleChange} />
        </ListItem>
        <ListItem>
          <TextField type="text" label="Perióda" value={newBoiler.period} name="period" onChange={handleChange} />
        </ListItem>

        <ListItem className="flex justify-end gap-12 ">
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
    </Drawer>
  );
}

export default TableParametersModal;
