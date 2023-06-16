import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { showMessage } from 'app/store/slices/messageSlice';
import { doc, updateDoc } from 'firebase/firestore';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TBoiler } from '@app/types/TBoilers';
import { AppDispatch } from 'app/store/index';
import { useDispatch } from 'react-redux';
import { db } from 'src/firebase-config';
import { getBoiler } from '../../../store/boilersSlice';
import { DragNDropColumn } from './DragNDropColumn';
import axios from 'axios';
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

  const handleSort = () => {
    let _tableColums = [...tableColumns];

    const draggedItemContent = _tableColums.splice(dragItem.current, 1)[0];

    _tableColums.splice(dragOverItem.current, 0, draggedItemContent);

    dragItem.current = null;
    dragOverItem.current = null;

    setTableColumns(_tableColums);
  };

  const handleChange = useCallback((e, attribute, value) => {
    const columnName = e.target.name;

    setTableColumns((prevColumns) =>
      prevColumns.map((column) =>
        String(column.accessor) === columnName
          ? {
              ...column,
              [attribute]: value,
            }
          : column
      )
    );

    if (attribute === 'min' || attribute === 'max') {
      setArrayOfLimits((prevLimits) => (prevLimits.includes(columnName) ? prevLimits : [...prevLimits, columnName]));
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
      throw error;
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
      <List className="w-[700px]">
        <ListItem>
          <ListItemText primary="Nastavenie stĺpcov" />
        </ListItem>
        {tableColumns?.map((column, index) => (
          <DragNDropColumn
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

        <ListItem className="flex justify-end gap-12 sticky bottom-0 z-50 bg-white">
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
        </ListItem>
      </List>
    </Drawer>
  );
}

export default SettingsModal;
