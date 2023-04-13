import FuseSvgIcon from '@app/core/SvgIcon';
import { TBoiler } from '@app/types/TBoilers';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { AppDispatch } from 'app/store/index';
import { showMessage } from 'app/store/slices/messageSlice';
import axios from 'axios';
import moment from 'moment';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { getBoiler } from '../../store/boilersSlice';
import NewBoilerSettingsModal from './modals/NewBoilerSettingsModal';
import TableSettingsModal from './modals/TableSettingsModal';
interface Props {
  boiler: TBoiler | undefined;
}

export const BoilersDetailHeader = ({ boiler }: Props) => {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isParametersModalOpen, setIsParametersModalOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
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
    </>
  );
};
