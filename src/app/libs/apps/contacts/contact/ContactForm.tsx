import FuseLoading from '@app/core/Loading';
import NavLinkAdapter from '@app/core/NavLinkAdapter';
import FuseSvgIcon from '@app/core/SvgIcon';
import { TContact } from '@app/types/TContact';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import _ from '@lodash';
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
import { AppDispatch, RootState } from 'app/store/index';
import { useEffect } from 'react';
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

const ContactForm = () => {
  const { id } = useParams();
  const contact: TContact | undefined = useSelector((state: RootState) => selectContactById(state, id || ''));

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

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
      dispatch(addContact(data)).then(() => {
        navigate(`/pouzivatelia`);
      });
    } else {
      dispatch(updateContact(data));
    }
  }

  function handleRemoveContact() {
    dispatch(removeContact(id || '')).then(() => {
      navigate('/pouzivatelia');
    });
  }

  if (_.isEmpty(form) || !contact) {
    return <FuseLoading />;
  }

  return (
    <>
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
                        <input accept="image/*" className="hidden" id="button-avatar" type="file" onChange={() => {}} />
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
              <FormControlLabel value="user" control={<Radio />} label="Zákazník" />
              <FormControlLabel value="guest" control={<Radio />} label="Hosť" />
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

        <Controller
          control={control}
          name="address"
          render={({ field }) => (
            <TextField
              className="mt-32"
              {...field}
              label="Adresa"
              placeholder="Adresa"
              id="address"
              required
              error={!!errors.address}
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FuseSvgIcon size={20}>heroicons-solid:location-marker</FuseSvgIcon>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        <Controller
          control={control}
          name="notes"
          render={({ field }) => (
            <TextField
              className="mt-32"
              {...field}
              label="Notes"
              placeholder="Notes"
              id="notes"
              error={!!errors.notes}
              variant="outlined"
              fullWidth
              multiline
              minRows={5}
              maxRows={10}
              InputProps={{
                className: 'max-h-min h-min items-start',
                startAdornment: (
                  <InputAdornment className="mt-16" position="start">
                    <FuseSvgIcon size={20}>heroicons-solid:menu-alt-2</FuseSvgIcon>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      </div>

      <Box
        className="flex items-center mt-40 py-14 pr-16 pl-4 sm:pr-48 sm:pl-36 border-t"
        sx={{ backgroundColor: 'background.default' }}
      >
        {id !== 'new' && (
          <Button color="error" onClick={handleRemoveContact}>
            Vymazať
          </Button>
        )}
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

export default ContactForm;