import FuseSvgIcon from '@app/core/SvgIcon';
import { TBoiler } from '@app/types/TBoilers';
import {
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
import { AppDispatch } from 'app/store/index';
import { showMessage } from 'app/store/slices/messageSlice';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getBoiler } from '../../store/boilersSlice';
import ConfirmModal from './modals/ConfirmModal';
import NewBoilerSettingsModal from './modals/NewBoilerSettingsModal';
import TableSettingsModal from './modals/TableSettingsModal';
interface Props {
  boiler: TBoiler | undefined;
}

export const BoilersDetailHeader = ({ boiler }: Props) => {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [newPeriod, setNewPeriod] = useState<string>();
  const [showConfirmModalPeriodChange, setShowConfirmModalChange] = useState(false);
  const [showPeriodSetting, setShowPeriodSetting] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    setNewPeriod(boiler?.period);
  }, [boiler]);

  const sendSMSToGetData = async () => {
    const data = {
      phoneNumber: boiler?.phoneNumber,
      boilerId: boiler?.id,
    };
    try {
      await axios.post('http://localhost:5500/get-data', data);
      dispatch(showMessage({ message: 'Dáta boli úspešne vyžiadané' }));
      dispatch(getBoiler(boiler?.id || ''));
    } catch (error) {
      dispatch(showMessage({ message: 'Ups, vyskytla sa chyba' }));
    }
  };

  const sendSmsToChangePeriod = async () => {
    const data = {
      phoneNumber: boiler?.phoneNumber,
      boilerId: boiler?.id,
      period: periodOptions.find((option) => option.period === newPeriod)?.value,
    };
    try {
      await axios.post('http://localhost:5500/change-period', data);
      dispatch(showMessage({ message: 'Perióda bola úspšene zmenená' }));
    } catch (error) {
      dispatch(showMessage({ message: 'Ups, vyskytla sa chyba' }));
    } finally {
      setShowConfirmModalChange(false);
      setShowPeriodSetting(false);
    }
  };

  const handlePeriodChange = (e) => {
    const { value } = e.target;
    setNewPeriod(periodOptions.find((option) => option.value === value)?.period);
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
    { value: 9, period: '0.5', smsPerDay: 48 },
  ];

  return (
    <>
      <div className="flex flex-col w-full px-24 sm:px-32">
        <div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 my-32 sm:my-48">
          <div className="flex flex-auto items-center min-w-0">
            <div className="flex flex-col min-w-0 mx-16">
              <div className="flex gap-4 ">
                <Typography className="text-2xl md:text-5xl font-semibold tracking-tight leading-7 md:leading-snug truncate">
                  {boiler?.name}
                </Typography>
              </div>
              <div>
                <Typography className="text-xl flex gap-6 md:text-3xl font-semibold tracking-tight leading-7 md:leading-snug truncate">
                  Perióda: {boiler?.period}{' '}
                  <FuseSvgIcon
                    className="text-48 cursor-pointer "
                    size={24}
                    color="action"
                    onClick={() => {
                      setShowPeriodSetting(true);
                    }}
                  >
                    material-outline:settings
                  </FuseSvgIcon>
                </Typography>
                <Typography className="text-xl flex gap-6 md:text-3xl font-semibold tracking-tight leading-7 md:leading-snug truncate">
                  {' '}
                  Sms za Deň: {periodOptions.find((option) => option.period === boiler?.period)?.smsPerDay}
                </Typography>
              </div>
            </div>
          </div>
          <div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12">
            <Button
              className="whitespace-nowrap"
              variant="contained"
              color="primary"
              startIcon={
                <FuseSvgIcon className="text-48 text-white " size={24} color="action">
                  heroicons-outline:upload
                </FuseSvgIcon>
              }
              onClick={sendSMSToGetData}
            >
              Vyžiadať data
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
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
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
          <DialogContentText id="alert-dialog-description" className="mt-8 flex gap-12 items-center">
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
          </DialogContentText>
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
    </>
  );
};
