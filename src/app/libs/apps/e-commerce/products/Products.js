import FusePageCarded from '@app/core/FusePageCarded';
import useThemeMediaQuery from '@app/hooks/useThemeMediaQuery';
import withReducer from 'app/store/withReducer';
import reducer from '../store';
import ProductsHeader from './ProductsHeader';
import ProductsTable from './ProductsTable';

function Products() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <FusePageCarded header={<ProductsHeader />} content={<ProductsTable />} scroll={isMobile ? 'normal' : 'content'} />
  );
}

export default withReducer('eCommerceApp', reducer)(Products);
