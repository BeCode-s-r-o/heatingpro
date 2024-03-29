import { yupResolver } from '@hookform/resolvers/yup';
import _ from '@lodash';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useWindowSize } from 'react-use';
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
  const { control, formState, handleSubmit } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;
  const [showLoginErrorMessage, setshowLoginErrorMessage] = useState(false);

  async function onSubmit({ email, password }) {
    try {
      await authInstance.signInWithEmailAndPassword(email, password);
    } catch (error) {
      setshowLoginErrorMessage(true);
      setTimeout(() => {
        setshowLoginErrorMessage(false);
      }, 3000);
    }
  }

  const { width } = useWindowSize();
  const isPhone = width <= 600;

  return (
    <div className="flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-1 min-w-0">
      <Paper
        style={{
          backgroundImage: isPhone ? 'url(/assets/images/backgrounds/pozadie-mobil.webp)' : undefined,
          backgroundSize: 'cover',
        }}
        className="h-full sm:h-auto md:flex md:items-center md:justify-end w-full sm:w-auto md:h-full md:w-1/2 py-8 px-16 sm:p-48 md:p-64 sm:rounded-2xl md:rounded-none sm:shadow md:shadow-none ltr:border-r-1 rtl:border-l-1"
      >
        <div className="w-full max-w-320 sm:w-320 mx-auto sm:mx-0">
          <img
            className="w-380"
            src={isPhone ? '/assets/images/logo/white.png' : '/assets/images/logo/logo.png'}
            alt="logo"
          />

          <Typography
            style={{ color: isPhone ? 'white' : 'black' }}
            className="mt-32 text-4xl font-extrabold tracking-tight leading-tight"
          >
            Prihlásiť sa
          </Typography>

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
                  label="E-mail"
                  autoFocus
                  style={{ backgroundColor: 'white' }}
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
                  className="mb-12"
                  label="Heslo"
                  type="password"
                  style={{ backgroundColor: 'white' }}
                  error={!!errors.password}
                  helperText={errors?.password?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />
            {showLoginErrorMessage && (
              <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between">
                <Typography className="text-md font-medium" color="error">
                  Heslo alebo E-mail je nesprávny.
                </Typography>
              </div>
            )}
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between">
              <Link className="text-md font-medium" to="/forgot-password">
                Zabudli ste heslo?
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
        sx={{ backgroundImage: 'url(/assets/images/backgrounds/signin.jpg)' }}
      >
        <div className="z-10 relative w-full max-w-2xl">
          <div className="text-7xl font-bold leading-none text-gray-100">
            <div>MonitoringPRO</div>
          </div>
          <div className="mt-24 text-lg tracking-tight leading-6 text-gray-400">
            Vitajte na portáli MonitoringPRO - Vášho spoľahlivého partnera v monitorovaní a správe kotolní! Naša
            inovatívna platforma ponúka komplexné riešenie pre sledovanie a optimalizáciu vykurovacích systémov.
            Umožňuje vám mať v reálnom čase pod kontrolou stav kotla, históriu údržby a plánovať potrebné servisné
            zásahy.
            <br />
            <br />
            MonitoringPRO prináša revolúciu v riadení a údržbe kotolní, zabezpečuje efektívne využitie energie a znižuje
            prevádzkové náklady. Naša aplikácia bola navrhnutá s ohľadom na jednoduchosť a intuitívne ovládanie, aby ste
            mohli mať vždy prístup k dôležitým informáciám a udržiavať Váš vykurovací systém v optimálnom stave.
          </div>
        </div>
      </Box>
    </div>
  );
}

export default SignInPage;
