import { useCallback, useRef, useState } from 'react';
import { showMessage } from 'app/store/slices/messageSlice';
import Button from '@mui/material/Button';
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
import { DragNDropColumn } from './DragNDropColumn';
interface Props {
  boiler: TBoiler;
  isOpen: boolean;
  toggleOpen: () => void;
}
function SettingsModal({ boiler, isOpen, toggleOpen }: Props) {
  const [tableColumns, setTableColumns] = useState(boiler?.columns || []);
  const dispatch = useDispatch<AppDispatch>();
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

    setTableColumns((prev) =>
      prev.map((column) =>
        String(column.accessor) === columnName
          ? {
              ...column,
              [attribute]: value,
            }
          : column
      )
    );
  }, []);

  const saveColumnsForBoilerInFirebase = (columns) => {
    try {
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
            key={index}
            column={column}
            index={index}
            onChange={handleChange}
            onDragStart={() => (dragItem.current = index)}
            onDragEnter={() => (dragOverItem.current = index)}
            onDragEnd={handleSort}
          />
        ))}

        <ListItem className="flex justify-end gap-12">
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
