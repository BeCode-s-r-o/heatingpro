import { Button, List, ListItem, TextField } from '@mui/material';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import FuseSvgIcon from '../../../../../@app/core/SvgIcon/FuseSvgIcon';
import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { showMessage } from 'app/store/slices/messageSlice';

const defaultValues = {
  name: '',
  email: '',
  phone: '',
  message: '',
};

const ContactView = () => {
  const dispatch = useDispatch();
  const [values, setValues] = useState(defaultValues);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleSendEmail = () => {
    setLoading(true);
    axios.post('https://api.monitoringpro.sk/contact-form', values).then((e) => {
      console.log(e);
      dispatch(showMessage({ message: 'Správa bola úspešne odoslaná' }));
      setValues(defaultValues);
      setLoading(false);
    });
  };

  return (
    <>
      <div className="relative flex flex-col flex-auto items-center p-24 pt-0 sm:p-48 sm:pt-0 pb-0">
        <div className="w-full max-w-3xl">
          <Typography className="mt-12 text-4xl font-bold truncate">Kontaktné údaje</Typography>

          <Divider className="mt-16 mb-24" />

          <div className="flex flex-col space-y-32">
            <div className="flex">
              <FuseSvgIcon>heroicons-outline:office-building</FuseSvgIcon>
              <div className="min-w-0  space-y-4">
                <div className="ml-10" style={{ fontWeight: 'bold' }}>
                  HEATING PRO, s. r. o.
                </div>
                <div className="ml-10">Stará Vajnorská 3060/39a 831 04</div>
                <div className="ml-10">Bratislava - mestská časť Nové Mesto</div>
                <div className="ml-10">IČO: 47235322</div>
                <div className="ml-10">DIČ: 2023327009</div>
                <div className="ml-10">IČ DPH: SK2023327009</div>
              </div>
            </div>

            <div className="flex">
              <FuseSvgIcon>heroicons-outline:mail</FuseSvgIcon>
              <div className="min-w-0 ml-10 space-y-4">
                <div className="flex items-center leading-6">
                  <a
                    className="hover:underline text-primary-500"
                    href={`mailto:   info@monitoringpro.sk`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ background: 'none' }}
                  >
                    info@monitoringpro.sk
                  </a>
                </div>
              </div>
            </div>

            <div className="flex">
              <FuseSvgIcon>heroicons-outline:phone</FuseSvgIcon>
              <div className="min-w-0 space-y-4">
                <div className="flex items-center leading-6">
                  <div className="ml-10">+421 903 162 711</div>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <FuseSvgIcon>heroicons-outline:clock</FuseSvgIcon>
              <div className="ml-10 leading-6">8:00-16:00</div>
            </div>
          </div>
          <Typography className="mt-32 text-4xl font-bold truncate">Kontaktný formulár</Typography>
          <Divider className="mt-16 mb-24" />
          <List>
            <ListItem>
              <TextField
                className={`w-full`}
                label={'Meno'}
                value={values.name}
                name={'name'}
                onChange={handleChange}
              />
            </ListItem>
            <ListItem>
              <TextField
                className={`w-full`}
                label={'Telefón'}
                value={values.phone}
                name={'phone'}
                onChange={handleChange}
              />
            </ListItem>
            <ListItem>
              <TextField
                className={`w-full`}
                label={'Email'}
                value={values.email}
                name={'email'}
                onChange={handleChange}
              />
            </ListItem>
            <ListItem>
              <TextField
                className={`w-full`}
                label={'Správa'}
                value={values.message}
                name={'message'}
                onChange={handleChange}
              />
            </ListItem>
          </List>
          <ListItem className="flex justify-end gap-12 sticky bottom-0 z-50">
            <Button
              className="whitespace-nowrap"
              disabled={loading}
              variant="contained"
              color="primary"
              onClick={handleSendEmail}
            >
              Odoslať
            </Button>
          </ListItem>
        </div>
      </div>
    </>
  );
};

export default ContactView;
