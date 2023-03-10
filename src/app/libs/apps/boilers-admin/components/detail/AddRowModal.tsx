import { Drawer, List, ListItem, ListItemText, TextField, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import FuseSvgIcon from '@app/core/SvgIcon';
function AddRowModal({ isOpen, close, rows, deviceID, columns }) {
  const [formFields, setFormFields] = useState([{ name: '' }]);
  const [newRow, setNewRow] = useState<any>();
  useEffect(() => {
    setNewRow(columns.map((column) => ({ [column.field]: '', name: column.field })));
  }, [columns]);
  console.log(newRow);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRow((prev) => prev.map((i) => (i.name === e.target.name ? { ...i, [name]: value } : i)));
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

  const existDuplicateColumn = () => {
    const names = new Set();
    for (let column of rows) {
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
          <ListItemText primary="Pridávanie záznamu" />
        </ListItem>
        {newRow && (
          <form onSubmit={submit}>
            {newRow.map((column, index) => {
              console.log(column.name);

              return (
                <ListItem key={index}>
                  <TextField
                    name={column.name}
                    label={column.name}
                    onChange={handleChange}
                    value={column[column.name]}
                    required
                  />
                </ListItem>
              );
            })}
          </form>
        )}

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

export default AddRowModal;
