import { Drawer, List, ListItem, ListItemText, TextField, Button } from '@mui/material';
import { useState } from 'react';
import FuseSvgIcon from '@app/core/SvgIcon';
import { useDispatch } from 'react-redux';
import { showMessage } from 'app/store/slices/messageSlice';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from 'src/firebase-config';
import { getBoiler } from '../../store/boilersSlice';
import { AppDispatch } from 'app/store/index';
interface Props {
  isOpen: boolean;
  close: () => void;
  columns: { field: string; headerName: string }[];
  rows: {}[];
  deviceID: string;
}

function AddColumnModal({ isOpen, close, columns, deviceID, rows }: Props) {
  const [formFields, setFormFields] = useState([{ name: '' }]);
  const dispatch = useDispatch<AppDispatch>();
  const hanldeChange = (event, index) => {
    let { name, value } = event.target;
    let data = [...formFields];
    data[index][name] = value;
    setFormFields(data);
  };

  const submit = (e) => {
    e.preventDefault();

    const newColumns = formFields.map((column) => ({ field: column.name, headerName: column.name }));
    if (existDuplicateColumn([...newColumns, ...columns])) {
      dispatch(showMessage({ message: 'Vyskytol sa duplicitný stĺpec' }));
      return;
    }
    try {
      const boilerRef = doc(db, 'boilers', deviceID);
      updateDoc(boilerRef, { monthTable: { columns: [...columns, ...newColumns], rows: addEmptyValueForRows() } });
      close();
    } catch {
      dispatch(showMessage({ message: 'Ups, vyskytla sa chyba' }));
    }
    dispatch(getBoiler(deviceID || ''));
    dispatch(showMessage({ message: 'Stĺpec úspešné pridaný' }));
  };

  const addFields = () => {
    let object = {
      name: '',
    };

    setFormFields([...formFields, object]);
  };
  const addEmptyValueForRows = () => {
    const newColumns = formFields.map((column) => column.name);
    const updatedRows: {}[] = [];
    for (let i = 0; i < rows.length; i++) {
      var updatedRow = { ...rows[i] };
      for (let j = 0; j < newColumns.length; j++) {
        updatedRow[newColumns[j]] = '-';
        console.log(i, j);
      }
      updatedRows.push(updatedRow);
    }
    return updatedRows;
  };

  const removeFields = (index) => {
    let data = [...formFields];
    data.splice(index, 1);
    setFormFields(data);
  };
  const existDuplicateColumn = (columns) => {
    const names = new Set();
    for (let column of columns) {
      if (names.has(column.field)) {
        return true;
      }
      names.add(column.field);
    }
    return false;
  };
  return (
    <Drawer anchor="right" open={isOpen} onClose={close}>
      <List className="w-[300px]">
        <ListItem>
          <ListItemText primary="Pridávanie stĺpcov" />
        </ListItem>
        <form onSubmit={submit}>
          {formFields.map((form, index) => (
            <ListItem key={index}>
              <TextField
                name="name"
                label="Názov"
                placeholder="Názov"
                onChange={(event) => hanldeChange(event, index)}
                value={form.name}
                required
              />

              <Button onClick={() => removeFields(index)}>
                <FuseSvgIcon size={20}>heroicons-solid:trash</FuseSvgIcon>
              </Button>
            </ListItem>
          ))}
        </form>
        <ListItem>
          <Button onClick={addFields} className="mx-auto">
            <FuseSvgIcon size={20}>heroicons-solid:plus-circle</FuseSvgIcon>
          </Button>
        </ListItem>
        <br />
        <Button variant="contained" className="mx-12" onClick={close} color="primary">
          Zrušiť
        </Button>
        <Button variant="contained" onClick={submit} color="secondary">
          Pridať
        </Button>
      </List>
    </Drawer>
  );
}

export default AddColumnModal;
