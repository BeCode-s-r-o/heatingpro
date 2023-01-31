import FuseLoading from '@app/core/Loading';
import NavLinkAdapter from '@app/core/NavLinkAdapter';
import FuseSvgIcon from '@app/core/SvgIcon';
import { TContact } from '@app/types/TContact';
import PermDeviceInformationIcon from '@mui/icons-material/PermDeviceInformation';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Box from '@mui/system/Box';
import { AppDispatch } from 'app/store/index';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getContact } from '../store/singleContactSlice';

const ContactView = () => {
  //@ts-ignore
  const contact: TContact = useSelector<RootState>((state) => selectContactById(state, id || ''));
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getContact(id || ''));
  }, [dispatch, id]);

  if (!contact) {
    return <FuseLoading />;
  }

  return (
    <>
      <Box
        className="relative w-full h-160 sm:h-192 px-32 sm:px-48"
        sx={{
          backgroundColor: 'background.default',
        }}
      ></Box>
      <div className="relative flex flex-col flex-auto items-center p-24 pt-0 sm:p-48 sm:pt-0">
        <div className="w-full max-w-3xl">
          <div className="flex flex-auto items-end -mt-64">
            <Avatar
              sx={{
                borderWidth: 4,
                borderStyle: 'solid',
                borderColor: 'background.paper',
                backgroundColor: 'background.default',
                color: 'text.secondary',
              }}
              className="w-128 h-128 text-64 font-bold"
              alt={contact.name}
            >
              {contact.name.charAt(0)}
            </Avatar>
            <div className="flex items-center ml-auto mb-4">
              <Button variant="contained" color="secondary" component={NavLinkAdapter} to="edit">
                <FuseSvgIcon size={20}>heroicons-outline:pencil-alt</FuseSvgIcon>
                <span className="mx-8">Upraviť</span>
              </Button>
            </div>
          </div>

          <Typography className="mt-12 text-4xl font-bold truncate">{contact.name}</Typography>

          <div className="flex flex-wrap items-center mt-8">
            <Chip label={contact.role} className="mr-12 mb-12" size="small" />
          </div>

          <Divider className="mt-16 mb-24" />

          <div className="flex flex-col space-y-32">
            {contact.email && (
              <div className="flex items-center">
                <FuseSvgIcon size={20}>heroicons-solid:mail</FuseSvgIcon>
                <div className="ml-24 leading-6">{contact.email}</div>
              </div>
            )}

            {contact.phone && (
              <div className="flex items-center">
                <PermDeviceInformationIcon />
                <div className="ml-24 leading-6">{contact.phone}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactView;
