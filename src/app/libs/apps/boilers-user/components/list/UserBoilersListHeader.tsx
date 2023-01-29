import FuseSvgIcon from '@app/core/SvgIcon';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { selectUser } from 'app/store/userSlice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserBoilers } from '../../store/userBoilersSlice';

export const BoilersListHeader = () => {
  const dispatch: any = useDispatch();
  const user: any = useSelector(selectUser);

  return (
    <div className="flex flex-col w-full px-24 sm:px-32">
      <div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 my-32 sm:my-48">
        <div className="flex flex-auto items-center min-w-0">
          <Avatar className="flex-0 w-64 h-64" alt="user photo">
            {user?.data?.displayName[0]}
          </Avatar>
          <div className="flex flex-col min-w-0 mx-16">
            <Typography className="text-2xl md:text-5xl font-semibold tracking-tight leading-7 md:leading-snug truncate">
              {`Vitajte naspäť, ${user.data.displayName}!`}
            </Typography>

            <div className="flex items-center">
              <FuseSvgIcon size={20} color="action">
                heroicons-solid:bell
              </FuseSvgIcon>
              <Typography className="mx-6 leading-6 truncate" color="text.secondary">
                Máte 2 nové hlásenia a 15 nových úloh
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
