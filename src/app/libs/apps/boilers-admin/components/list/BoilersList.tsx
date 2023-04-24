import { TBoiler } from '@app/types/TBoilers';
import { TContactHeater } from '@app/types/TContact';
import { AppDispatch } from 'app/store/index';
import { selectUser } from 'app/store/userSlice';
import withReducer from 'app/store/withReducer';
import { motion } from 'framer-motion';
import { memo, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { container, item } from '../../constants';
import { boilersSlice, getBoilers, selectAllBoilers } from '../../store/boilersSlice';
import { Wrapper } from '../styled/BoilersStyled';
import { BoilersListHeader } from './BoilersListHeader';
import { BoilersListTable } from './BoilersListTable';

const filterAssignedHeaters = (heaters: TBoiler[], ids: string[]) => {
  return heaters.filter((heater) => ids.includes(heater.id));
};

const getAssignedHeatersIds = (heaters: TContactHeater[] | []) => {
  return heaters.map((device) => device.heater);
};

const BoilersList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const arrayOfAllBoilers = useSelector(selectAllBoilers);

  const { data: userData } = useSelector(selectUser);
  const allowedAuthRoles = ['admin', 'staff', 'instalater'];
  const userRole = userData?.role || '';
  const isAdmin = userRole === 'admin';

  const assignedHeaterIds = useMemo(() => getAssignedHeatersIds(userData?.heaters || []), [userData?.heaters]);

  useEffect(() => {
    if (userData?.role && allowedAuthRoles.includes(userData?.role)) {
      dispatch(getBoilers());
    }
  }, [dispatch, userData?.role]);

  const boilers = () => {
    if (isAdmin) {
      return arrayOfAllBoilers;
    } else {
      return filterAssignedHeaters(arrayOfAllBoilers, assignedHeaterIds);
    }
  };

  return !allowedAuthRoles.includes(userData?.role || '') ? (
    <Navigate to="/pouzivatelske-systemy/" replace />
  ) : (
    <Wrapper
      header={<BoilersListHeader />}
      content={
        <div className="w-full p-12 pt-16 sm:pt-24 lg:ltr:pr-0 lg:rtl:pl-0">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-6 gap-24 w-full min-w-0 p-24"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={item} className="sm:col-span-6">
              <BoilersListTable data={boilers() || []} />
            </motion.div>
          </motion.div>
        </div>
      }
    />
  );
};

export default withReducer('adminBoilers', boilersSlice.reducer)(BoilersList);
