import FuseSvgIcon from '@app/core/SvgIcon';
import { TBoiler } from '@app/types/TBoilers';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { AppDispatch, RootState } from 'app/store/index';
import moment from 'moment';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectBoilerById } from '../../store/boilersSlice';
import TableParametersModal from './TableParametersModal';

import TableSettingsModal from './TableSettingsModal';

interface Props {
  data: TBoiler | undefined;
}

export const BoilersDetailHeader = ({ data }: Props) => {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isParametersModalOpen, setIsParametersModalOpen] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const boiler = useSelector<RootState, TBoiler | undefined>((state) => selectBoilerById(state, id || ''));
  console.log(boiler, 'boileris');
  return (
    <div className="flex flex-col w-full px-24 sm:px-32">
      <div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 my-32 sm:my-48">
        <div className="flex flex-auto items-center min-w-0">
          <div className="flex flex-col min-w-0 mx-16">
            <Typography className="text-2xl md:text-5xl font-semibold tracking-tight leading-7 md:leading-snug truncate">
              Bojler {data?.name}
            </Typography>

            <div className="flex items-center">
              <FuseSvgIcon size={20} color="action">
                heroicons-solid:clock
              </FuseSvgIcon>
              {data?.lastUpdate && (
                <Typography className="mx-6 leading-6 truncate" color="text.secondary">
                  Posledná aktualizácia: {moment(data?.lastUpdate).calendar()}
                </Typography>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12">
          <Button className="whitespace-nowrap" variant="contained" color="primary">
            Export
          </Button>
          <Button className="whitespace-nowrap" variant="contained" color="primary">
            Tlač
          </Button>
          <Button
            className="whitespace-nowrap"
            variant="contained"
            color="secondary"
            startIcon={<FuseSvgIcon size={20}>heroicons-solid:cog</FuseSvgIcon>}
            onClick={() => {
              setIsSettingsModalOpen(true);
            }}
          >
            Nastavenia tabuľky
          </Button>
          <TableSettingsModal
            data={data}
            isOpen={isSettingsModalOpen}
            toggleOpen={() => {
              setIsSettingsModalOpen((prev) => !prev);
            }}
          />
          <Button
            className="whitespace-nowrap"
            variant="contained"
            color="secondary"
            startIcon={<FuseSvgIcon size={20}>heroicons-solid:cog</FuseSvgIcon>}
            onClick={() => {
              setIsParametersModalOpen(true);
            }}
          >
            Nastavenia parametrov
          </Button>
          {/*           <TableParametersModal
            data={data}
            isOpen={isParametersModalOpen}
            toggleOpen={() => {
              setIsParametersModalOpen((prev) => !prev);
            }}
          /> */}
        </div>
      </div>
    </div>
  );
};
