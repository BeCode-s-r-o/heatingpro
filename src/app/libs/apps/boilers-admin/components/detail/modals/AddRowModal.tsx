import { Drawer, List, ListItem, ListItemText, TextField, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from 'src/firebase-config';
import { useDispatch } from 'react-redux';
import { showMessage } from 'app/store/slices/messageSlice';
import { getBoiler } from '../../../store/boilersSlice';
import { AppDispatch } from 'app/store/index';
import { getCurrentDate } from '../functions/datesOperations';
function AddRowModal({ isOpen, close, existingRows, deviceID, columns }) {
  const [newRow, setNewRow] = useState<any>();
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    setNewRow(columns.map((column) => ({ [column.field]: '', name: column.field })));
  }, [columns]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRow((prev) => prev.map((i) => (i.name === e.target.name ? { ...i, [name]: value } : i)));
  };
  function convertRowFromArrayToObject(arr) {
    const row = { id: Date.now() };
    for (let i = 0; i < arr.length; i++) {
      const obj = arr[i];
      for (let key in obj) {
        if (key !== 'name') {
          row[key] = obj[key];
        }
      }
    }
    return { ...row, date: getCurrentDate() };
  }

  const submit = (e) => {
    e.preventDefault();
    const createdRow = convertRowFromArrayToObject(newRow);
    try {
      const boilerRef = doc(db, 'boilers', deviceID);
      updateDoc(boilerRef, { monthTable: { rows: [...existingRows, createdRow], columns: columns } });
      close();
    } catch {
      dispatch(showMessage({ message: 'Ups, vyskytla sa chyba' }));
    }
    dispatch(showMessage({ message: 'Záznam úspešné pridaný' }));
    dispatch(getBoiler(deviceID || ''));
  };

  return (
    <Drawer anchor="right" open={isOpen} onClose={close}>
      <List className="w-[300px]">
        <ListItem>
          <ListItemText
            primary={newRow?.length !== 0 ? 'Pridávanie záznamu' : 'Pre pridanie záznamu musíte pridať stĺpce'}
          />
        </ListItem>
        {newRow && (
          <form onSubmit={submit}>
            {newRow.map((column, index) => {
              return (
                <ListItem key={index}>
                  <TextField
                    name={column.name}
                    label={column.name}
                    onChange={handleChange}
                    value={column[column.name]}
                    required
                  />
                </ListItem>
              );
            })}
          </form>
        )}

        <br />
        <ListItem className="flex justify-end gap-12">
          <Button variant="contained" onClick={submit} color="primary">
            Pridať
          </Button>
          <Button variant="contained" onClick={close} color="secondary">
            Zrušiť
          </Button>
        </ListItem>
      </List>
    </Drawer>
  );
}

export default AddRowModal;
