import FuseNavigation from '@app/core/Navigation';
import useThemeMediaQuery from '@app/hooks/useThemeMediaQuery';
import { navbarCloseMobile } from 'app/store/slices/navbarSlice';
import { selectNavigation } from 'app/store/slices/navigationSlice';
import clsx from 'clsx';
import { memo, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function Navigation(props) {
  const navigation = useSelector(selectNavigation);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const dispatch = useDispatch();

  return useMemo(() => {
    function handleItemClick(item) {
      if (isMobile) {
        dispatch(navbarCloseMobile());
      }
    }

    return (
      <FuseNavigation
        className={clsx('navigation', props.className)}
        navigation={navigation}
        layout={props.layout}
        dense={props.dense}
        active={props.active}
        onItemClick={handleItemClick}
      />
    );
  }, [dispatch, isMobile, navigation, props.active, props.className, props.dense, props.layout]);
}

Navigation.defaultProps = {
  layout: 'vertical',
};

export default memo(Navigation);
