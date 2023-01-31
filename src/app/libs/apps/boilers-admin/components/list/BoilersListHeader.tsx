import FuseSvgIcon from '@app/core/SvgIcon';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { selectUser } from 'app/store/userSlice';
import { useSelector } from 'react-redux';

export const BoilersListHeader = () => {
  const { data } = useSelector(selectUser);

  return (
    <div className="flex flex-col w-full px-24 sm:px-32">
      <div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 my-32 sm:my-48">
        <div className="flex flex-auto items-center min-w-0">
          <Avatar className="flex-0 w-64 h-64" alt="user photo" src={data?.avatar || ''}>
            {data?.name[0]}
          </Avatar>
          <div className="flex flex-col min-w-0 mx-16">
            <Typography className="text-2xl md:text-5xl font-semibold tracking-tight leading-7 md:leading-snug truncate">
              {`Vitajte naspäť, ${data?.name || ''}!`}
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
        <div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12">
          <Button
            className="whitespace-nowrap"
            variant="contained"
            color="primary"
            startIcon={<FuseSvgIcon size={20}>heroicons-solid:plus</FuseSvgIcon>}
          >
            Pridať systém
          </Button>
          <Button
            className="whitespace-nowrap"
            variant="contained"
            color="secondary"
            startIcon={<FuseSvgIcon size={20}>heroicons-solid:cog</FuseSvgIcon>}
          >
            Nastavenia
          </Button>
        </div>
      </div>
    </div>
  );
};
