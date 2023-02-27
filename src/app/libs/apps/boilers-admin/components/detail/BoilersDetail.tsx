import { TBoiler } from '@app/types/TBoilers';
import { AppDispatch, RootState } from 'app/store/index';
import { selectUser } from 'app/store/userSlice';
import withReducer from 'app/store/withReducer';
import { motion as m } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { container, item } from '../../constants';
import { boilersSlice, getBoilers, selectBoilerById } from '../../store/boilersSlice';
import { Wrapper } from '../styled/BoilersStyled';
import BoilerFooter from './BoilerFooter';
import { BoilersDetailHeader } from './BoilersDetailHeader';
import { BoilersDetailTable } from './BoilersDetailTable';
import { ManualBoilerTable } from './ManualBoilerTable';

const BoilersDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { data: userData } = useSelector(selectUser);
  const boiler = useSelector<RootState, TBoiler | undefined>((state) => selectBoilerById(state, id || ''));
  const isAdmin = userData?.role === 'admin';
  const isStaff = userData?.role === 'staff';
  useEffect(() => {
    if (isAdmin || isStaff) {
      dispatch(getBoilers());
    }
  }, [dispatch]);
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  return !isAdmin && !isStaff ? (
    <Navigate to="/404/" replace />
  ) : (
    <Wrapper
      header={<BoilersDetailHeader boiler={boiler} handlePrint={handlePrint} />}
      content={
        <div className="w-full p-12 pt-16 sm:pt-24 lg:ltr:pr-0 lg:rtl:pl-0">
          <m.div
            className="grid grid-cols-1 sm:grid-cols-6 gap-24 w-full min-w-0 p-24"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <m.div variants={item} className="sm:col-span-6">
              <BoilersDetailTable id={id} componentRef={componentRef} />
            </m.div>
            <m.div variants={item} className="sm:col-span-6">
              <ManualBoilerTable id={id} />
            </m.div>
            <m.div variants={item} className="sm:col-span-6">
              {boiler && <BoilerFooter boiler={boiler} />}
            </m.div>
          </m.div>
        </div>
      }
    />
  );
};

export default withReducer('adminBoilers', boilersSlice.reducer)(BoilersDetail);
