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
import { doc, updateDoc, getDoc, collection, deleteDoc, setDoc } from 'firebase/firestore';
import { tempColumns } from '../../constants';
import { db } from 'src/firebase-config';
import { useDispatch } from 'react-redux';
import { TBoiler } from '@app/types/TBoilers';
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
    const newBoilerRef = doc(db, 'boilers', id); //boiler id
    setDoc(newBoilerRef, data);
  };

  const deleteAndSetBoilerDocument = () => {
    try {
      deleteOldBoilerDocument(boiler.id);
      setNewBoilerDocument(newBoiler.id, newBoiler);
      dispatch(showMessage({ message: 'Zmeny boli uložené' }));
    } catch (error) {
      dispatch(showMessage({ message: 'Vyskytol sa nejaký problém' }));
    }
  };

  /*  
    const saveColumnsInFirebase = (columns) => {
      const orderedColumns = columns.map((column, index) => ({ ...column, order: index }));

        const boilerRef = doc(db, 'boilers', "hascvas"); //boiler id
      setDoc(boilerRef, {...data, columns: orderedColumns})
        .then(() => {
         
        })
        .catch((error) => {
       
        }); 
    };
  */
  return (
    <Drawer anchor="right" open={isOpen} onClose={toggleOpen}>
      <List className="w-[300px]">
        <ListItem>
          <ListItemText primary="Nastavenie Parametrov" />
        </ListItem>

        <ListItem>
          <TextField type="text" label="id" value={newBoiler.id} name="id" onChange={handleChange} />
        </ListItem>
        <ListItem>
          <TextField type="text" label="meno" value={newBoiler.name} name="name" onChange={handleChange} />
        </ListItem>
        <ListItem>
          <TextField type="text" label="perióda" value={newBoiler.period} name="period" onChange={handleChange} />
        </ListItem>

        <ListItem className="flex justify-around">
          <Button
            className="whitespace-nowrap"
            variant="contained"
            color="secondary"
            onClick={() => deleteAndSetBoilerDocument()}
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

export default TableParametersModal;
