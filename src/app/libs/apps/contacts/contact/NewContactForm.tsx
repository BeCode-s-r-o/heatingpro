import FuseLoading from '@app/core/Loading';
import NavLinkAdapter from '@app/core/NavLinkAdapter';
import FuseSvgIcon from '@app/core/SvgIcon';
import { TContact, TUserRoles } from '@app/types/TContact';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import _ from '@lodash';
import PermDeviceInformationIcon from '@mui/icons-material/PermDeviceInformation';
import ContactHeaterSelector from './heater-selector/ContactHeaterSelector';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
import Box from '@mui/system/Box';
import { AppDispatch, RootState } from 'app/store/index';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';

import {
  addContact,
  getContact,
  removeContact,
  selectContactById,
  updateContact,
} from '../../../../layout/shared/chatPanel/store/contactsSlice';

const schema = yup.object().shape({
  name: yup.string().required('You must enter a name'),
});

const NewContactForm = () => {
  const [contact, setContact] = useState({
    id: '',
    name: '',
    avatar: '',
    phone: '',
    email: '',
    role: TUserRoles.user,
    heaters: [],
  });
  const dispatch = useDispatch<AppDispatch>();
  const [showPassword, setShowPassword] = useState(false);
  const { control, watch, reset, handleSubmit, formState } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  const form = watch();

  useEffect(() => {
    reset({ ...contact });
  }, [contact, reset]);

  function onSubmit(data) {
    dispatch(addContact(data));
  }

  if (_.isEmpty(form) || !contact) {
    return <FuseLoading />;
  }

  return (
    <>
      <div className="flex flex-col flex-auto items-center px-24 sm:px-48" style={{ paddingTop: '100px' }}>
        <div className="w-full">
          <div className="flex flex-auto items-end -mt-64" style={{ justifyContent: 'center' }}>
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
                  className="relative flex items-center justify-center w-128 h-128  overflow-hidden"
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
                      width: '100%',
                      height: 'auto !important',
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
              <FormControlLabel value="user" control={<Radio />} label="Klient" />
              <FormControlLabel value="staff" control={<Radio />} label="Kurič" />
              <FormControlLabel value="instalater" control={<Radio />} label="Inštalatér" />
              <FormControlLabel value="obsluha" control={<Radio />} label="Obsluha kotolne" />
              <FormControlLabel value="admin" control={<Radio />} label="Admin" />
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
              label="Meno a priezvisko"
              placeholder="Meno a priezvisko"
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
          name="password"
          render={({ field }) => (
            <TextField
              className="mt-32"
              {...field}
              label="Heslo"
              placeholder="Heslo"
              id="password"
              error={!!errors.password}
              variant="outlined"
              type={showPassword ? 'text' : 'password'}
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FuseSvgIcon size={20}>heroicons-solid:lock-closed</FuseSvgIcon>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    {showPassword ? (
                      <FuseSvgIcon className="cursor-pointer" size={20} onClick={() => setShowPassword(false)}>
                        heroicons-outline:eye
                      </FuseSvgIcon>
                    ) : (
                      <FuseSvgIcon className="cursor-pointer" size={20} onClick={() => setShowPassword(true)}>
                        heroicons-outline:eye-off
                      </FuseSvgIcon>
                    )}
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
              label="Tel. číslo"
              placeholder="Tel. číslo"
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
        <Button className="ml-auto" component={NavLinkAdapter} to={-1}>
          Zrušiť
        </Button>
        <Button
          className="ml-8"
          variant="contained"
          color="secondary"
          disabled={_.isEmpty(dirtyFields) || !isValid}
          onClick={handleSubmit(onSubmit)}
        >
          Pridať
        </Button>
      </Box>
    </>
  );
};

export default NewContactForm;
