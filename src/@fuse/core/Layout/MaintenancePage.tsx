import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

const MaintenancePage = () => {
  return (
    <div className="flex flex-col flex-1 items-center justify-center p-16">
      <div className="w-full max-w-3xl text-center flex justify-center align-center">
        <FuseSvgIcon color="white" size={100}>
          heroicons-outline:exclamation
        </FuseSvgIcon>
      </div>

      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}>
        <Typography
          color="white"
          variant="h1"
          className="mt-5 text-4xl md:text-7xl font-extrabold tracking-tight leading-tight md:leading-none text-center"
        >
          Práve prebieha údržba
        </Typography>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}>
        <Typography
          variant="h5"
          color="text.secondary"
          className="mt-8 text-lg md:text-xl font-medium tracking-tight text-center"
        >
          Ospravedlňujeme sa za nepríjemnosti, čoskoro bude stránka opäť dostupná.
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          className="mt-8 text-lg md:text-xl font-medium tracking-tight text-center"
        >
          Ak máte otázky, kontaktujte nás na <a href="mailto:heatingpro@becode.sk">heatingpro@becode.sk</a>
        </Typography>
      </motion.div>
    </div>
  );
};

export default MaintenancePage;
