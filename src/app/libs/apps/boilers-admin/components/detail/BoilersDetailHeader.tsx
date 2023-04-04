import FuseSvgIcon from '@app/core/SvgIcon';
import { TBoiler } from '@app/types/TBoilers';
import { Avatar } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import moment from 'moment';
import { useState } from 'react';
import NewBoilerSettingsModal from './modals/NewBoilerSettingsModal';
import TableParametersModal from './TableParametersModal';
import TableSettingsModal from './TableSettingsModal';
interface Props {
  boiler: TBoiler | undefined;
}

export const BoilersDetailHeader = ({ boiler }: Props) => {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isParametersModalOpen, setIsParametersModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col w-full px-24 sm:px-32">
        <div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 my-32 sm:my-48">
          <div className="flex flex-auto items-center min-w-0">
            <div className="flex flex-col min-w-0 mx-16">
              <div className="flex gap-4 ">
                <Typography className="text-2xl md:text-5xl font-semibold tracking-tight leading-7 md:leading-snug truncate">
                  Kotolňa {boiler?.name}
                </Typography>
              </div>

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
            {/* <Button
              className="whitespace-nowrap"
              variant="contained"
              color="secondary"
              startIcon={<FuseSvgIcon size={20}>heroicons-solid:cog</FuseSvgIcon>}
              onClick={() => {
                setIsSettingsModalOpen(true);
              }}
            >
              Nastavenie prevádzkového denníku
            </Button> */}

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
            <Button
              className="whitespace-nowrap"
              variant="contained"
              color="primary"
              startIcon={
                <FuseSvgIcon className="text-48 text-white " size={24} color="action">
                  heroicons-outline:upload
                </FuseSvgIcon>
              }
              onClick={() => {}}
            >
              Vyžiadať dáta
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

                <TableParametersModal
                  boiler={boiler}
                  isOpen={isParametersModalOpen}
                  toggleOpen={() => {
                    setIsParametersModalOpen((prev) => !prev);
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
