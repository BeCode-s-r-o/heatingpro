import FuseSearch from '@app/core/FuseSearch';
import { selectFlatNavigation } from 'app/store/fuse/navigationSlice';
import { useSelector } from 'react-redux';

function NavigationSearch(props) {
  const { variant, className } = props;
  const navigation = useSelector(selectFlatNavigation);

  return <FuseSearch className={className} variant={variant} navigation={navigation} />;
}

export default NavigationSearch;
