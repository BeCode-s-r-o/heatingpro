import { yupResolver } from '@hookform/resolvers/yup';
import _ from '@lodash';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { authInstance } from 'src/app/auth/jwtService';
import * as yup from 'yup';

const schema = yup.object().shape({
  email: yup.string().email('Musíte zadať platný e-mail').required('Musíte zadať e-mail'),
  password: yup.string().required('Prosím zadajte heslo.').min(4, 'Heslo je príliš krátke – musí mať aspoň 4 znaky.'),
});

const defaultValues = {
  email: '',
  password: '',
  remember: true,
};

function SignInPage() {
  const { control, formState, handleSubmit, setError, setValue } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  useEffect(() => {
    setValue('email', 'vladko@becode.sk', { shouldDirty: true, shouldValidate: true });
    setValue('password', 'lubojekral', { shouldDirty: true, shouldValidate: true });
  }, [setValue]);

  function onSubmit({ email, password }) {
    // TODO - add firebase login
    /*     signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
  
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      }); */

    authInstance.signInWithEmailAndPassword(email, password);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-1 min-w-0">
      <Paper className="h-full sm:h-auto md:flex md:items-center md:justify-end w-full sm:w-auto md:h-full md:w-1/2 py-8 px-16 sm:p-48 md:p-64 sm:rounded-2xl md:rounded-none sm:shadow md:shadow-none ltr:border-r-1 rtl:border-l-1">
        <div className="w-full max-w-320 sm:w-320 mx-auto sm:mx-0">
          <img className="w-160" src="assets/images/logo/logo.png" alt="logo" />

          <Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight">Prihlásiť sa</Typography>
          <div className="flex items-baseline mt-2 font-medium">
            <Typography>Nemáte účet?</Typography>
            <Link className="ml-4" to="/sign-up">
              Vytvorte si účet
            </Link>
          </div>

          <form
            name="loginForm"
            noValidate
            className="flex flex-col justify-center w-full mt-32"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Email"
                  autoFocus
                  type="email"
                  error={!!errors.email}
                  helperText={errors?.email?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Password"
                  type="password"
                  error={!!errors.password}
                  helperText={errors?.password?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />

            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between">
              <Controller
                name="remember"
                control={control}
                render={({ field }) => (
                  <FormControl>
                    <FormControlLabel label="Zapamätať si ma" control={<Checkbox size="small" {...field} />} />
                  </FormControl>
                )}
              />

              <Link className="text-md font-medium" to="/forgot-password">
                Zabudnuté heslo?
              </Link>
            </div>

            <Button
              variant="contained"
              color="secondary"
              className=" w-full mt-16"
              aria-label="Sign in"
              disabled={_.isEmpty(dirtyFields) || !isValid}
              type="submit"
              size="large"
            >
              Prihlásiť sa
            </Button>
          </form>
        </div>
      </Paper>

      <Box
        className="relative hidden md:flex flex-auto items-center justify-center h-full p-64 lg:px-112 overflow-hidden"
        sx={{ backgroundImage: 'url(assets/images/backgrounds/signin.jpg)' }}
      >
        <div className="z-10 relative w-full max-w-2xl">
          <div className="text-7xl font-bold leading-none text-gray-100">
            <div>MonitoringPRO</div>
          </div>
          <div className="mt-24 text-lg tracking-tight leading-6 text-gray-400">
            CRM od spoločnosti MonitoringPRO umožňuje klientom jednoducho vidieť aktuálne informácie o ich kotolni a
            vykurovacom systéme. Pomocou tejto aplikácie môžu klienti ľahko zobraziť stav svojho kotla, zobraziť
            históriu opráv a údržby a dokonca aj vyžiadať servis, keď je to potrebné.
          </div>
          <div className="flex items-center mt-32">
            <AvatarGroup
              sx={{
                '& .MuiAvatar-root': {
                  borderColor: 'primary.main',
                },
              }}
            >
              <Avatar src="assets/images/avatars/female-18.jpg" />
              <Avatar src="assets/images/avatars/female-11.jpg" />
              <Avatar src="assets/images/avatars/male-09.jpg" />
              <Avatar src="assets/images/avatars/male-16.jpg" />
            </AvatarGroup>

            <div className="ml-16 font-medium tracking-tight text-gray-400">
              Pridalo sa k nám viac ako tisíc ľudí, ste na rade.
            </div>
          </div>
        </div>
      </Box>
    </div>
  );
}

export default SignInPage;
