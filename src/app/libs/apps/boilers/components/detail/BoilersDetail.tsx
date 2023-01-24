import withReducer from 'app/store/withReducer';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { TBoiler } from 'src/@app/types/TBoilers';
import { container, item } from '../../constants';
import reducer from '../../store';
import { selectBoilerById } from '../../store/boilersSlice';
import { Wrapper } from '../styled/BoilersStyled';
import { BoilersDetailHeader } from './BoilersDetailHeader';
import { BoilersDetailTable } from './BoilersDetailTable';

const BoilersDetail = () => {
  const { id } = useParams();
  const boiler: any = useSelector((state) => selectBoilerById(state, id || ''));

  return (
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
              <BoilersDetailTable data={boiler} />
            </motion.div>
          </motion.div>
        </div>
      }
    />
  );
};

export default withReducer('boilers', reducer)(BoilersDetail);
