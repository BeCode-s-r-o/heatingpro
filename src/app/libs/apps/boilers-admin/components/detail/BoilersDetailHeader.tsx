import FuseSvgIcon from '@app/core/SvgIcon';
import { TBoiler } from '@app/types/TBoilers';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import moment from 'moment';
import { useState } from 'react';
import TableParametersModal from './TableParametersModal';
import TableSettingsModal from './TableSettingsModal';
interface Props {
  boiler: TBoiler | undefined;
  handlePrint: () => void;
}

export const BoilersDetailHeader = ({ boiler, handlePrint }: Props) => {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isParametersModalOpen, setIsParametersModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col w-full px-24 sm:px-32">
        <div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 my-32 sm:my-48">
          <div className="flex flex-auto items-center min-w-0">
            <div className="flex flex-col min-w-0 mx-16">
              <Typography className="text-2xl md:text-5xl font-semibold tracking-tight leading-7 md:leading-snug truncate">
                Kotolňa {boiler?.name}
              </Typography>

              <div className="flex items-center">
                <FuseSvgIcon size={20} color="action">
                  heroicons-solid:clock
                </FuseSvgIcon>
                {boiler?.lastUpdate && (
                  <Typography className="mx-6 leading-6 truncate" color="text.secondary">
                    Posledná aktualizácia: {moment(boiler?.lastUpdate).format('DD.MM.YYYY HH:mm:ss')}
                  </Typography>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12">
            <Button className="whitespace-nowrap" variant="contained" color="primary" onClick={() => {}}>
              Export
            </Button>
            <Button className="whitespace-nowrap" variant="contained" color="primary" onClick={handlePrint}>
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
            {boiler && (
              <TableSettingsModal
                boiler={boiler}
                isOpen={isSettingsModalOpen}
                toggleOpen={() => {
                  setIsSettingsModalOpen((prev) => !prev);
                }}
              />
            )}
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
            <Button className="whitespace-nowrap" variant="contained" color="primary" onClick={handlePrint}>
              Vyžiadať dáta
            </Button>
            {boiler && (
              <TableParametersModal
                boiler={boiler}
                isOpen={isParametersModalOpen}
                toggleOpen={() => {
                  setIsParametersModalOpen((prev) => !prev);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
