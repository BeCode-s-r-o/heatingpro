import FuseSvgIcon from '@app/core/SvgIcon';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import PhoneNumberInput from '../phone-number-selector/PhoneNumberInput';
import WhatshotIcon from '@mui/icons-material/Whatshot';
const schema = yup.object().shape({
  heater: yup.string().required('Pridajte id kotla'),
  label: yup.string().required('Pridajte názov kotla'),
  phone: yup.string().required('Pridajte tel.číslo kotla'),
});

const defaultValues = {
  heater: '',
  label: '',
  phone: '',
};

function HeaterInput(props) {
  const { value, hideRemove } = props;

  const { control, formState, handleSubmit, reset } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    reset(value);
  }, [reset, value]);

  const { isValid, dirtyFields, errors } = formState;

  function onSubmit(data) {
    props.onChange(data);
  }

  return (
    <>
      <h1 className="text-center pb-12">Kotol</h1>
      <form className="flex space-x-16 mb-16" onChange={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="heater"
          render={({ field }) => (
            <TextField
              {...field}
              className=""
              label="ID"
              placeholder="ID"
              variant="outlined"
              fullWidth
              error={!!errors.heater}
              helperText={errors?.heater?.message}
              InputProps={{
                startAdornment: <InputAdornment position="start">{/* <WhatshotIcon /> */}</InputAdornment>,
              }}
            />
          )}
        />
        <Controller
          control={control}
          name="label"
          render={({ field }) => (
            <TextField
              {...field}
              className=""
              label="Názov"
              placeholder="Názov"
              variant="outlined"
              fullWidth
              error={!!errors.label}
              helperText={errors?.label?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {/* <FuseSvgIcon size={20}>heroicons-solid:tag</FuseSvgIcon> */}
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
              {...field}
              className=""
              label="Tel.číslo"
              placeholder="Tel.číslo"
              variant="outlined"
              fullWidth
              error={!!errors.phone}
              helperText={errors?.phone?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {/* <FuseSvgIcon size={20}>heroicons-solid:tag</FuseSvgIcon> */}
                  </InputAdornment>
                ),
              }}
            />
          )}
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

PhoneNumberInput.defaultProps = {
  hideRemove: false,
};

export default HeaterInput;
