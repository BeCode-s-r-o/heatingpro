import FuseSvgIcon from '@app/core/SvgIcon';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { selectUser } from 'app/store/userSlice';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import AddNewBoilerModal from './AddNewBoilerModal';

export const BoilersListHeader = () => {
  const { data } = useSelector(selectUser);
  const [showAddNewBoilerModal, setShowAddNewBoilerModal] = useState(false);

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
          </div>
        </div>
        <div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12">
          <Button
            className="whitespace-nowrap"
            variant="contained"
            color="primary"
            startIcon={<FuseSvgIcon size={20}>heroicons-solid:plus</FuseSvgIcon>}
            onClick={() => setShowAddNewBoilerModal(true)}
          >
            Pridať systém
          </Button>
          <AddNewBoilerModal
            isOpen={showAddNewBoilerModal}
            toggleOpen={() => setShowAddNewBoilerModal((prev) => !prev)}
          />
          <Link to="/nastavenia/">
            <Button
              className="whitespace-nowrap"
              variant="contained"
              color="secondary"
              startIcon={<FuseSvgIcon size={20}>heroicons-solid:cog</FuseSvgIcon>}
            >
              Nastavenia
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
