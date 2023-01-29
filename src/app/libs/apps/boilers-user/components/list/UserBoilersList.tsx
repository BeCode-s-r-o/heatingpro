import { TBoiler } from '@app/types/TBoilers';
import { selectUser } from 'app/store/userSlice';
import withReducer from 'app/store/withReducer';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { container, item } from '../../constants';
import reducer from '../../store';
import { getUserBoilers, selectAllBoilers } from '../../store/userBoilersSlice';
import { Wrapper } from '../styled/BoilersStyled';
import { BoilersListHeader } from './UserBoilersListHeader';
import { BoilersListTable } from './UserBoilersListTable';

const BoilersList = () => {
  const dispatch = useDispatch();
  const data = useSelector(selectAllBoilers);
  const { data: userData } = useSelector(selectUser);
  useEffect(() => {
    if (userData.id) {
      dispatch(getUserBoilers({ id: userData.id || '' }) as any);
    }
  }, [userData, dispatch]);

  return (
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
              <BoilersListTable data={(data || []) as TBoiler[]} />
            </motion.div>
          </motion.div>
        </div>
      }
    />
  );
};

export default withReducer('boilers', reducer)(BoilersList);
