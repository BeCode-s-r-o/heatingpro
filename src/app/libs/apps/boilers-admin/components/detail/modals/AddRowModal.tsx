import { Button, Drawer, List, ListItem, ListItemText, TextField, Typography } from '@mui/material';
import { AppDispatch } from 'app/store/index';
import { showMessage } from 'app/store/slices/messageSlice';
import { doc, setDoc } from 'firebase/firestore';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { db } from 'src/firebase-config';
import { v4 } from 'uuid';

function AddRowModal({ isOpen, close, existingRows, deviceID, columns }) {
  const [newRow, setNewRow] = useState<any>();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    setNewRow(columns.map((column) => ({ [column.field]: '', name: column.field, unit: column.unit })));
  }, [columns]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRow((prev) => prev.map((i) => (i.name === e.target.name ? { ...i, [name]: value } : i)));
  };
  function convertRowFromArrayToObject(arr) {
    const row = {};
    for (let i = 0; i < arr.length; i++) {
      const obj = arr[i];
      for (let key in obj) {
        if (key !== 'name' && key !== 'unit') {
          row[key] = obj[key] ? Number(obj[key].replaceAll(',', '.')) : 0;
        }
      }
    }
    return row;
  }

  const submit = (e) => {
    e.preventDefault();
    const createdRow = convertRowFromArrayToObject(newRow);
    const newRowData = {
      ...createdRow,
      boilerId: deviceID,
      date: moment().valueOf(),
      id: v4(),
    };

    try {
      const ref = doc(db, 'monthTableValues', newRowData.id);
      setDoc(ref, newRowData);

      close();
    } catch (error) {
      dispatch(showMessage({ message: 'Ups, vyskytla sa chyba ' + error }));
    }
    dispatch(showMessage({ message: 'Záznam úspešné pridaný' }));
  };

  return (
    <Drawer anchor="right" open={isOpen} onClose={close}>
      <div className="max-w-[98vw] overflow-x-scroll">
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
                      className="w-full"
                      name={column.name}
                      label={column.name}
                      onChange={handleChange}
                      value={column[column.name]}
                      required
                      InputProps={{
                        endAdornment: <Typography>{column.unit}</Typography>,
                      }}
                    />
                  </ListItem>
                );
              })}
            </form>
          )}

          <br />
          <ListItem className="flex justify-end gap-12 sticky bottom-0 z-50 bg-white">
            <Button variant="contained" onClick={submit} color="primary">
              Pridať
            </Button>
            <Button variant="contained" onClick={close} color="secondary">
              Zrušiť
            </Button>
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
}

export default AddRowModal;
