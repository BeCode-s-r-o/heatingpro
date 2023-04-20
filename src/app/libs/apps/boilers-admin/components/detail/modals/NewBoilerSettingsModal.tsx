import { useRef, useState, useEffect, useCallback } from 'react';
import { showMessage } from 'app/store/slices/messageSlice';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

import { db } from 'src/firebase-config';
import { TBoiler } from '@app/types/TBoilers';
import { useDispatch } from 'react-redux';
import { getBoiler } from '../../../store/boilersSlice';
import { AppDispatch } from 'app/store/index';
import HeightIcon from '@mui/icons-material/Height';
import SettingsModalColumn from '../modals/SettingsModalColumn';
interface Props {
  boiler: TBoiler;
  isOpen: boolean;
  toggleOpen: () => void;
}
function NewBoilerSettingsModal({ boiler, isOpen, toggleOpen }: Props) {
  const [digitalInput, setDigitalInput] = useState<any>([]);
  const [digitalOutput, setDigitalOutput] = useState<any>([]);
  const [inputData, setInputData] = useState<any>([]);

  useEffect(() => {
    if (boiler.sms?.length > 0) {
      setDigitalInput(initializeNewColumns(boiler.sms[0].body?.digitalInput));
      setDigitalOutput(initializeNewColumns(boiler.sms[0].body?.digitalOutput));
      setInputData(initializeNewColumns(boiler.sms[0].body?.inputData));
    }
  }, [boiler]);

  const initializeNewColumns = (data) => {
    const emptyColumn = { columnName: '', desc: '', hide: false, max: 0, min: 0, unit: '' };
    return data.map((value, index) => ({
      ...emptyColumn,
      accessor: self.crypto.randomUUID(),
      order: index,
      value: value === null ? '-' : value,
    }));
  };
  const dispatch = useDispatch<AppDispatch>();

  const createHandleChange = (setState) => (e, attribute, value) => {
    if (attribute === 'hide') {
      value = !e.target.checked;
    }

    setState((prev) =>
      prev.map((column) => (column.accessor === e.target.name ? { ...column, [attribute]: value } : column))
    );
  };

  const handleInChange = useCallback(createHandleChange(setDigitalInput), []);
  const handleOutChange = useCallback(createHandleChange(setDigitalOutput), []);
  const handleDataChange = useCallback(createHandleChange(setInputData), []);

  const saveColumnsForBoilerInFirebase = (columns) => {
    try {
      const orderedColumns = columns.map((column, index) => ({ ...column, order: index, accessor: String(index) }));

      const boilerRef = doc(db, 'boilers', boiler.id);

      updateDoc(boilerRef, { columns: orderedColumns });
      dispatch(getBoiler(boiler.id || ''));
      toggleOpen();
      dispatch(showMessage({ message: 'Zmeny boli uložené' }));
    } catch (error) {
      dispatch(showMessage({ message: 'Vyskytol sa nejaký problém' }));
    }
  };

  return (
    <Drawer anchor="right" open={isOpen} onClose={toggleOpen}>
      <List className="w-[700px]">
        <ListItem>
          <ListItemText primary="Nastavenie stĺpcov" />
        </ListItem>
        <Typography className="text-lg font-bold text-center border-b my-12">Digitálny vstup</Typography>

        {digitalInput.map((item, index) => (
          <SettingsModalColumn key={index} item={item} handleChange={handleInChange} />
        ))}
        <Typography className="text-lg font-bold text-center border-b my-12">Digitálny výstup</Typography>
        {digitalOutput.map((item, index) => (
          <SettingsModalColumn key={index} item={item} handleChange={handleOutChange} />
        ))}
        <Typography className="text-lg font-bold text-center border-b my-12">Dáta zo vstupu</Typography>
        {inputData.map((item, index) => (
          <SettingsModalColumn key={index} item={item} handleChange={handleDataChange} />
        ))}
        <ListItem className="flex justify-end gap-12">
          <Button
            className="whitespace-nowrap"
            variant="contained"
            color="primary"
            onClick={() => saveColumnsForBoilerInFirebase([...digitalInput, ...digitalOutput, ...inputData])}
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

export default NewBoilerSettingsModal;
