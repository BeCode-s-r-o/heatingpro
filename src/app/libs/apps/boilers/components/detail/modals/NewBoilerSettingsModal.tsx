import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { showMessage } from 'app/store/slices/messageSlice';
import { doc, updateDoc } from 'firebase/firestore';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { TBoiler } from '@app/types/TBoilers';
import { AppDispatch } from 'app/store/index';
import { useDispatch } from 'react-redux';
import { db } from 'src/firebase-config';
import { getBoiler } from '../../../store/boilersSlice';
import SettingsModalColumn from './SettingsModalColumn';

interface Props {
  boiler: TBoiler;
  isOpen: boolean;
  toggleOpen: () => void;
}

const columnOptions = [
  { name: 'K1P', desc: 'Kotol 1 prívod', unit: '°C' },
  { name: 'K2P', desc: 'Kotol 2 prívod', unit: '°C' },
  { name: 'K3P', desc: 'Kotol 3 prívod', unit: '°C' },
  { name: 'K4P', desc: 'Kotol 4 prívod', unit: '°C' },
  { name: 'K5P', desc: 'Kotol 5 prívod', unit: '°C' },
  { name: 'VOP1', desc: 'Vykurovací okruh prívod 1', unit: '°C' },
  { name: 'VOS1', desc: 'Vykurovací okruh spiatočka 1', unit: '°C' },
  { name: 'VOP2', desc: 'Vykurovací okruh prívod 2', unit: '°C' },
  { name: 'VOS2', desc: 'Vykurovací okruh spiatočka 2', unit: '°C' },
  { name: 'VOP3', desc: 'Vykurovací okruh prívod 3', unit: '°C' },
  { name: 'VOS3', desc: 'Vykurovací okruh spiatočka 3', unit: '°C' },
  { name: 'VOP4', desc: 'Vykurovací okruh prívod 4', unit: '°C' },
  { name: 'VOS4', desc: 'Vykurovací okruh spiatočka 4', unit: '°C' },
  { name: 'VOP5', desc: 'Vykurovací okruh prívod 5', unit: '°C' },
  { name: 'VOS5', desc: 'Vykurovací okruh spiatočka 5', unit: '°C' },
  { name: 'TPP', desc: 'Teplota prívod primár', unit: '°C' },
  { name: 'TSP', desc: 'Teplota spiatočka primár', unit: '°C' },
  { name: 'VT', desc: 'Vonkajšia teplota', unit: '°C' },
  { name: 'T TUV', desc: 'Teplota teplej užitkovej vody', unit: '°C' },
  { name: 'T TUVc', desc: 'Teplota TUV cirkulácia', unit: '°C' },
  { name: 'S CO2', desc: 'Snímač CO2', unit: '0/1' },
  { name: 'TVS', desc: 'Tlak vykurovacieho systému', unit: 'bar' },
  { name: 'S TP', desc: 'Snímač tlaku plynu', unit: 'bar' },
  { name: 'S ZK', desc: 'Snímač zaplavenia kotolne', unit: '0/1' },
  { name: 'S UP', desc: 'Snímač úniku plynu', unit: '0/1' },
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
            <ListItemText
              primary="Nastavenie stĺpcov"
              secondary=" Pri nastavovaní limitov (minimum a maximum) je technicky možné nastaviť maximálne 15 stĺpcov naraz, teda 15
            riadkom viete nastaviť zvlášť 15 minimum a 15 maximum hodnôt. V prípade, že nastavujete viac ako 15tim
            riadkom limity naraz, po zmene prvých 15 kliknite na uložiť a potom pristúpte k nastaveniu ďalších
            znovukliknutím na tlačidlo Nastaviť stĺpce."
            />
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
