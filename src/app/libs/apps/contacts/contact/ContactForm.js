import FuseLoading from '@app/core/Loading';
import NavLinkAdapter from '@app/core/NavLinkAdapter';
import FuseSvgIcon from '@app/core/SvgIcon';
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
import { selectContactById } from '../store/contactsSlice';
import { addContact, getContact, newContact, removeContact, updateContact } from '../store/singleContactSlice';



const schema = yup.object().shape({
  name: yup.string().required('You must enter a name'),
});

const ContactForm = () => {
  const { id } = useParams();
  const contact: any = useSelector<RootState>((state) => selectContactById(state, id || ''));
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { control, watch, reset, handleSubmit, formState, getValues } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  const form = watch();

  useEffect(() => {
    if (routeParams.id === 'new') {
      dispatch(newContact());
    } else {
      dispatch(getContact(routeParams.id));
    }
  }, [dispatch, routeParams]);

  useEffect(() => {
    reset({ ...contact });
  }, [contact, reset]);

  function getCountryByIso(iso) {
    return countries.find((country) => country.iso === iso);
  }

  function onSubmit(data) {
    if (routeParams.id === 'new') {
      dispatch(addContact(data)).then(() => {
        navigate(`/pouzivatelia`);
      });
    } else {
      dispatch(updateContact(data));
    }
  }

  function handleRemoveContact() {
    dispatch(removeContact(contact.id)).then(() => {
      navigate('/pouzivatelia');
    });
  }

  if (_.isEmpty(form) || !contact) {
    return <FuseLoading />;
  }

  return (
    <>
      <Box
        className="relative w-full h-160 sm:h-192 px-32 sm:px-48"
        sx={{
          backgroundColor: 'background.default',
        }}
      >
        {contact.background && (
          <img className="absolute inset-0 object-cover w-full h-full" src={contact.background} alt="user background" />
        )}
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
                                const file = e.target.files[0];
                                if (!file) {
                                  return;
                                }
                                const reader = new FileReader();

                                reader.onload = () => {
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
              <FormControlLabel value="user" control={<Radio />} label="Klient" />
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
              helperText={errors?.name?.message}
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
              helperText={errors?.title?.message}
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
              helperText={errors?.company?.message}
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
      </div>

      <Box
        className="flex items-center mt-40 py-14 pr-16 pl-4 sm:pr-48 sm:pl-36 border-t"
        sx={{ backgroundColor: 'background.default' }}
      >
        {routeParams.id !== 'new' && (
          <Button color="error" onClick={handleRemoveContact}>
            Delete
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
