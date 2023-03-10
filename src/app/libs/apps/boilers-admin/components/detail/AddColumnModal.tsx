import { Drawer, List, ListItem, ListItemText, TextField, Button } from '@mui/material';
import { useState } from 'react';
import FuseSvgIcon from '@app/core/SvgIcon';
function AddColumnModal({ isOpen, close, columns, deviceID }) {
  const [formFields, setFormFields] = useState([{ name: '' }]);

  const handleFormChange = (event, index) => {
    let data = [...formFields];
    data[index][event.target.name] = event.target.value;
    setFormFields(data);
  };

  const submit = (e) => {
    e.preventDefault();
    const newColumns = formFields.map((column) => ({ field: column.name, headerName: column.name }));
    if (existDuplicateColumn()) {
      console.log('Duplicate column');
      return;
    }
    console.log(newColumns);
  };

  const addFields = () => {
    let object = {
      name: '',
    };

    setFormFields([...formFields, object]);
  };

  const removeFields = (index) => {
    let data = [...formFields];
    data.splice(index, 1);
    setFormFields(data);
  };
  const existDuplicateColumn = () => {
    const names = new Set();
    for (let column of columns) {
      //@ts-ignore
      if (names.has(column.name)) {
        return true;
      } //@ts-ignore
      names.add(column.name);
    }
    return false;
  };
  return (
    <Drawer anchor="right" open={isOpen} onClose={close}>
      <List className="w-[300px]">
        <ListItem>
          <ListItemText primary="Pridávanie stĺpcov" />
        </ListItem>
        <form onSubmit={submit}>
          {formFields.map((form, index) => (
            <ListItem key={index}>
              <TextField
                name="name"
                label="Názov"
                placeholder="Názov"
                onChange={(event) => handleFormChange(event, index)}
                value={form.name}
                required
              />

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
        <Button variant="contained" className="mx-12" onClick={close} color="primary">
          Zrušiť
        </Button>
        <Button variant="contained" onClick={submit} color="secondary">
          Pridať
        </Button>
      </List>
    </Drawer>
  );
}

export default AddColumnModal;
