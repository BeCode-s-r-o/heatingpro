import FuseSvgIcon from '@app/core/SvgIcon';
import { Button, Drawer, InputAdornment, List, ListItem, ListItemText, Switch, TextField } from '@mui/material';
import { AppDispatch } from 'app/store/index';
import { showMessage } from 'app/store/slices/messageSlice';
import { doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { db } from 'src/firebase-config';
import { getBoiler } from '../../../store/boilersSlice';
import { TContactForNotification } from '@app/types/TBoilers';

interface Props {
  isOpen: boolean;
  close: () => void;
  notificationsContacts: TContactForNotification[];
  deviceID: string;
}

function ChangeNotifications({ isOpen, close, deviceID, notificationsContacts }: Props) {
  const [formFields, setFormFields] = useState(notificationsContacts);
  const dispatch = useDispatch<AppDispatch>();

  const handleChange = (e, index, value) => {
    const { name } = e.target;
    setFormFields((prevFormFields) => {
      const actualFormFields = [...prevFormFields];
      actualFormFields[index] = { ...actualFormFields[index], [name]: value };
      return actualFormFields;
    });
  };

  const handleClose = () => {
    setFormFields(notificationsContacts);
    close();
  };
  const submit = (e) => {
    e.preventDefault();

    try {
      const boilerRef = doc(db, 'boilers', deviceID);
      updateDoc(boilerRef, { contactsForNotification: formFields });
      close();
    } catch (error) {
      dispatch(showMessage({ message: 'Ups, vyskytla sa chyba ' + error }));
    }
    dispatch(getBoiler(deviceID || ''));
    dispatch(showMessage({ message: 'Zmeny boli úspešne uložené' }));
  };

  const addField = () => {
    let contact = {
      name: '',
      phone: '',
      sendPhone: true,
      email: '',
      sendEmail: true,
    };

    setFormFields((prev) => [...prev, contact]);
  };

  const removeField = (index) => {
    let data = [...formFields];
    data.splice(index, 1);
    setFormFields(data);
  };

  return (
    <Drawer anchor="right" open={isOpen} onClose={handleClose}>
      <List className="w-[350px]">
        <ListItem>
          <ListItemText primary="Priraďovanie notifikácií" />
        </ListItem>
        <form onSubmit={submit}>
          {formFields.map((contact, index) => (
            <ListItem key={index} className="flex flex-wrap gap-12 border-b">
              <TextField
                className="mx-auto w-full"
                name="name"
                label="Meno"
                onChange={(e) => handleChange(e, index, e.target.value)}
                value={contact.name}
                required
              />

              <TextField
                className="mx-auto  w-full"
                name="phone"
                label="Tel.číslo"
                onChange={(e) => handleChange(e, index, e.target.value)}
                value={contact.phone}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Switch
                        name="sendPhone"
                        onChange={(e) => handleChange(e, index, e.target.checked)}
                        checked={contact.sendPhone}
                      />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                className="mx-auto w-full"
                name="email"
                label="Email"
                onChange={(e) => handleChange(e, index, e.target.value)}
                value={contact.email}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Switch
                        name="sendEmail"
                        onChange={(e) => handleChange(e, index, e.target.checked)}
                        checked={contact.sendEmail}
                      />
                    </InputAdornment>
                  ),
                }}
              />
              <Button onClick={() => removeField(index)} className="mx-auto">
                <FuseSvgIcon size={20}>heroicons-solid:trash</FuseSvgIcon>
              </Button>
            </ListItem>
          ))}
        </form>
        <ListItem>
          <Button onClick={addField} className="mx-auto">
            <FuseSvgIcon size={20}>heroicons-solid:plus-circle</FuseSvgIcon>
          </Button>
        </ListItem>
        <br />
        <ListItem className="flex justify-end gap-12">
          <Button variant="contained" onClick={submit} color="primary">
            Uložiť
          </Button>
          <Button variant="contained" onClick={handleClose} color="secondary">
            Zrušiť
          </Button>
        </ListItem>
      </List>
    </Drawer>
  );
}

export default ChangeNotifications;
