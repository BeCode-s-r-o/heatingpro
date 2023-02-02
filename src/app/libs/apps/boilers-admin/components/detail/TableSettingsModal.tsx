import { useRef, useState } from 'react';

import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { tempColumns } from '../../constants';
import { db } from 'src/firebase-config';

function SettingsModal({ data, isOpen, toggleOpen }) {
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(100);

  const generateColumns = (data) => {
    return data.map((item) => {
      return {
        name: `${item.columnName} (${item.unit})`,
        hide: item.hide,
        ...item,
      };
    });
  };

  const columns = generateColumns(tempColumns.sort((a, b) => a.order - b.order));

  const [tableColumns, setTableColumns] = useState(columns);

  //save reference for dragItem and dragOverItem
  const dragItem = useRef<any>(null);
  const dragOverItem = useRef<any>(null);

  //const handle drag sorting
  const handleSort = () => {
    //duplicate items
    let _tableColums = [...tableColumns];

    //remove and save the dragged item content
    const draggedItemContent = _tableColums.splice(dragItem.current, 1)[0];

    //switch the position
    _tableColums.splice(dragOverItem.current, 0, draggedItemContent);

    //reset the position ref
    dragItem.current = null;
    dragOverItem.current = null;

    //update the actual array
    setTableColumns(_tableColums);
  };
  const handleChange = (e, attribute) => {
    const value = e.target.value;

    setTableColumns((prev) =>
      prev.map((column) => (column.accessor === e.target.name ? { ...column, [attribute]: value } : column))
    );
  };

  const saveColumnsInFirebase = (columns) => {
    try {
      const orderedColumns = columns.map((column, index) => ({ ...column, order: index }));

      const boilerRef = doc(db, 'boilers', '0002A'); //boiler id

      updateDoc(boilerRef, { columns: orderedColumns });
    } catch (error) {
      console.error(error);
    }
  };

  /*  
  const saveColumnsInFirebase = (columns) => {
    const orderedColumns = columns.map((column, index) => ({ ...column, order: index }));

      const boilerRef = doc(db, 'boilers', "hascvas"); //boiler id
    setDoc(boilerRef, {...data, columns: orderedColumns})
      .then(() => {
   
      })
      .catch((error) => {
      
      }); 
  };
*/
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
              onChange={(e) => handleChange(e, 'columnName')}
              className="w-[165px] "
            />
            <TextField
              type="text"
              label="jedn."
              value={item.unit}
              name={item.accessor}
              onChange={(e) => handleChange(e, 'unit')}
              className="w-[60px] px-6"
            />
            <TextField
              type="number"
              label="Min"
              value={item.limit.min}
              name={item.accessor}
              onChange={(e) => handleChange(e, 'min')}
              className="w-[70px] pr-6"
            />
            <TextField
              type="number"
              label="Max"
              value={item.limit.max}
              name={item.accessor}
              onChange={(e) => handleChange(e, 'max')}
              className="w-[70px]"
            />

            <ListItemSecondaryAction>
              <Switch
                checked={!item.hide}
                onChange={() => {
                  const newItems = [...tableColumns];
                  newItems[index].hide = !newItems[index].hide;
                  setTableColumns(newItems);
                }}
              />
            </ListItemSecondaryAction>
          </ListItem>
        ))}

        <ListItem className="flex justify-around">
          <Button
            className="whitespace-nowrap"
            variant="contained"
            color="secondary"
            onClick={() => saveColumnsInFirebase(tableColumns)}
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
