import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
interface Props {
  isOpen: boolean;
  toggleOpen: () => void;
}

const AddNewBoilerModal = ({ isOpen, toggleOpen }: Props) => {
  const [newBoiler, setNewBoiler] = useState({ id: '', name: '', period: '', phoneNumber: '' });

  const handleChange = (e) => {
    const value = e.target.value;

    setNewBoiler((prev) => ({
      ...prev,
      [e.target.name]: value,
    }));
  };

  return (
    <Drawer anchor="right" open={isOpen} onClose={toggleOpen}>
      <List className="w-[300px]">
        <ListItem>
          <ListItemText primary="Pridať nový systém" />
        </ListItem>

        <ListItem>
          <TextField type="text" label="id" value={newBoiler.id} name="id" onChange={handleChange} />
        </ListItem>
        <ListItem>
          <TextField type="text" label="meno" value={newBoiler.name} name="name" onChange={handleChange} />
        </ListItem>
        <ListItem>
          <TextField type="text" label="perióda" value={newBoiler.period} name="period" onChange={handleChange} />
        </ListItem>
        <ListItem>
          <TextField
            type="number"
            label="perióda"
            value={newBoiler.phoneNumber}
            name="phoneNumber"
            onChange={handleChange}
          />
        </ListItem>
        <ListItem className="flex justify-around">
          <Button className="whitespace-nowrap" variant="contained" color="secondary" onClick={() => {}}>
            Uložiť
          </Button>
          <Button className="whitespace-nowrap" variant="contained" color="primary" onClick={toggleOpen}>
            Zrušiť
          </Button>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default AddNewBoilerModal;
