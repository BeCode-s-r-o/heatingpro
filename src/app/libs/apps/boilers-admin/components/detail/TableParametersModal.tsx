import { useRef, useState } from 'react';

import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { tempColumns } from '../../constants';
import { db } from 'src/firebase-config';

function TableParametersModal({ data, isOpen, toggleOpen }) {
  const [boilerData, setBoilerData] = useState(data);

  const handleChange = (e) => {
    const value = e.target.value;

    setBoilerData((prev) => ({
      ...prev,
      [e.target.name]: value,
    }));
  };

  const saveColumnsInFirebase = (columns) => {
    try {
      const orderedColumns = columns.map((column, index) => ({ ...column, order: index }));

      const boilerRef = doc(db, 'boilers', '0002A'); //boiler id

      updateDoc(boilerRef, { columns: orderedColumns });
    } catch (error) {
      console.error(error);
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
          <TextField type="text" value={boilerData.id} name="id" onChange={handleChange} />
        </ListItem>
        <ListItem>
          <TextField type="text" label="jedn." value={boilerData.name} name="name" onChange={handleChange} />
        </ListItem>
        <ListItem>
          <TextField type="text" label="id" value={boilerData.period} name="period" onChange={handleChange} />
        </ListItem>

        <ListItem className="flex justify-around">
          <Button
            className="whitespace-nowrap"
            variant="contained"
            color="secondary"
            onClick={() => saveColumnsInFirebase(boilerData)}
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
