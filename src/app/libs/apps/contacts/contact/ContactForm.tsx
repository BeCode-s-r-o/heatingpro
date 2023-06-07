import FuseLoading from '@app/core/Loading';
import NavLinkAdapter from '@app/core/NavLinkAdapter';
import FuseSvgIcon from '@app/core/SvgIcon';
import { TContact } from '@app/types/TContact';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import _ from '@lodash';
import { showMessage } from 'app/store/slices/messageSlice';
import PermDeviceInformationIcon from '@mui/icons-material/PermDeviceInformation';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
import Box from '@mui/system/Box';
import ContactHeaterSelector from './heater-selector/ContactHeaterSelector';
import { AppDispatch, RootState } from 'app/store/index';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';

import {
  addContact,
  getContact,
  getContacts,
  removeContact,
  selectContactById,
  updateContact,
} from '../../../../layout/shared/chatPanel/store/contactsSlice';
import ConfirmModal from '../../boilers-admin/components/detail/modals/ConfirmModal';
import { selectUser } from 'app/store/userSlice';
import { Typography } from '@mui/material';

const schema = yup.object().shape({
  name: yup.string().required('You must enter a name'),
});

const ContactForm = () => {
  const { id } = useParams();
  const contact: TContact | undefined = useSelector((state: RootState) => selectContactById(state, id || ''));
  const { data: user } = useSelector(selectUser);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const { control, watch, reset, handleSubmit, formState, getValues } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  const form = watch();

  useEffect(() => {
    if (id === 'new') {
      //dispatch(newContact());
    } else {
      dispatch(getContact(id || ''));
    }
  }, [dispatch, id]);

  useEffect(() => {
    reset({ ...contact });
  }, [contact, reset]);

  function onSubmit(data) {
    if (id === 'new') {
      dispatch(addContact(data))
        .then(() => {
          navigate(`/pouzivatelia`);
          dispatch(showMessage({ message: 'Všetky zmeny sú úspešne uložené' }));
        })
        .catch(() => {
          dispatch(showMessage({ message: 'Ups, vyskytla sa chyba' }));
        });
    } else {
      dispatch(updateContact(data))
        .then(() => {
          navigate(`/pouzivatelia`);
          dispatch(getContacts());
          dispatch(showMessage({ message: 'Všetky zmeny sú úspešne uložené' }));
        })
        .catch(() => {
          dispatch(showMessage({ message: 'Ups, vyskytla sa chyba' }));
        });
    }
  }

  function handleRemoveContact() {
    dispatch(removeContact(id || ''))
      .then(() => {
        dispatch(showMessage({ message: 'Užívateľ bol úspešne odstránený' }));
        dispatch(getContacts());
        navigate('/pouzivatelia');
      })
      .catch((error) => {
        dispatch(showMessage({ message: `Ups, vyskytla sa chyba: ${error}` }));
      });
  }

  if (_.isEmpty(form) || !contact) {
    return <FuseLoading />;
  }

  return (
    <>
      {' '}
      <Box
        className="relative w-full h-160 sm:h-90 px-32 sm:px-48 flex justify-center items-center"
        sx={{
          backgroundColor: '#111827',
        }}
      >
        {' '}
        <div className="logo">
          <img width="200" src="assets/images/logo/logo.png" alt="logo" />
        </div>
      </Box>
      <div className="relative flex flex-col flex-auto items-center px-24 sm:px-48">
        <div className="w-full">
          <div className="flex flex-auto items-end -mt-64">
            <Controller
              control={control}
              name="avatar"
              render={({ field: { onChange, value } }) => (
                <Box
                  sx={{
                    borderWidth: 4,
                    borderStyle: 'solid',
                    borderColor: 'background.paper',
                  }}
                  className="relative flex items-center justify-center w-128 h-128 rounded-full overflow-hidden"
                >
                  <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div>
                      <label htmlFor="button-avatar" className="flex p-8 cursor-pointer">
                        <input
                          accept="image/*"
                          className="hidden"
                          id="button-avatar"
                          type="file"
                          onChange={async (e) => {
                            function readFileAsync() {
                              return new Promise((resolve, reject) => {
                                const file = e?.target?.files?.[0];
                                if (!file) {
                                  return;
                                }
                                const reader = new FileReader();

                                reader.onload = () => {
                                  //@ts-ignore
                                  resolve(`data:${file.type};base64,${btoa(reader.result)}`);
                                };

                                reader.onerror = reject;

                                reader.readAsBinaryString(file);
                              });
                            }

                            const newImage = await readFileAsync();

                            onChange(newImage);
                          }}
                        />
                        <FuseSvgIcon className="text-white">heroicons-outline:camera</FuseSvgIcon>
                      </label>
                    </div>
                    <div>
                      <IconButton
                        onClick={() => {
                          onChange('');
                        }}
                      >
                        <FuseSvgIcon className="text-white">heroicons-solid:trash</FuseSvgIcon>
                      </IconButton>
                    </div>
                  </div>
                  <Avatar
                    sx={{
                      backgroundColor: 'background.default',
                      color: 'text.secondary',
                    }}
                    className="object-cover w-full h-full text-64 font-bold"
                    src={value}
                    alt={contact.name}
                  >
                    {contact.name.charAt(0)}
                  </Avatar>
                </Box>
              )}
            />
          </div>
        </div>
        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <RadioGroup row {...field} name="role">
              <FormControlLabel value="admin" control={<Radio />} label="Admin" />
              <FormControlLabel value="staff" control={<Radio />} label="Kurič" />
              <FormControlLabel value="user" control={<Radio />} label="Klient" />
              <FormControlLabel value="instalater" control={<Radio />} label="Inštalatér" />
              <FormControlLabel value="obsluha" control={<Radio />} label="Obsluha kotolne" />
            </RadioGroup>
          )}
        />
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <TextField
              className="mt-32"
              {...field}
              label="Meno"
              placeholder="Meno"
              id="name"
              error={!!errors.name}
              variant="outlined"
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FuseSvgIcon size={20}>heroicons-solid:user-circle</FuseSvgIcon>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <TextField
              className="mt-32"
              {...field}
              label="Email"
              placeholder="Email"
              id="title"
              error={!!errors.title}
              variant="outlined"
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FuseSvgIcon size={20}>heroicons-solid:mail</FuseSvgIcon>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        <Controller
          control={control}
          name="phone"
          render={({ field }) => (
            <TextField
              className="mt-32"
              {...field}
              label="Tel. čísl"
              placeholder="+421"
              id="phone"
              required
              error={!!errors.company}
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PermDeviceInformationIcon />
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
        {form.role !== 'admin' && (
          <Controller
            control={control}
            name="heaters"
            render={({ field }) => <ContactHeaterSelector className="mt-32" {...field} />}
          />
        )}
      </div>
      <Box
        className="flex items-center mt-40 py-14 pr-16 pl-4 sm:pr-48 sm:pl-36 border-t"
        sx={{ backgroundColor: 'background.default' }}
      >
        {id !== 'new' && (
          <Button variant="contained" color="secondary" onClick={() => setShowConfirmDeleteModal(true)}>
            Vymazať
          </Button>
        )}
        <ConfirmModal
          open={showConfirmDeleteModal}
          onClose={() => setShowConfirmDeleteModal(false)}
          onConfirm={handleRemoveContact}
          title={'Vymazanie kontaktu'}
          message={`Pozor, táto akcia je nezvratná, naozaj si želáte vymazať účet používateľa ${form.name} ?`}
          confirmText={'Vymazať'}
          cancelText={'Zrušiť'}
        />

        <Button
          className="ml-auto"
          variant="contained"
          color="primary"
          disabled={_.isEmpty(dirtyFields) || !isValid}
          onClick={handleSubmit(onSubmit)}
        >
          Uložiť
        </Button>
        <Button className="ml-8" component={NavLinkAdapter} to={-1}>
          Zrušiť
        </Button>
      </Box>
    </>
  );
};

export default ContactForm;
