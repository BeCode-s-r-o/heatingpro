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
interface Props {
  isOpen: boolean;
  toggleOpen: () => void;
}

const AddNewBoilerModal = ({ isOpen, toggleOpen }: Props) => {
  const dispatch = useDispatch();
  const [newBoiler, setNewBoiler] = useState({
    name: '',
    phoneNumber: '',
    assignedTo: '',
    columns: [],
    id: '',
    period: '24',
    header: { name: '', location: '', provider: '', maintenance: '', staff1: '', staff2: '', monitoringDeviceID: '' },
  });

  const handleChange = (e) => {
    const value = e.target.value;

    setNewBoiler((prev) => ({
      ...prev,
      [e.target.name]: value,
    }));
  };

  const saveNewBoiler = () => {
    try {
      const boilerRef = doc(db, 'boilers', newBoiler.id);
      setDoc(boilerRef, newBoiler);
      dispatch(showMessage({ message: 'Boiler bol úspšene pridaný' }));
    } catch (error) {
      dispatch(showMessage({ message: 'Vyskytol sa nejaký problém' }));
    }
  };
  return (
    <Drawer anchor="right" open={isOpen} onClose={toggleOpen}>
      <List className="w-[500px]">
        <ListItem>
          <ListItemText primary="Pridať nový systém" />
        </ListItem>

        <ListItem>
          <TextField
            className="w-[500px]"
            type="text"
            label="Názov kotolne"
            value={newBoiler.name}
            name="name"
            onChange={handleChange}
          />
        </ListItem>
        <ListItem>
          <TextField
            className="w-[500px]"
            type="text"
            label="ID"
            value={newBoiler.id}
            name="id"
            onChange={handleChange}
          />
        </ListItem>
        <ListItem>
          <TextField
            className="w-[500px]"
            type="text"
            label="Telefónne číslo"
            value={newBoiler.phoneNumber}
            name="phoneNumber"
            onChange={handleChange}
          />
        </ListItem>
        <ListItem>
          <TextField
            className="w-[500px]"
            type="text"
            label="Perióda"
            value={newBoiler.period}
            name="period"
            onChange={handleChange}
          />
        </ListItem>
        <ListItem>
          <TextField
            className="w-[500px]"
            type="text"
            label="Majiteľ"
            value={newBoiler.assignedTo}
            name="assignedTo"
            onChange={handleChange}
          />
        </ListItem>
        <ListItem className="flex  justify-around">
          <Button className="whitespace-nowrap" variant="contained" color="secondary" onClick={saveNewBoiler}>
            Vytvoriť
          </Button>
          <Button className="whitespace-nowrap" variant="contained" color="primary" onClick={toggleOpen}>
            Zrušiť
          </Button>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default AddNewBoilerModal;
