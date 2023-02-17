import FuseSvgIcon from '@app/core/SvgIcon';
import { TBoiler } from '@app/types/TBoilers';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import BoilerInfoModal from './BoilerInfoModal';
const BoilerFooter = ({ boiler }: { boiler: TBoiler }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Paper className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden">
      <Typography className="text-xl font-light tracking-tight leading-6 truncate">
        <strong className="font-semibold">Názov kotolne:</strong> {boiler?.header.name}
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
        <strong className="font-semibold">Kúrič 1:</strong> {boiler?.header.staff1}
      </Typography>
      <Typography className="text-xl pt-7 font-light tracking-tight leading-6 truncate">
        <strong className="font-semibold">Kúrič 2:</strong> {boiler?.header.staff2}
      </Typography>
      <Typography className="text-xl pt-7 font-light tracking-tight leading-6 truncate">
        <strong className="font-semibold">ID Monitorovacieho zariadenia:</strong> {boiler?.header.monitoringDeviceID}
      </Typography>
      <Button
        className="whitespace-nowrap w-fit mt-16 "
        variant="contained"
        color="secondary"
        startIcon={<FuseSvgIcon size={20}>heroicons-solid:cog</FuseSvgIcon>}
        onClick={() => setIsModalOpen(true)}
      >
        Zmeniť údaje
      </Button>
      <BoilerInfoModal
        boilerData={boiler}
        boilerInfo={boiler.header}
        isOpen={isModalOpen}
        toggleOpen={() => setIsModalOpen((prev) => !prev)}
      />
    </Paper>
  );
};

export default BoilerFooter;
