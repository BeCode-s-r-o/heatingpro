import { TBoiler } from '@app/types/TBoilers';
import { AppDispatch, RootState } from 'app/store/index';
import { selectUser } from 'app/store/userSlice';
import withReducer from 'app/store/withReducer';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { container, item } from '../../constants';
import reducer from '../../store';
import { getUserBoiler, selectBoilerById } from '../../store/userBoilersSlice';
import { Wrapper } from '../styled/BoilersStyled';
import { BoilersDetailHeader } from './UserBoilersDetailHeader';
import { BoilersDetailTable } from './UserBoilersDetailTable';

const BoilersDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const boiler = useSelector<RootState, TBoiler | undefined>((state) => selectBoilerById(state, id || ''));
  const { data: userData } = useSelector(selectUser);
  useEffect(() => {
    dispatch(getUserBoiler({ id: id || '', userId: userData?.id || '' }));
  }, [id, dispatch]);

  return !boiler ? (
    <Wrapper header={<BoilersDetailHeader doesNotExist />} />
  ) : (
    <Wrapper
      header={<BoilersDetailHeader data={boiler} />}
      content={
        <div className="w-full p-12 pt-16 sm:pt-24 lg:ltr:pr-0 lg:rtl:pl-0">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-6 gap-24 w-full min-w-0 p-24"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={item} className="sm:col-span-6">
              <BoilersDetailTable />
            </motion.div>
          </motion.div>
        </div>
      }
    />
  );
};

export default withReducer('userBoilers', reducer)(BoilersDetail);
