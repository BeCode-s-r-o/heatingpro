import withReducer from 'app/store/withReducer';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { container, item } from '../../constants';
import reducer from '../../store';
import { getBoilers, selectAllBoilers } from '../../store/boilersSlice';
import { Wrapper } from '../styled/BoilersStyled';
import { BoilersListHeader } from './BoilersListHeader';
import { BoilersListTable } from './BoilersListTable';

const BoilersList = () => {
  const dispatch = useDispatch();
  const data = useSelector(selectAllBoilers);

  useEffect(() => {
    //@ts-ignore
    dispatch(getBoilers());
  }, [dispatch]);

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
              <BoilersListTable data={data || []} />
            </motion.div>
          </motion.div>
        </div>
      }
    />
  );
};

export default withReducer('boilers', reducer)(BoilersList);
