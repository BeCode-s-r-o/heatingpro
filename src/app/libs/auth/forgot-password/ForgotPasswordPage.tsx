import { yupResolver } from '@hookform/resolvers/yup';
import _ from '@lodash';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { auth } from 'src/firebase-config';
import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const schema = yup.object().shape({
  email: yup.string().email('Musíte zadať platný e-mail').required('Musíte zadať e-mail'),
});

const defaultValues = {
  email: '',
};
function sendResetPasswordEmail(email) {
  sendPasswordResetEmail(auth, email)
    .then(function () {
      toast.success('Obnovenie hesla bolo zaslané na váš email', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    })
    .catch(function (error) {
      toast.error('Ops, niečo sa nepodarilo, opakujte prosím akciu', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    });
}

function ClassicForgotPasswordPage() {
  const { control, formState, handleSubmit, reset } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  function onSubmit(e) {
    sendResetPasswordEmail(e.email);
    reset(defaultValues);
  }

  return (
    <div className="flex flex-col flex-auto items-center sm:justify-center min-w-0">
      <ToastContainer />
      <Paper className="w-full sm:w-auto min-h-full sm:min-h-auto rounded-0 py-32 px-16 sm:p-48 sm:rounded-2xl sm:shadow">
        <div className="w-full max-w-320 sm:w-320 mx-auto sm:mx-0">
          <img className="w-160" src="assets/images/logo/logo.png" alt="logo" />

          <Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight">
            Zabudli ste heslo?
          </Typography>
          <div className="flex items-baseline mt-2 font-medium">
            <Typography>Zadajte svoju emailovú adresu a my vám zašleme odkaz na obnovenie hesla.</Typography>
          </div>

          <form
            name="registerForm"
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
                  type="email"
                  error={!!errors.email}
                  helperText={errors?.email?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />

            <Button
              variant="contained"
              color="secondary"
              className=" w-full mt-4"
              aria-label="Register"
              disabled={_.isEmpty(dirtyFields) || !isValid}
              type="submit"
              size="large"
            >
              Odoslať odkaz
            </Button>

            <Typography className="mt-32 text-md font-medium" color="text.secondary">
              <span>Späť na</span>
              <Link className="ml-4" to="/prihlasenie">
                prihlásenie
              </Link>
            </Typography>
          </form>
        </div>
      </Paper>
    </div>
  );
}

export default ClassicForgotPasswordPage;
