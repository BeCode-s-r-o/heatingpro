import { useRef, useState } from 'react';
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
import { getBoiler } from '../../store/boilersSlice';
import { AppDispatch } from 'app/store/index';
import HeightIcon from '@mui/icons-material/Height';
interface Props {
  boiler: TBoiler;
  isOpen: boolean;
  toggleOpen: () => void;
}
function SettingsModal({ boiler, isOpen, toggleOpen }: Props) {
  const [tableColumns, setTableColumns] = useState(boiler.columns);
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

  const handleChange = (e, attribute, value) => {
    if (attribute === 'hide') {
      const value = !e.target.checked;
    }

    setTableColumns((prev) =>
      prev.map((column) => (column.accessor === e.target.name ? { ...column, [attribute]: value } : column))
    );
  };

  const saveColumnsForBoilerInFirebase = (columns) => {
    try {
      const orderedColumns = columns.map((column, index) => ({ ...column, order: index }));
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
      <List className="w-[500px]">
        <ListItem>
          <ListItemText primary="Nastavenie stĺpcov" />
        </ListItem>
        {tableColumns.map((item, index) => (
          <ListItem
            key={index}
            button
            draggable
            onDragStart={(e) => (dragItem.current = index)}
            onDragEnter={(e) => (dragOverItem.current = index)}
            onDragEnd={handleSort}
            onDragOver={(e) => e.preventDefault()}
            className="cursor-move"
          >
            <TextField
              type="text"
              value={item.columnName}
              name={item.accessor}
              onChange={(e) => handleChange(e, 'columnName', e.target.value)}
              className="w-[165px] "
            />
            <TextField
              type="text"
              label="jedn."
              value={item.unit}
              name={item.accessor}
              onChange={(e) => handleChange(e, 'unit', e.target.value)}
              className="w-[60px] px-6"
            />
            <TextField
              type="number"
              label="Min"
              value={item.min || undefined}
              name={item.accessor}
              onChange={(e) => handleChange(e, 'min', e.target.value)}
              className="w-[70px] pr-6"
            />
            <TextField
              type="number"
              label="Max"
              value={item.max || undefined}
              name={item.accessor}
              onChange={(e) => handleChange(e, 'max', e.target.value)}
              className="w-[70px]"
            />{' '}
            <Switch
              checked={!item.hide}
              name={item.accessor}
              onChange={(e) => {
                handleChange(e, 'hide', !e.target.checked);
              }}
            />
            <ListItemSecondaryAction className="mx-12 cursor-move -z-10">
              <HeightIcon />
            </ListItemSecondaryAction>
          </ListItem>
        ))}

        <ListItem className="flex justify-around">
          <Button
            className="whitespace-nowrap"
            variant="contained"
            color="secondary"
            onClick={() => saveColumnsForBoilerInFirebase(tableColumns)}
          >
            Uložiť
          </Button>
          <Button className="whitespace-nowrap" variant="contained" color="primary" onClick={toggleOpen}>
            Zrušiť
          </Button>
        </ListItem>
      </List>
    </Drawer>
  );
}

export default SettingsModal;
