import FusePageCarded from '@app/core/FusePageCarded';
import useThemeMediaQuery from '@app/hooks/useThemeMediaQuery';
import withReducer from 'app/store/withReducer';
import reducer from '../store';
import OrdersHeader from './OrdersHeader';
import OrdersTable from './OrdersTable';

function Orders() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <FusePageCarded header={<OrdersHeader />} content={<OrdersTable />} scroll={isMobile ? 'normal' : 'content'} />
  );
}

export default withReducer('eCommerceApp', reducer)(Orders);
