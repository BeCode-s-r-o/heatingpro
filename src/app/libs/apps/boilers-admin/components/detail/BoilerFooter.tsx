import FuseSvgIcon from '@app/core/SvgIcon';
import { TBoiler } from '@app/types/TBoilers';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import ConfirmModal from './modals/ConfirmModal';
import BoilerInfoModal from './modals/BoilerInfoModal';
const BoilerFooter = ({ boiler, headerRef }: { boiler: TBoiler; headerRef: any }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const deleteBoiler = () => {
    console.log('Boiler was deleted');
  };
  return (
    <Paper ref={headerRef} className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden">
      {' '}
      <Avatar className="my-auto" src={boiler.header.avatar} sx={{ width: 64, height: 64 }}>
        {'V'}
      </Avatar>
      <Box>
        <Typography className="text-xl pt-7 font-light tracking-tight leading-6 truncate">
          <strong className="font-semibold">ID zariadenia:</strong> {boiler?.id}
        </Typography>
        <Typography className="text-xl pt-7 font-light tracking-tight leading-6 truncate">
          <strong className="font-semibold">Adresa:</strong>{' '}
          {boiler?.address.street + ', ' + boiler?.address.city + ', ' + boiler?.address.zip}
        </Typography>
        <Typography className="text-xl pt-7 font-light tracking-tight leading-6 truncate">
          <strong className="font-semibold">Umiestnenie v objekte:</strong> {boiler?.header.location}
        </Typography>
        <Typography className="text-xl pt-7 font-light tracking-tight leading-6 truncate">
          <strong className="font-semibold">Prevádzkovateľ:</strong> {boiler?.header.provider}
        </Typography>
        <Typography className="text-xl pt-7 font-light tracking-tight leading-6 truncate">
          <strong className="font-semibold">Obsluha kotolne:</strong> {boiler?.header.maintenance}
        </Typography>
        <Typography className="text-xl pt-7 font-light tracking-tight leading-6 truncate">
          <strong className="font-semibold">Perióda:</strong> {boiler?.header.period}
        </Typography>
        <Typography className="text-xl pt-7 font-light tracking-tight leading-6 truncate">
          <strong className="font-semibold">Kúrič 1:</strong> {boiler?.header.staff1}
        </Typography>
        <Typography className="text-xl pt-7 font-light tracking-tight leading-6 truncate">
          <strong className="font-semibold">Kúrič 2:</strong> {boiler?.header.staff2}
        </Typography>
        <Typography className="text-xl pt-7 font-light tracking-tight leading-6 truncate">
          <strong className="font-semibold">ID Monitorovacieho zariadenia:</strong> {boiler?.header.monitoringDeviceID}
        </Typography>
      </Box>
      <Box className="flex mt-16 gap-12">
        <Button
          className="whitespace-nowrap w-fit dont-print  "
          variant="contained"
          color="primary"
          startIcon={
            <FuseSvgIcon className="text-48 text-white" size={24} color="action">
              material-outline:edit
            </FuseSvgIcon>
          }
          onClick={() => setIsModalOpen(true)}
        >
          Nastavenie kotolne
        </Button>
        <Button
          className="whitespace-nowrap w-fit dont-print "
          variant="contained"
          color="secondary"
          onClick={() => setShowConfirmModal(true)}
        >
          <FuseSvgIcon className="text-48 text-white mr-6" size={24} color="action">
            material-outline:cancel
          </FuseSvgIcon>
          Vymazať kotolňu
        </Button>
      </Box>
      <BoilerInfoModal
        boilerData={boiler}
        boilerInfo={boiler.header}
        isOpen={isModalOpen}
        toggleOpen={() => setIsModalOpen((prev) => !prev)}
      />
      <ConfirmModal
        open={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={deleteBoiler}
        title="Želáte si vymazať kotolňu?"
        message="Táto akcia je nezvratná"
        confirmText="Zmazať"
        cancelText="Zrušiť"
      />
    </Paper>
  );
};

export default BoilerFooter;
