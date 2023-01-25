import FuseShortcuts from '@app/core/Shortcuts';
import { selectFlatNavigation } from 'app/store/slices/navigationSlice';
import { selectUserShortcuts } from 'app/store/userSlice';
import { useDispatch, useSelector } from 'react-redux';

function NavigationShortcuts(props) {
  const { variant, className } = props;
  const dispatch = useDispatch();
  const shortcuts = useSelector(selectUserShortcuts) || [];
  const navigation = useSelector(selectFlatNavigation);

  function handleShortcutsChange(newShortcuts) {}

  return (
    <FuseShortcuts
      className={className}
      variant={variant}
      navigation={navigation}
      shortcuts={shortcuts}
      onChange={handleShortcutsChange}
    />
  );
}

export default NavigationShortcuts;
