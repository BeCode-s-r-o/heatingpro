import { TBoiler } from '@app/types/TBoilers';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import * as Sentry from '@sentry/react';
import { AppDispatch } from 'app/store/index';
import { showMessage } from 'app/store/slices/messageSlice';
import axios from 'axios';
import { doc, updateDoc } from 'firebase/firestore';
import { useCallback, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { db } from 'src/firebase-config';
import { getBoiler } from '../../../store/boilersSlice';
import { DragNDropColumn } from './DragNDropColumn';

interface Props {
  boiler: TBoiler;
  isOpen: boolean;
  toggleOpen: () => void;
  columnsValues: any[];
}
function SettingsModal({ boiler, isOpen, toggleOpen, columnsValues }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const [arrayOfLimits, setArrayOfLimits] = useState<any[]>([]);
  const [tableColumns, setTableColumns] = useState(boiler?.columns || []);
  const dragItem = useRef<any>(null);
  const dragOverItem = useRef<any>(null);
  const columnOptions = [
    { name: 'K1', desc: 'Kotol 1', unit: '0/1' },
    { name: 'K2', desc: 'Kotol 2', unit: '0/1' },
    { name: 'K3', desc: 'Kotol 3', unit: '0/1' },
    { name: 'K4', desc: 'Kotol 4', unit: '0/1' },
    { name: 'K5', desc: 'Kotol 5', unit: '0/1' },
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
    { name: 'S CO2', desc: 'Snímač CO2', unit: '0/1' },
    { name: 'S TV', desc: 'Snímač tlaku vykurovania', unit: 'bary' },
    { name: 'S TP', desc: 'Snímač úniku plynu', unit: 'bary' },
    { name: 'S ZK', desc: 'Snímač zaplavenia kotolne', unit: '0/1' },
    { name: 'S UP', desc: 'Snímač úniku plynu', unit: '0/1' },
    { name: 'SPK', desc: 'Sumárna porucha kotolne', unit: '0/1' },
  ];
  const handleSort = () => {
    let _tableColums = [...tableColumns];

    const draggedItemContent = _tableColums.splice(dragItem.current, 1)[0];

    _tableColums.splice(dragOverItem.current, 0, draggedItemContent);

    dragItem.current = null;
    dragOverItem.current = null;

    setTableColumns(_tableColums);
  };

  const handleChange = useCallback((columnID, attribute, value) => {
    setTableColumns((prevColumns) =>
      prevColumns.map((column) =>
        String(column.accessor) === columnID
          ? {
              ...column,
              [attribute]: value,
              ...(attribute === 'columnName' && columnOptions.find((option) => option.name === value)),
            }
          : column
      )
    );

    if (attribute === 'min' || attribute === 'max') {
      setArrayOfLimits((prevLimits) => (prevLimits.includes(columnID) ? prevLimits : [...prevLimits, columnID]));
    }
  }, []);

  const sendSmsToChangeLimits = async (limits) => {
    const data = {
      phoneNumber: boiler?.phoneNumber,
      boilerId: boiler?.id,
      limits: limits,
    };
    try {
      await axios.post('https://api.monitoringpro.sk/change-limits', data);
    } catch (error) {
      Sentry.captureException(error);
      dispatch(showMessage({ message: 'Vyskytla sa chyba pri nastavovaní periódy!' }));
    }
  };

  const saveColumnsForBoilerInFirebase = (columns) => {
    try {
      if (arrayOfLimits.length > 0) {
        const arrayOfLimitsForSms = arrayOfLimits.map((accessor) => {
          const column = tableColumns.find((column) => column.accessor === accessor);
          if (column) {
            const min = column.min < 10 ? `0${column.min}` : column.min;
            const max = column.max < 10 ? `0${column.max}` : column.max;
            const limit = `${min}${max}`;
            return {
              columnAccessor: column.accessor,
              limit: limit,
            };
          }
        });
        sendSmsToChangeLimits(arrayOfLimitsForSms);
      }
      const orderedColumns = columns.map((column, index) => ({ ...column, order: index }));
      const boilerRef = doc(db, 'boilers', boiler.id);
      updateDoc(boilerRef, { columns: orderedColumns });
      dispatch(getBoiler(boiler?.id || ''));
      toggleOpen();
      dispatch(showMessage({ message: 'Zmeny boli uložené' }));
    } catch (error) {
      dispatch(showMessage({ message: 'Vyskytol sa nejaký problém' }));
    }
  };

  return (
    <Drawer anchor="right" open={isOpen} onClose={toggleOpen}>
      <div className="max-w-[98vw] overflow-x-scroll">
        <List className="w-[750px]">
          <ListItem>
            <ListItemText
              primary="Nastavenie stĺpcov"
              secondary=" Pri nastavovaní limitov (minimum a maximum) je technicky možné nastaviť maximálne 15 stĺpcov naraz, teda 15
            riadkom viete nastaviť zvlášť 15 minimum a 15 maximum hodnôt. V prípade, že nastavujete viac ako 15tim
            riadkom limity naraz, po zmene prvých 15 kliknite na uložiť a potom pristúpte k nastaveniu ďalších
            znovukliknutím na tlačidlo Nastaviť stĺpce."
            />
          </ListItem>

          {tableColumns?.map((column, index) => (
            <DragNDropColumn
              columnOptions={columnOptions}
              valueFromPlaceInSms={columnsValues?.[Number(column.accessor)]}
              key={index}
              column={column}
              index={index}
              onChange={handleChange}
              onDragStart={() => (dragItem.current = index)}
              onDragEnter={() => (dragOverItem.current = index)}
              onDragEnd={handleSort}
            />
          ))}

          <div className="flex justify-end gap-12 sticky bottom-0 z-50 bg-white ">
            <Button
              className="whitespace-nowrap"
              variant="contained"
              color="primary"
              onClick={() => saveColumnsForBoilerInFirebase(tableColumns)}
            >
              Uložiť
            </Button>
            <Button className="whitespace-nowrap" variant="contained" color="secondary" onClick={toggleOpen}>
              Zrušiť
            </Button>
          </div>
        </List>
      </div>
    </Drawer>
  );
}

export default SettingsModal;
