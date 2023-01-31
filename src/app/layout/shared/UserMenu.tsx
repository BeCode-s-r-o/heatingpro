import FuseSvgIcon from '@app/core/SvgIcon';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { selectUser } from 'app/store/userSlice';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';

const UserMenu = () => {
  const user = useSelector(selectUser);
  const [userMenu, setUserMenu] = useState(null);

  const userMenuClick = (event) => {
    setUserMenu(event.currentTarget);
  };

  const userMenuClose = () => {
    setUserMenu(null);
  };

  const getUserRole = () => {
    const userRole = user.role[0];
    if (userRole === 'admin') {
      return 'Admin';
    }
    if (userRole === 'user') {
      return 'Používateľ';
    }
    if (userRole === 'guest') {
      return 'Guest';
    }
  };

  return (
    <>
      <Button className="min-h-40 min-w-40 px-0 md:px-16 py-0 md:py-6" onClick={userMenuClick} color="inherit">
        <div className="hidden md:flex flex-col mx-4 items-end">
          <Typography component="span" className="font-semibold flex">
            {user?.data?.name}
          </Typography>
          <Typography className="text-11 font-medium capitalize" color="text.secondary">
            {getUserRole()}
          </Typography>
        </div>

        <Avatar className="md:mx-4">{user?.data?.name[0]}</Avatar>
      </Button>

      <Popover
        open={Boolean(userMenu)}
        anchorEl={userMenu}
        onClose={userMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        classes={{
          paper: 'py-8',
        }}
      >
        {!user.role || user.role.length === 0 ? (
          <>
            <MenuItem component={Link} to="/prihlasenie" role="button">
              <ListItemIcon className="min-w-40">
                <FuseSvgIcon>heroicons-outline:lock-closed</FuseSvgIcon>
              </ListItemIcon>
              <ListItemText primary="Sign In" />
            </MenuItem>
            <MenuItem component={Link} to="/sign-up" role="button">
              <ListItemIcon className="min-w-40">
                <FuseSvgIcon>heroicons-outline:user-add </FuseSvgIcon>
              </ListItemIcon>
              <ListItemText primary="Sign up" />
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem component={Link} to="/profil" onClick={userMenuClose} role="button">
              <ListItemIcon className="min-w-40">
                <FuseSvgIcon>heroicons-outline:user-circle</FuseSvgIcon>
              </ListItemIcon>
              <ListItemText primary="Profil" />
            </MenuItem>

            <MenuItem
              component={NavLink}
              to="/odhlasit"
              onClick={() => {
                userMenuClose();
              }}
            >
              <ListItemIcon className="min-w-40">
                <FuseSvgIcon>heroicons-outline:logout</FuseSvgIcon>
              </ListItemIcon>
              <ListItemText primary="Odhlásiť" />
            </MenuItem>
          </>
        )}
      </Popover>
    </>
  );
};

export default UserMenu;
