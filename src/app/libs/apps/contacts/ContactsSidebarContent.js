import NavLinkAdapter from '@app/core/NavLinkAdapter';
import FuseSvgIcon from '@app/core/SvgIcon';
import IconButton from '@mui/material/IconButton';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';

function ContactsSidebarContent(props) {
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col flex-auto">
      <IconButton
        className="absolute top-0 right-0 my-16 mx-32 z-10"
        sx={{ color: 'white' }}
        component={NavLinkAdapter}
        to="/apps/contacts"
        size="large"
      >
        <FuseSvgIcon>heroicons-outline:x</FuseSvgIcon>
      </IconButton>

      <Outlet />
    </div>
  );
}

export default ContactsSidebarContent;
