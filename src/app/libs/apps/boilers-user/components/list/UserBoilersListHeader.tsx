import FuseSvgIcon from '@app/core/SvgIcon';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { selectUser } from 'app/store/userSlice';
import { useSelector } from 'react-redux';

export const BoilersListHeader = () => {
  const { data } = useSelector(selectUser);

  return (
    <div className="flex flex-col w-full px-24 sm:px-32">
      <div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 my-32 sm:my-48">
        <div className="flex flex-auto items-center min-w-0">
          <Avatar className="flex-0 w-64 h-64" alt="user photo">
            {data?.name?.[0]}
          </Avatar>
          <div className="flex flex-col min-w-0 mx-16">
            <Typography className="text-2xl md:text-5xl font-semibold tracking-tight leading-7 md:leading-snug truncate">
              {`Vitajte naspäť, ${data?.name || ''}!`}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};
