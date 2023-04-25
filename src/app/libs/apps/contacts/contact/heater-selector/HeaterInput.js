import FuseSvgIcon from '@app/core/SvgIcon';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import Autocomplete from '@mui/material/Autocomplete/Autocomplete';

import { useDispatch, useSelector } from 'react-redux';
import { boilersSlice, getBoilers, selectAllBoilers } from '../../../boilers-admin/store/boilersSlice';
import withReducer from 'app/store/withReducer';

const schema = yup.object().shape({
  heater: yup.string().required('Pridajte id kotla'),
  label: yup.string().required('Pridajte názov kotla'),
  phone: yup.string().required('Pridajte tel.číslo kotla'),
});

function HeaterInput(props) {
  const { value, hideRemove } = props;
  const [actualHeaterInfo, setActualHeaterInfo] = useState({ id: '', name: '', phoneNumber: '' });
  const arrayOfAllBoilers = useSelector(selectAllBoilers);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getBoilers());
  }, [dispatch]);

  const defaultValues = '';
  const { control, formState, handleSubmit, reset, watch } = useForm({
    mode: 'onChange',
    defaultValues: defaultValues,
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
  const heaters = [
    {
      id: 'c31e9e5d-e0cb-4574-a13f-8a6ee5ff8309',

      label: 'Piecka',
      phone: '0907 961 609',
    },
    {
      id: 'a8991c76-2fda-4bbd-a718-df13d6478847',

      label: 'Piecka',
      phone: '0907 961 609',
    },
    {
      id: '56ddbd47-4078-4ddd-8448-73c5e88d5f59',

      label: 'Piecka',
      phone: '0907 961 609',
    },
    {
      id: '2026ce08-d08f-4b4f-9506-b10cdb5b104f',

      label: 'Piecka',
      phone: '0907 961 609',
    },
    {
      id: '65930b5a-5d2a-4303-b11f-865d69e6fdb5',

      label: 'Piecka',
      phone: '0907 961 609',
    },
    {
      id: '3eaab175-ec0d-4db7-bc3b-efc633c769be',

      label: 'Piecka',
      phone: '0907 961 609',
    },
    {
      id: 'cbde2486-5033-4e09-838e-e901b108cd41',

      label: 'Piecka',
      phone: '0907 961 609',
    },
  ];

  return (
    <>
      <h1 className="text-center pb-12">Kotolňa</h1>
      <form className="flex space-x-16 mb-16">
        <Autocomplete
          disablePortal
          id="id"
          options={arrayOfAllBoilers}
          getOptionLabel={(option) => option.id}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderOption={(_props, option) => <li {..._props}>{option.id}</li>}
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
          value={actualHeaterInfo.name}
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

        {!hideRemove && (
          <IconButton onClick={props.onRemove}>
            <FuseSvgIcon size={20}>heroicons-solid:trash</FuseSvgIcon>
          </IconButton>
        )}
      </form>
    </>
  );
}

export default HeaterInput;
