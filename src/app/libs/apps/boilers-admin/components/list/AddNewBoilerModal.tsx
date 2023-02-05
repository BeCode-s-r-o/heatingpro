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
  const [newBoiler, setNewBoiler] = useState({ name: '', phoneNumber: '', assignedTo: '', columns: [] });

  const handleChange = (e) => {
    const value = e.target.value;

    setNewBoiler((prev) => ({
      ...prev,
      [e.target.name]: value,
    }));
  };
  const saveNewBoiler = () => {
    try {
      const boilerRef = doc(db, 'boilers', '0004A'); //need id?
      setDoc(boilerRef, newBoiler);
      dispatch(showMessage({ message: 'Boiler bol úspšene pridaný' }));
    } catch (error) {
      dispatch(showMessage({ message: 'Vyskytol sa nejaký problém' }));
    }
  };
  return (
    <Drawer anchor="right" open={isOpen} onClose={toggleOpen}>
      <List className="w-[300px]">
        <ListItem>
          <ListItemText primary="Pridať nový systém" />
        </ListItem>

        <ListItem>
          <TextField type="text" label="meno" value={newBoiler.name} name="name" onChange={handleChange} />
        </ListItem>
        <ListItem>
          <TextField
            type="text"
            label="telefónne číslo"
            value={newBoiler.phoneNumber}
            name="phoneNumber"
            onChange={handleChange}
          />
        </ListItem>
        <ListItem>
          <TextField
            type="text"
            label="majiteľ"
            value={newBoiler.assignedTo}
            name="assignedTo"
            onChange={handleChange}
          />
        </ListItem>
        <ListItem className="flex justify-around">
          <Button className="whitespace-nowrap" variant="contained" color="secondary" onClick={() => saveNewBoiler}>
            Uložiť
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
