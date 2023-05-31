import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { useEffect, useState } from 'react';
import FuseSvgIcon from '@app/core/SvgIcon';
import { useDispatch } from 'react-redux';
import { showMessage } from 'app/store/slices/messageSlice';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from 'src/firebase-config';
import { getBoiler } from '../../../store/boilersSlice';
import { AppDispatch } from 'app/store/index';
interface Props {
  isOpen: boolean;
  close: () => void;
  columns: { field: string; headerName: string; unit: string }[];
  rows: {}[];
  deviceID: string;
}

function AddColumnModal({ isOpen, close, columns, deviceID, rows }: Props) {
  const [formFields, setFormFields] = useState<{ name: string; unit: string }[]>([{ name: '', unit: '' }]);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (columns.length > 0) {
      setFormFields(columns.map((column) => ({ name: column.headerName, unit: column.unit })));
    }
  }, [columns]);

  const hanldeChange = (event, index) => {
    let { name, value } = event.target;
    let actualFormFields = [...formFields];
    actualFormFields[index][name] = value;
    setFormFields(actualFormFields);
  };
  const handleUnitChange = (event) => {
    let { name, value } = event.target;
    setFormFields((prev) => prev.map((column) => (column.name === name ? { ...column, unit: value } : column)));
  };
  const submit = (e) => {
    e.preventDefault();

    const newColumns = formFields.map((column) => ({ field: column.name, headerName: column.name, unit: column.unit }));
    if (existDuplicateColumn(newColumns)) {
      dispatch(showMessage({ message: 'Vyskytol sa duplicitný stĺpec' }));
      return;
    }
    try {
      const boilerRef = doc(db, 'boilers', deviceID);
      updateDoc(boilerRef, { monthTable: { columns: [...newColumns], rows: addEmptyValueForRows() } });
      close();
    } catch (error) {
      dispatch(showMessage({ message: 'Ups, vyskytla sa chyba ' + error }));
    }
    dispatch(getBoiler(deviceID || ''));
    dispatch(showMessage({ message: 'Zmeny boli úspešne uložené' }));
  };

  const addFields = () => {
    let object = {
      name: '',
      unit: '',
    };

    setFormFields([...formFields, object]);
  };
  const addEmptyValueForRows = () => {
    const newColumns = formFields.map((column) => column.name);
    const updatedRows: {}[] = [];
    for (let i = 0; i < rows.length; i++) {
      var updatedRow = { ...rows[i] };
      for (let j = 0; j < newColumns.length; j++) {
        if (updatedRow[newColumns[j]] !== '-' && updatedRow[newColumns[j]] === undefined) {
          console.log(updatedRow[newColumns[j]]);
          updatedRow[newColumns[j]] = '-';
        }
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
      <List className="w-[350px]">
        <ListItem>
          <ListItemText primary="Upravovanie stĺpcov" />
        </ListItem>
        <form onSubmit={submit}>
          {formFields.map((field, index) => (
            <ListItem key={index}>
              <TextField
                name="name"
                label="Názov"
                placeholder={field.name !== '' ? field.name : 'Názov'}
                onChange={(event) => hanldeChange(event, index)}
                value={field.name}
                required
                className="w-full"
              />

              <FormControl fullWidth>
                <InputLabel id="choice-label">Jednotka</InputLabel>
                <Select
                  labelId="choice-label"
                  id="choice"
                  label="Jednotka"
                  name={field.name}
                  value={field.unit}
                  onChange={(e) => handleUnitChange(e)}
                >
                  <MenuItem value="mwh">MWh</MenuItem>
                  <MenuItem value="kwh">kWh</MenuItem>
                  <MenuItem value="gj">GJ</MenuItem>
                  <MenuItem value="m3">m³</MenuItem>
                </Select>
              </FormControl>

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
        <ListItem className="flex justify-end gap-12">
          <Button variant="contained" onClick={submit} color="primary">
            Uložiť
          </Button>
          <Button variant="contained" onClick={close} color="secondary">
            Zrušiť
          </Button>
        </ListItem>
      </List>
    </Drawer>
  );
}

export default AddColumnModal;
