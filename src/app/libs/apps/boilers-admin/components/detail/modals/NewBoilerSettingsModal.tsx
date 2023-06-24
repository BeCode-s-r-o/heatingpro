import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
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
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';

interface Props {
  boiler: TBoiler;
  isOpen: boolean;
  toggleOpen: () => void;
}

const columnOptions = [
  { name: 'K1', desc: 'Kotol 1', unit: '0/1' },
  { name: 'K2', desc: 'Kotol 2', unit: '0/1' },
  { name: 'K3', desc: 'Kotol 3', unit: '0/1' },
  { name: 'K4', desc: 'Kotol 4', unit: '0/1' },
  { name: 'K5', desc: 'Kotol 5', unit: '0/1' },
  { name: 'VO6', desc: 'Vykurovací okruh prívod 1', unit: '°C' },
  { name: 'VO7', desc: 'Vykurovací okruh spiatočka 1', unit: '°C' },
  { name: 'VO8', desc: 'Vykurovací okruh prívod 2', unit: '°C' },
  { name: 'MT TUV', desc: 'Vykurovací okruh spiatočka 2', unit: '°C' },
  { name: 'VnDVS', desc: 'Vykurovací okruh prívod 3', unit: '°C' },
  { name: 'VCH', desc: 'Vykurovací okruh spiatočka 3', unit: '°C' },
  { name: 'VpZ', desc: 'Vykurovací okruh prívod 4', unit: '°C' },
  { name: 'MT VZT', desc: 'Vykurovací okruh spiatočka 4', unit: '°C' },
  { name: 'Elektro', desc: 'Vykurovací okruh prívod 5', unit: '°C' },
  { name: 'Plyn', desc: 'Vykurovací okruh spiatočka 5', unit: '°C' },
  { name: 'TPP', desc: 'Teplota prívod primár', unit: '°C' },
  { name: 'TSP', desc: 'Teplota spiatočka primár', unit: '°C' },
  { name: 'VT', desc: 'Vonkajšia teplota', unit: '°C' },
  { name: 'T TUV', desc: 'teplota teplej užitkovej vody', unit: '°C' },
  { name: 'CO2', desc: 'Snímač CO2', unit: 'ppm' },
  { name: 'TV', desc: 'Snímač tlaku vykurovania', unit: 'kPa' },
  { name: 'TP', desc: 'Snímač tlaku plynu', unit: 'kPa' },
  { name: 'U', desc: 'Snímač zaplavenia kotolne', unit: '0/1' },
  { name: 'UP', desc: 'Snímač úniku plynu', unit: '0/1' },
  { name: 'SPK', desc: 'Sumárna porucha kotolne', unit: '0/1' },
];

function NewBoilerSettingsModal({ boiler, isOpen, toggleOpen }: Props) {
  const [digitalInput, setDigitalInput] = useState<any>([]);
  const [inputData, setInputData] = useState<any>([]);

  useEffect(() => {
    if (boiler.sms?.length > 0) {
      setDigitalInput(initializeNewColumns(boiler.sms[0].body?.digitalInput));
      setInputData(initializeNewColumns(boiler.sms[0].body?.inputData));
    }
  }, [boiler]);

  const initializeNewColumns = useMemo(
    () => (data) => {
      const emptyColumn = { columnName: '', desc: '', hide: false, max: 99, min: 0, unit: '' };
      return data.map((value, index) => ({
        ...emptyColumn,
        accessor: self.crypto.randomUUID(),
        order: index,
        value: value === null ? '-' : value,
      }));
    },
    []
  );

  const dispatch = useDispatch<AppDispatch>();

  const createHandleChange = (setState) => (e, attribute, value) => {
    if (attribute === 'hide') {
      value = !e.target.checked;
    }

    setState((prev) =>
      prev.map((column) => (column.accessor === e.target.name ? { ...column, [attribute]: value } : column))
    );
  };

  const handleDataChange = useCallback(createHandleChange(setInputData), []);
  const handleInChange = useCallback(createHandleChange(setDigitalInput), []);

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

  const createColumnNameHandleChange = (setState) => (e, field, value) => {
    if (field === 'hide') {
      value = !e.target.checked;
    }

    setState((prev) =>
      prev.map((column) => {
        if (column.accessor === e.target.name) {
          const selectedColumnName = value as string;
          const selectedColumn = columnOptions.find((column) => column.name === selectedColumnName);

          return {
            ...column,
            [field]: value,
            desc: selectedColumn?.desc || '',
            unit: selectedColumn?.unit || '',
          };
        }
        return column;
      })
    );
  };
  const handleDataNameChange = useCallback(createColumnNameHandleChange(setInputData), []);
  const handleInNameChange = useCallback(createColumnNameHandleChange(setDigitalInput), []);
  return (
    <Drawer anchor="right" open={isOpen} onClose={toggleOpen}>
      <div className="max-w-[98vw] overflow-x-scroll">
        <List className="w-[700px]">
          <ListItem>
            <ListItemText primary="Nastavenie stĺpcov" />
          </ListItem>
          <Typography className="text-lg font-bold text-center border-b my-12">Dáta zo vstupu</Typography>
          {inputData.map((item, index) => (
            <SettingsModalColumn
              key={index}
              item={item}
              handleChange={handleDataChange}
              columnOptions={columnOptions}
              handleColumnNameChange={handleDataNameChange}
            />
          ))}
          <Typography className="text-lg font-bold text-center border-b my-12">Digitálny vstup</Typography>
          {digitalInput.map((item, index) => (
            <SettingsModalColumn
              key={index}
              item={item}
              handleChange={handleInChange}
              columnOptions={columnOptions}
              handleColumnNameChange={handleInNameChange}
            />
          ))}
          <ListItem className="flex justify-end gap-12 sticky bottom-0 z-50 bg-white">
            <Button
              className="whitespace-nowrap"
              variant="contained"
              color="primary"
              onClick={() => saveColumnsForBoilerInFirebase([...inputData, ...digitalInput])}
            >
              Uložiť
            </Button>
            <Button className="whitespace-nowrap" variant="contained" color="secondary" onClick={toggleOpen}>
              Zrušiť
            </Button>
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
}

export default NewBoilerSettingsModal;
