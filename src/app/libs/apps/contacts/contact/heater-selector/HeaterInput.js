import FuseSvgIcon from '@app/core/SvgIcon';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import Autocomplete from '@mui/material/Autocomplete/Autocomplete';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { selectUser } from 'app/store/userSlice';
import { Tooltip } from '@mui/material';
import { getBoilers, selectAllBoilers } from '../../../boilers-admin/store/boilersSlice';

const schema = yup.object().shape({
  heater: yup.string().required('Pridajte id kotla'),
  label: yup.string().required('Pridajte názov kotla'),
  phone: yup.string().required('Pridajte tel.číslo kotla'),
});

function HeaterInput(props) {
  const { value, hideRemove, onRemove } = props;
  const arrayOfAllBoilers = useSelector(selectAllBoilers);
  const [actualHeaterInfo, setActualHeaterInfo] = useState({
    id: '',
    header: { name: '' },
    phoneNumber: '',
    disabled: false,
  });
  const { data: user } = useSelector(selectUser);
  const dispatch = useDispatch();
  const isAdmin = user?.role === 'admin';
  const rolesEnabledSeePhoneNumber = ['admin', 'instalater'];
  useEffect(() => {
    if (arrayOfAllBoilers.length > 0) {
      setActualHeaterInfo(
        value === undefined
          ? { id: '', header: { name: '' }, phoneNumber: '', disabled: false }
          : arrayOfAllBoilers.find((boiler) => boiler.id === value)
      );
    }
  }, [arrayOfAllBoilers, value]);

  useEffect(() => {
    dispatch(getBoilers());
  }, [dispatch]);

  const defaultValues = '';
  const { control, formState, handleSubmit, reset, watch } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });
  const form = watch();
  useEffect(() => {
    reset(value);
  }, [reset, value]);

  const { isValid, dirtyFields, errors } = formState;

  function onSubmit(data) {
    props.onChange(data.id);
    setActualHeaterInfo(data);
  }
  const boilersForOptions = isAdmin
    ? arrayOfAllBoilers
    : arrayOfAllBoilers?.filter((boiler) => {
        if (!boiler.disabled) {
          if (user?.heaters.includes(boiler.id)) {
            return true;
          }
          if (user?.role !== 'user' && !boiler.header.withService) {
            return true;
          }
        }
        return false;
      });
  console.log(user);
  return (
    <>
      <Tooltip title={actualHeaterInfo.disabled ? 'Kotolňa je vymazaná' : 'Kotolňa je dostupná'} placement="top">
        <div className="flex gap-8 justify-center align-items-center">
          <div className={`rounded-full mt-10 w-10 h-10 ${actualHeaterInfo.disabled ? 'bg-red' : 'bg-green'} `} />
          <h1 className="text-center pb-12">Kotolňa</h1>
        </div>
      </Tooltip>
      <form className="flex flex-wrap gap-y-16 sm:gap-y-16 sm:flex-nowrap sm:space-x-16  mb-16">
        <Autocomplete
          className="w-full"
          disablePortal
          options={boilersForOptions}
          getOptionLabel={(option) => option.id}
          isOptionEqualToValue={(option, choice) => option.id === choice.id}
          value={actualHeaterInfo}
          renderOption={(_props, option) => (
            <Tooltip title={option.disabled ? 'Kotolňa je vymazaná' : 'Kotolňa je dostupná'} placement="top">
              <li
                {..._props}
                className={`p-6  cursor-pointer ${
                  option.disabled ? 'bg-red-300 hover:bg-red' : 'bg-green-300 hover:bg-green'
                }`}
              >
                {option.id}
              </li>
            </Tooltip>
          )}
          onChange={(event, newValue) => {
            onSubmit(newValue);
          }}
          fullWidth
          renderInput={(params) => (
            <TextField {...params} variant="outlined" fullWidth label="ID Zariadenia" placeholder="ID Zariadenia" />
          )}
        />

        <TextField
          disabled
          readOnly
          value={actualHeaterInfo.header.name}
          className=""
          label="Názov"
          placeholder="Názov"
          variant="outlined"
          fullWidth
          helperText={errors?.label?.message}
          InputProps={{
            readOnly: true,
          }}
        />

        {rolesEnabledSeePhoneNumber.includes(user?.role) && (
          <TextField
            disabled
            readOnly
            className=""
            label="Tel.číslo"
            value={actualHeaterInfo.phoneNumber}
            placeholder="Tel.číslo"
            variant="outlined"
            fullWidth
            helperText={errors?.phone?.message}
            InputProps={{
              readOnly: true,
            }}
          />
        )}
        {!hideRemove && (
          <IconButton onClick={props.onRemove} className="mx-auto sm:mx-0">
            <FuseSvgIcon size={20}>heroicons-solid:trash</FuseSvgIcon>
          </IconButton>
        )}
      </form>
    </>
  );
}

export default HeaterInput;
