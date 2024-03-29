import FuseSvgIcon from '@app/core/SvgIcon';
import useThemeMediaQuery from '@app/hooks/useThemeMediaQuery';
import _ from '@lodash';
import IconButton from '@mui/material/IconButton';
import { navbarToggle, navbarToggleMobile } from 'app/store/slices/navbarSlice';
import { selectFuseCurrentSettings, setDefaultSettings } from 'app/store/slices/settingsSlice';
import { useDispatch, useSelector } from 'react-redux';

function NavbarToggleButton(props) {
  const dispatch = useDispatch();
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const settings = useSelector(selectFuseCurrentSettings);
  const { config } = settings.layout;

  return (
    <IconButton
      className={props.className}
      color="inherit"
      size="small"
      onClick={(ev) => {
        if (isMobile) {
          dispatch(navbarToggleMobile());
        } else if (config.navbar.style === 'style-2') {
          //@ts-ignore
          dispatch(setDefaultSettings(_.set({}, 'layout.config.navbar.folded', !settings.layout.config.navbar.folded)));
        } else {
          dispatch(navbarToggle());
        }
      }}
    >
      {props.children}
    </IconButton>
  );
}

NavbarToggleButton.defaultProps = {
  children: (
    <FuseSvgIcon size={20} color="action">
      heroicons-outline:view-list
    </FuseSvgIcon>
  ),
};

export default NavbarToggleButton;
