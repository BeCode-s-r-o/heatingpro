import { TBoiler } from '@app/types/TBoilers';
import { Dialog, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import { AppDispatch, RootState } from 'app/store/index';
import { selectUser } from 'app/store/userSlice';
import withReducer from 'app/store/withReducer';
import { motion as m } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { container, item } from '../../constants';
import { boilersSlice, getBoilers, selectBoilerById } from '../../store/boilersSlice';
import { Wrapper } from '../styled/BoilersStyled';
import BoilerInfo from './BoilerInfo';
import { BoilersDetailHeader } from './BoilersDetailHeader';
import { BoilersDetailTable } from './BoilersDetailTable';
import { DailyNotesTable } from './DailyNotesTable';
import { ManualBoilerTable } from './ManualBoilerTable';

const BoilersDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { data: user } = useSelector(selectUser);
  const [loading, setLoading] = useState(true);

  const boiler = useSelector<RootState, TBoiler | undefined>((state) => selectBoilerById(state, id || ''));
  const [showMissingPaymentModal, setShowMissingPaymentModal] = useState(false);

  useEffect(() => {
    if (user?.role === 'user' && boiler && !boiler?.header.isPaid && !loading) {
      setShowMissingPaymentModal(true);
    } else {
      setShowMissingPaymentModal(false);
    }
  }, [user, boiler, loading]);

  useEffect(() => {
    dispatch(getBoilers());
    setLoading(false);
  }, [dispatch]);

  const headerRef = useRef<HTMLDivElement>(null);
  const boilerDetailTableRef = useRef<HTMLDivElement>(null);
  const manualBoilerTableRef = useRef<HTMLDivElement>(null);
  const dailyNotesTableRef = useRef<HTMLDivElement>(null);

  return (
    <>
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
              {loading ? 'Načítavam' : !!boiler ? '' : 'Kotolňa neexistuje'}
            </Typography>
          )
        }
      />{' '}
      {user?.role === 'user' ? (
        <Dialog
          open={showMissingPaymentModal}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title" color="error">
            Pozor
          </DialogTitle>
          <DialogContent>
            <DialogContentText style={{ whiteSpace: 'pre-line' }} id="alert-dialog-description">
              <p className="mb-10">
                Pre vaše konto <strong>neevidujeme</strong> v našom systéme úhradu za služby, pre pokračovanie prosím
                uhraďte faktúru čo najskôr a zašlite nám potvrdenie mailom na:{' '}
                <a href="mailto:info@monitoringpro.sk" style={{ background: '#fff', color: 'red' }}>
                  info@monitoringpro.sk
                </a>
              </p>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      ) : null}
    </>
  );
};

export default withReducer('adminBoilers', boilersSlice.reducer)(BoilersDetail);
