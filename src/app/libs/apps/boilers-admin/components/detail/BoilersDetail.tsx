import { TBoiler } from '@app/types/TBoilers';
import { AppDispatch, RootState } from 'app/store/index';
import { selectUser } from 'app/store/userSlice';
import withReducer from 'app/store/withReducer';
import { motion as m } from 'framer-motion';
import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { container, item } from '../../constants';
import { boilersSlice, getBoilers, selectBoilerById } from '../../store/boilersSlice';
import { Wrapper } from '../styled/BoilersStyled';
import { BoilersDetailHeader } from './BoilersDetailHeader';
import { BoilersDetailTable } from './BoilersDetailTable';
import { DailyNotesTable } from './DailyNotesTable';
import { ManualBoilerTable } from './ManualBoilerTable';
import BoilerInfo from './BoilerInfo';
import { Typography } from '@mui/material';

const BoilersDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { data: user } = useSelector(selectUser);
  const boiler = useSelector<RootState, TBoiler | undefined>((state) => selectBoilerById(state, id || ''));
  const isAdmin = user?.role === 'admin';
  const isStaff = user?.role === 'staff';
  useEffect(() => {
    if (isAdmin || isStaff) {
      dispatch(getBoilers());
    }
  }, [dispatch]);

  const headerRef = useRef<HTMLDivElement>(null);
  const boilerDetailTableRef = useRef<HTMLDivElement>(null);
  const manualBoilerTableRef = useRef<HTMLDivElement>(null);
  const dailyNotesTableRef = useRef<HTMLDivElement>(null);

  return (
    <Wrapper
      header={boiler ? <BoilersDetailHeader boiler={boiler} /> : null}
      content={
        boiler ? (
          <div className="w-full sm:p-12 pt-16 sm:pt-24 lg:ltr:pr-0 lg:rtl:pl-0">
            <m.div
              className="grid grid-cols-1 sm:grid-cols-6 gap-24 w-full min-w-0 p-24"
              variants={container}
              initial="hidden"
              animate="show"
            >
              <m.div variants={item} className="sm:col-span-6">
                {boiler && <BoilerInfo boiler={boiler} headerRef={headerRef} user={user} />}
              </m.div>
              <m.div variants={item} className="sm:col-span-6">
                <BoilersDetailTable id={id} componentRef={boilerDetailTableRef} />
              </m.div>
              <m.div variants={item} className="sm:col-span-6">
                <DailyNotesTable id={id} componentRef={dailyNotesTableRef} />
              </m.div>
              <m.div variants={item} className="sm:col-span-6">
                <ManualBoilerTable id={id} componentRef={manualBoilerTableRef} />
              </m.div>
            </m.div>
          </div>
        ) : (
          <Typography
            style={{ textAlign: 'center', width: '100%', marginTop: '25%' }}
            className="text-2xl md:text-5xl font-semibold tracking-tight leading-7 md:leading-snug truncate"
          >
            Kotolňa neexistuje
          </Typography>
        )
      }
    />
  );
};

export default withReducer('adminBoilers', boilersSlice.reducer)(BoilersDetail);
