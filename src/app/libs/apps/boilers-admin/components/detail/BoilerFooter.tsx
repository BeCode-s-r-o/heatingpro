import FuseSvgIcon from '@app/core/SvgIcon';
import { TBoiler } from '@app/types/TBoilers';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import BoilerInfoModal from './BoilerInfoModal';
const BoilerFooter = ({ boiler }: { boiler: TBoiler }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Paper className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden">
      {' '}
      <Avatar className="my-auto" src={boiler.header.avatar} sx={{ width: 64, height: 64 }}>
        {'V'}
      </Avatar>
      <Box>
        <Typography className="text-xl pt-7 font-light tracking-tight leading-6 truncate">
          <strong className="font-semibold">ID zariadenia:</strong> {boiler?.id}
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
      </Box>
      <Box className="flex mt-16 gap-12">
        <Button
          className="whitespace-nowrap w-fit  "
          variant="contained"
          color="primary"
          startIcon={<FuseSvgIcon size={20}>heroicons-solid:cog</FuseSvgIcon>}
          onClick={() => setIsModalOpen(true)}
        >
          Zmeniť údaje
        </Button>
        <Button className="whitespace-nowrap  w-fit" variant="contained" color="secondary" onClick={() => {}}>
          Vymazať kotolňu
        </Button>
      </Box>
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
