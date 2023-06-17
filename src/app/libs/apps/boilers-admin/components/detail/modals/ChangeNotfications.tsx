import FuseSvgIcon from '@app/core/SvgIcon';
import { TContactForNotification } from '@app/types/TBoilers';
import {
  Button,
  Checkbox,
  Drawer,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import { AppDispatch } from 'app/store/index';
import { showMessage } from 'app/store/slices/messageSlice';
import { doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { db } from 'src/firebase-config';
import { getBoiler } from '../../../store/boilersSlice';

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
  const isRequiredFieldsFilled = formFields.every((contact) => contact.phone !== '' && contact.email !== '');

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
      email: '',
      sendSmsAlarm: true,
      sendSmsMissingRecord: true,
      sendEmailMonthlyReport: true,
      sendEmailAlarm: true,
      sendEmailMissingRecord: true,
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
      <div className="max-w-[98vw] overflow-x-scroll">
        <List className="w-[350px]">
          <ListItem>
            <ListItemText primary="Priraďovanie notifikácií" />
          </ListItem>
          <form onSubmit={submit}>
            {formFields.map((contact, index) => (
              <ListItem key={index} className="flex flex-wrap gap-12 border-b-[12px] pt-20 ">
                <TextField
                  className="mx-auto w-full"
                  name="name"
                  label="Meno"
                  onChange={(e) => handleChange(e, index, e.target.value)}
                  value={contact.name}
                  required
                />{' '}
                <TextField
                  className="mx-auto  w-full"
                  name="phone"
                  label="Tel.číslo"
                  onChange={(e) => handleChange(e, index, e.target.value)}
                  value={contact.phone}
                  required
                />
                <TextField
                  className="mx-auto w-full"
                  name="email"
                  label="Email"
                  onChange={(e) => handleChange(e, index, e.target.value)}
                  value={contact.email}
                  required
                />
                <Typography className="mx-auto">SMS</Typography>
                <div className="flex  border-b-2 pb-10">
                  <FormControlLabel control={<Checkbox disabled />} label="Mesačný report" />
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="sendSmsAlarm"
                        checked={contact.sendSmsAlarm}
                        onChange={(e) => handleChange(e, index, e.target.checked)}
                      />
                    }
                    label="Alarmy"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="sendSmsMissingRecord"
                        checked={contact.sendSmsMissingRecord}
                        onChange={(e) => handleChange(e, index, e.target.checked)}
                      />
                    }
                    label="Chýbajúci zápis"
                  />
                </div>
                <Typography className="mx-auto">Email</Typography>
                <div className="flex border-b-2 pb-10">
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="sendEmailMonthlyReport"
                        checked={contact.sendEmailMonthlyReport}
                        onChange={(e) => handleChange(e, index, e.target.checked)}
                      />
                    }
                    label="Mesačný report"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="sendEmailAlarm"
                        checked={contact.sendEmailAlarm}
                        onChange={(e) => handleChange(e, index, e.target.checked)}
                      />
                    }
                    label="Alarmy"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="sendEmailMissingRecord"
                        checked={contact.sendEmailMissingRecord}
                        onChange={(e) => handleChange(e, index, e.target.checked)}
                      />
                    }
                    label="Chýbajúci zápis"
                  />
                </div>
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
          <ListItem className="flex justify-end gap-12 sticky bottom-0 z-50 bg-white">
            <Button variant="contained" onClick={submit} color="primary" disabled={!isRequiredFieldsFilled}>
              Uložiť
            </Button>
            <Button variant="contained" onClick={handleClose} color="secondary">
              Zrušiť
            </Button>
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
}

export default ChangeNotifications;
