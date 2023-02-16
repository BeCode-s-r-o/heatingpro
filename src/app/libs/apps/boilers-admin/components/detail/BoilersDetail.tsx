import { TBoiler } from '@app/types/TBoilers';
import FuseSvgIcon from '@app/core/SvgIcon';
import { AppDispatch, RootState } from 'app/store/index';
import { selectUser } from 'app/store/userSlice';
import withReducer from 'app/store/withReducer';
import { motion as m } from 'framer-motion';
import Button from '@mui/material/Button';
import { useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';
import { container, item } from '../../constants';
import { boilersSlice, getBoilers, selectBoilerById } from '../../store/boilersSlice';
import { Wrapper } from '../styled/BoilersStyled';
import { BoilersDetailHeader } from './BoilersDetailHeader';
import { BoilersDetailTable } from './BoilersDetailTable';

const BoilersDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { data: userData } = useSelector(selectUser);
  const boiler = useSelector<RootState, TBoiler | undefined>((state) => selectBoilerById(state, id || ''));
  const isAdmin = userData?.role === 'admin';
  useEffect(() => {
    if (isAdmin) {
      dispatch(getBoilers());
    }
  }, [dispatch]);

  return !isAdmin ? (
    <Navigate to="/404/" replace />
  ) : (
    <Wrapper
      header={<BoilersDetailHeader boiler={boiler} />}
      content={
        <div className="w-full p-12 pt-16 sm:pt-24 lg:ltr:pr-0 lg:rtl:pl-0">
          <m.div
            className="grid grid-cols-1 sm:grid-cols-6 gap-24 w-full min-w-0 p-24"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <m.div variants={item} className="sm:col-span-6">
              <Paper className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden">
                <Typography className="text-xl font-light tracking-tight leading-6 truncate">
                  <strong className="font-semibold">Názov kotolne:</strong> nejaké dáta
                </Typography>
                <Typography className="text-xl pt-7 font-light tracking-tight leading-6 truncate">
                  <strong className="font-semibold">Umiestnenie v objekte:</strong> nejaké dáta
                </Typography>
                <Typography className="text-xl pt-7 font-light tracking-tight leading-6 truncate">
                  <strong className="font-semibold">Prevádzkovateľ:</strong> nejaké dáta
                </Typography>
                <Typography className="text-xl pt-7 font-light tracking-tight leading-6 truncate">
                  <strong className="font-semibold">Obsluha kotolne :</strong> Heating pro s.r.o. - Fero Kurič +421 907
                  899 523
                </Typography>
                <Typography className="text-xl pt-7 font-light tracking-tight leading-6 truncate">
                  <strong className="font-semibold">Kúrič 1 :</strong>
                </Typography>
                <Typography className="text-xl pt-7 font-light tracking-tight leading-6 truncate">
                  <strong className="font-semibold">ID Monitorovacieho zariadenia:</strong> nejaké dáta
                </Typography>
                <Button
                  className="whitespace-nowrap w-fit mt-16 "
                  variant="contained"
                  color="secondary"
                  startIcon={<FuseSvgIcon size={20}>heroicons-solid:cog</FuseSvgIcon>}
                >
                  Zmeniť údaje
                </Button>
              </Paper>
            </m.div>
            <m.div variants={item} className="sm:col-span-6">
              <BoilersDetailTable id={id} />
            </m.div>
          </m.div>
        </div>
      }
    />
  );
};

export default withReducer('adminBoilers', boilersSlice.reducer)(BoilersDetail);
