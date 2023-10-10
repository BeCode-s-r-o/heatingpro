import FuseSvgIcon from '@app/core/SvgIcon';
import { TBoiler } from '@app/types/TBoilers';
import {
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import * as Sentry from '@sentry/react';
import { AppDispatch } from 'app/store/index';
import { showMessage } from 'app/store/slices/messageSlice';
import { selectUser } from 'app/store/userSlice';
import axios from 'axios';
import { doc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { db } from 'src/firebase-config';
import { getBoiler } from '../../store/boilersSlice';
import { getCurrentDate } from './functions/datesOperations';
import ConfirmModal from './modals/ConfirmModal';
import NewBoilerSettingsModal from './modals/NewBoilerSettingsModal';
import TableSettingsModal from './modals/TableSettingsModal';
import moment from 'moment';
interface Props {
  boiler: TBoiler | undefined;
}

export const BoilersDetailHeader = ({ boiler }: Props) => {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [newPeriod, setNewPeriod] = useState<string>();
  const [newSmsLimit, setNewSmsLimit] = useState<any>(boiler?.smsLimit);
  const [showConfirmModalPeriodChange, setShowConfirmModalChange] = useState(false);
  const [showConfirmModalSmsLimitChange, setShowConfirmModalSmsLimitChange] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [showPeriodSetting, setShowPeriodSetting] = useState(false);
  const [showSmsLimitSettings, setShowSmsLimitSettings] = useState(false);
  const [countDown, setCountDown] = useState(30);
  const [isTimerActive, setIstimerActive] = useState(false);
  const [isInfSmsTimerActive, setIsInfSmsTimerActive] = useState(false);
  const user = useSelector(selectUser);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    setNewPeriod(boiler?.period);
  }, [boiler]);

  useEffect(() => {
    if ((isTimerActive || isInfSmsTimerActive) && countDown === 1) {
      setCountDown(30);
      setIstimerActive(false);
      setIsInfSmsTimerActive(false);
      dispatch(getBoiler(boiler?.id));
    } else if (isTimerActive) {
      const timer = setTimeout(() => {
        setCountDown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  });

  const onBoilerReset = async () => {
    setShowConfirmReset(true);
    const data = {
      phoneNumber: boiler?.phoneNumber,
      boilerId: boiler?.id,
    };
    try {
      await axios.post('https://api.monitoringpro.sk/reset-boiler', data);
      dispatch(showMessage({ message: 'Kotolňa bola úspešne resetovaná.' }));
      dispatch(getBoiler(boiler?.id || ''));
    } catch (error) {
      Sentry.captureException(error);
      dispatch(showMessage({ message: 'Ups, vyskytla sa chyba ' + error }));
    }
    setTimeout(() => {
      setShowConfirmReset(false);
    }, 3000);
  };

  const sendSMSToGetData = async () => {
    const data = {
      phoneNumber: boiler?.phoneNumber,
      boilerId: boiler?.id,
    };
    if (numberOfDailySMS === 3 && !(user.role === 'admin' || user.role === 'instalater')) {
      dispatch(showMessage({ message: 'SMS nebolo možné poslať, lebo ste dosiahli svoj denný limit SMS' }));
      return;
    } else {
      try {
        !(user.role === 'admin' || user.role === 'instalater') && increaseNumberOfSendDailySMS();
        await axios.post('https://api.monitoringpro.sk/get-data', data);
        dispatch(showMessage({ message: 'Dáta boli úspešne vyžiadané, zobrazia sa do 30 sekúnd.' }));
        setIstimerActive(true);
      } catch (error) {
        Sentry.captureException(error);
        dispatch(showMessage({ message: 'Ups, vyskytla sa chyba ' + error }));
      }
    }
  };

  const sendSMSToGetInf = async () => {
    const data = {
      phoneNumber: boiler?.phoneNumber,
      boilerId: boiler?.id,
    };
    try {
      await axios.post('https://api.monitoringpro.sk/boiler-info', data);
      dispatch(showMessage({ message: 'Informačná SMS bola úspešne vyžiadaná, zobrazí sa do 30 sekúnd.' }));
      setIsInfSmsTimerActive(true);
    } catch (error) {
      Sentry.captureException(error);
      dispatch(showMessage({ message: 'Ups, vyskytla sa chyba ' + error }));
    }
  };
  const increaseNumberOfSendDailySMS = () => {
    const boilerRef = doc(db, 'boilers', boiler?.id || '');
    const newArrayOfRequestedSMS = boiler?.requestedSMS.filter((item) => item.dateOfRequest === today) || [];
    updateDoc(boilerRef, { requestedSMS: [{ dateOfRequest: today }, ...newArrayOfRequestedSMS] });
  };

  const sendSmsToChangeSmsLimit = async () => {
    const data = {
      phoneNumber: boiler?.phoneNumber,
      boilerId: boiler?.id,
      smsLimit: newSmsLimit,
    };
    try {
      await axios.post('https://api.monitoringpro.sk/change-sms-limit', data);
      const boilerRef = doc(db, 'boilers', boiler?.id || '');
      updateDoc(boilerRef, { smsLimit: newSmsLimit });
      dispatch(showMessage({ message: 'SMS limit bol úspešne zmenený' }));
      //zmenit limit na BE + redux
    } catch (error) {
      Sentry.captureException(error);
      dispatch(showMessage({ message: 'Ups, vyskytla sa chyba ' + error }));
    } finally {
      dispatch(getBoiler(boiler?.id));
      setShowConfirmModalSmsLimitChange(false);
      setShowSmsLimitSettings(false);
    }
  };

  const sendSmsToChangePeriod = async () => {
    const data = {
      phoneNumber: boiler?.phoneNumber,
      boilerId: boiler?.id,
      period: periodOptions.find((option) => option.period === newPeriod)?.value,
    };
    try {
      await axios.post('https://api.monitoringpro.sk/change-period', data);
      const boilerRef = doc(db, 'boilers', boiler?.id || '');
      updateDoc(boilerRef, { period: newPeriod });
      dispatch(showMessage({ message: 'Perióda bola úspešne zmenená' }));
      //zmenit periodu na BE + redux
    } catch (error) {
      Sentry.captureException(error);
      dispatch(showMessage({ message: 'Ups, vyskytla sa chyba ' + error }));
    } finally {
      dispatch(getBoiler(boiler?.id));
      setShowConfirmModalChange(false);
      setShowPeriodSetting(false);
    }
  };

  const handlePeriodChange = (e) => {
    const { value } = e.target;
    setNewPeriod(periodOptions.find((option) => option.value === value)?.period);
  };

  const handleSmsLimitChange = (e) => {
    const { value } = e.target;
    setNewSmsLimit(smsLimitOptions.find((option) => option.value === value)?.value);
  };

  const periodOptions = [
    { value: 1, period: '24', smsPerDay: 1 },
    { value: 2, period: '12', smsPerDay: 2 },
    { value: 3, period: '8', smsPerDay: 3 },
    { value: 4, period: '6', smsPerDay: 4 },
    { value: 5, period: '4', smsPerDay: 6 },
    { value: 6, period: '3', smsPerDay: 8 },
    { value: 7, period: '2', smsPerDay: 12 },
    { value: 8, period: '1', smsPerDay: 24 },
    { value: 9, period: '0.5', smsPerDay: '720 (každé 2 minúty)' },
    { value: 0, period: '0', smsPerDay: 0 },
  ];

  const smsLimitOptions = [
    { value: 0, smsPerPeriod: 'vypnute zasielania' },
    { value: 1, smsPerPeriod: 10 },
    { value: 2, smsPerPeriod: 20 },
    { value: 3, smsPerPeriod: 30 },
    { value: 4, smsPerPeriod: 40 },
    { value: 5, smsPerPeriod: 50 },
    { value: 6, smsPerPeriod: 60 },
    { value: 7, smsPerPeriod: 70 },
    { value: 8, smsPerPeriod: 80 },
    { value: 9, smsPerPeriod: 'vypnutie limitov' },
  ];

  const today = getCurrentDate();
  const numberOfDailySMS = boiler?.requestedSMS?.filter((item) => item.dateOfRequest === today).length;
  const currentSmsLimit = smsLimitOptions.find((option) => option.value === boiler?.smsLimit)?.smsPerPeriod;

  return (
    <>
      <div className="flex flex-col w-full px-24 sm:px-32">
        <div className="flex flex-col md:flex-row gap-20 lg:gap-0 flex-auto flex-wrap lg:flex-nowrap md:items-center min-w-0 my-32 sm:my-48">
          <div className="flex flex-auto items-center min-w-0">
            <div className="flex flex-col min-w-0 mx-16">
              <div className="flex gap-12 flex-wrap sm:flex-nowrap justify-center sm:justify-start">
                <Avatar
                  className="my-auto "
                  variant="rounded"
                  id="avatar-header"
                  src={boiler?.header.avatar}
                  sx={{ width: 120, height: 80, objectFit: 'fill' }}
                />
                <div>
                  <Typography
                    className="text-2xl md:text-5xl font-semibold tracking-tight leading-7 md:leading-snug truncate"
                    style={{ color: boiler?.disabled ? 'red' : 'black' }}
                  >
                    {boiler?.header.name} {boiler?.disabled && '- vymazaná'}
                  </Typography>
                  <Typography className="text-xl flex gap-6 md:text-3xl font-semibold tracking-tight leading-7 md:leading-snug truncate">
                    Perióda: {boiler?.period} (
                    <small className="mt-0 sm:mt-[4px]">
                      {periodOptions.find((option) => option.period === boiler?.period)?.smsPerDay} SMS/deň
                    </small>
                    )
                    {user?.role === 'admin' && (
                      <FuseSvgIcon
                        className="text-48 cursor-pointer "
                        size={24}
                        color="action"
                        style={{ marginTop: '4px' }}
                        onClick={() => {
                          setShowPeriodSetting(true);
                        }}
                      >
                        material-outline:settings
                      </FuseSvgIcon>
                    )}
                  </Typography>
                  <Typography className="text-xl flex gap-6 md:text-3xl font-semibold tracking-tight leading-7 md:leading-snug truncate">
                    Limit SMS: {boiler?.smsLimit || 'Nenastavený'}
                    <small className="mt-0 sm:mt-[4px]">
                      {boiler?.smsLimit
                        ? `(${
                            typeof currentSmsLimit === 'string' ? currentSmsLimit : currentSmsLimit + ' SMS/perióda'
                          })`
                        : ''}
                    </small>
                    {user?.role === 'admin' && (
                      <FuseSvgIcon
                        className="text-48 cursor-pointer "
                        size={24}
                        color="action"
                        style={{ marginTop: '4px' }}
                        onClick={() => {
                          setShowSmsLimitSettings(true);
                        }}
                      >
                        material-outline:settings
                      </FuseSvgIcon>
                    )}
                  </Typography>
                  <Typography className="text-md flex gap-6 md:text-xl font-semibold tracking-tight leading-7 md:leading-snug truncate">
                    Počet vyžiadaných SMS: {numberOfDailySMS}
                    /3 za deň
                  </Typography>
                  <Typography className="text-md flex gap-6 md:text-xl font-semibold tracking-tight leading-7 md:leading-snug truncate">
                    Verzia softvéru: {boiler?.header.softwareVersion}
                  </Typography>
                  {moment(boiler?.lastReset).isValid() ? (
                    <Typography className="text-md flex gap-6 md:text-xl font-semibold tracking-tight leading-7 md:leading-snug truncate">
                      Posledný reset: {moment(boiler?.lastReset).format('DD.MM.YYYY HH:mm')}
                    </Typography>
                  ) : null}
                  {boiler?.infSMS?.body?.pocetSms ? (
                    <Typography className="text-md flex gap-6 md:text-xl font-semibold tracking-tight leading-7 md:leading-snug truncate">
                      Odoslaných: {boiler?.infSMS.body.pocetSms.sent} z {boiler?.infSMS.body.pocetSms.total}
                    </Typography>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center flex-wrap md:flex-nowrap gap-12 mt-24 sm:mt-0 sm:mx-8 md:space-x-12">
            <Button
              className="whitespace-nowrap w-full sm:mx-20 sm:w-fit"
              variant="contained"
              color="primary"
              id="infsmsbutton"
              startIcon={
                <FuseSvgIcon className="text-48 text-white " size={24}>
                  heroicons-outline:tag
                </FuseSvgIcon>
              }
              onClick={sendSMSToGetInf}
              disabled={isInfSmsTimerActive}
            >
              {isInfSmsTimerActive ? `INF SMS vyžiadaná` : 'INF SMS'}
            </Button>
            <Button
              className="whitespace-nowrap w-full mx-20 sm:w-fit"
              variant="contained"
              color="primary"
              startIcon={
                <FuseSvgIcon className="text-48 text-white " size={24}>
                  heroicons-outline:upload
                </FuseSvgIcon>
              }
              onClick={sendSMSToGetData}
              disabled={isTimerActive}
            >
              {isTimerActive ? `Dáta vyžiadané` : 'Vyžiadať data'}
            </Button>
            <Button
              className="whitespace-nowrap w-full mx-20 sm:w-fit"
              variant="contained"
              disabled={showConfirmReset}
              color="secondary"
              startIcon={
                <FuseSvgIcon className="text-48 text-white" size={24}>
                  heroicons-outline:rss
                </FuseSvgIcon>
              }
              onClick={onBoilerReset}
            >
              {showConfirmReset ? 'Resetujem...' : 'Resetovať'}
            </Button>
            {boiler && (
              <>
                {boiler.columns.length === 0 ? (
                  <NewBoilerSettingsModal
                    boiler={boiler}
                    isOpen={isSettingsModalOpen}
                    toggleOpen={() => {
                      setIsSettingsModalOpen((prev) => !prev);
                    }}
                  />
                ) : (
                  <TableSettingsModal
                    boiler={boiler}
                    isOpen={isSettingsModalOpen}
                    toggleOpen={() => {
                      setIsSettingsModalOpen((prev) => !prev);
                    }}
                    columnsValues={[]}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Dialog
        onClose={() => {
          setShowSmsLimitSettings(false);
        }}
        open={showSmsLimitSettings}
      >
        <DialogTitle>Nastavenie limitov odoslaných SMS</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" className="mt-8">
            <strong>Hodnota: </strong>
            {smsLimitOptions.find((option) => option.value === newSmsLimit)?.value || 'Nenastavená'}
          </DialogContentText>
          <Box id="alert-dialog-description" className="mt-8 flex gap-12 items-center">
            <InputLabel id="demo-simple-select-label">
              <strong>SMS za periódu:</strong>
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select-2" //@ts-ignore
              value={smsLimitOptions.find((option) => option.value === newSmsLimit)?.value}
              className="h-20 w-100"
              onChange={handleSmsLimitChange}
              style={{ minWidth: '100px' }}
            >
              {smsLimitOptions.map((option, i) => (
                <MenuItem key={i} value={option.value}>
                  {option.smsPerPeriod}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <DialogActions className="mt-20">
            <Button
              className="whitespace-nowrap w-fit mb-2 mr-4"
              variant="contained"
              color="primary"
              onClick={() => setShowConfirmModalSmsLimitChange(true)}
            >
              Zmeniť limit
            </Button>
            <Button
              className="whitespace-nowrap w-fit mb-2 mr-8"
              variant="contained"
              color="secondary"
              onClick={() => {
                setShowSmsLimitSettings(false);
              }}
            >
              Zrušiť
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
      <Dialog
        onClose={() => {
          setShowPeriodSetting(false);
        }}
        open={showPeriodSetting}
      >
        <DialogTitle>Nastavenie periódy</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" className="mt-8">
            <strong>Sms za Deň: </strong>
            {periodOptions.find((option) => option.period === newPeriod)?.smsPerDay}
          </DialogContentText>
          <Box id="alert-dialog-description" className="mt-8 flex gap-12 items-center">
            <InputLabel id="demo-simple-select-label">
              <strong>Perióda:</strong>
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select" //@ts-ignore
              value={periodOptions.find((option) => option.period === newPeriod)?.value}
              className="h-20"
              onChange={handlePeriodChange}
            >
              {periodOptions.map((option, i) => (
                <MenuItem key={i} value={option.value}>
                  {' '}
                  {option.period}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <DialogActions className="mt-20">
            <Button
              className="whitespace-nowrap w-fit mb-2 mr-4"
              variant="contained"
              color="primary"
              onClick={() => setShowConfirmModalChange(true)}
            >
              Zmeniť periódu
            </Button>
            <Button
              className="whitespace-nowrap w-fit mb-2 mr-8"
              variant="contained"
              color="secondary"
              onClick={() => {
                setShowPeriodSetting(false);
              }}
            >
              Zrušiť
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
      <ConfirmModal
        open={showConfirmModalPeriodChange}
        onClose={() => setShowConfirmModalChange(false)}
        onConfirm={sendSmsToChangePeriod}
        title={'Zmena periódy'}
        message={'Naozaj si želáte zmeniť periódu?'}
        confirmText={'Zmeniť'}
        cancelText={'Zrušiť'}
      />
      <ConfirmModal
        open={showConfirmModalSmsLimitChange}
        onClose={() => setShowConfirmModalSmsLimitChange(false)}
        onConfirm={sendSmsToChangeSmsLimit}
        title={'Zmena SMS limitu'}
        message={'Naozaj si želáte zmeniť SMS limit?'}
        confirmText={'Zmeniť'}
        cancelText={'Zrušiť'}
      />
    </>
  );
};
