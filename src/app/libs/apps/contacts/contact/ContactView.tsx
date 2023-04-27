import FuseLoading from '@app/core/Loading';
import NavLinkAdapter from '@app/core/NavLinkAdapter';
import FuseSvgIcon from '@app/core/SvgIcon';
import { TContact } from '@app/types/TContact';
import PermDeviceInformationIcon from '@mui/icons-material/PermDeviceInformation';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Box from '@mui/system/Box';
import { AppDispatch, RootState } from 'app/store/index';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getContact, selectContactById } from '../../../../layout/shared/chatPanel/store/contactsSlice';
import { getBoilers, selectAllBoilers, userAssignedHeaters } from '../../boilers-admin/store/boilersSlice';
import { TBoiler } from '@app/types/TBoilers';

const ContactView = () => {
  const { id } = useParams();
  const contact: TContact | undefined = useSelector((state: RootState) => selectContactById(state, id || '')); //@ts-ignore
  const allBoilers = useSelector(selectAllBoilers);
  const userBoilers = userAssignedHeaters(allBoilers, contact?.heaters || []);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getBoilers());
  }, [dispatch]);

  const roles = {
    admin: 'Admin',
    user: 'Zákazník',
    staff: 'Kurič',
    obsluha: 'Obsluha kotolne',
    instalater: 'Inštalatér',
  };

  if (!contact) {
    return <FuseLoading />;
  }

  return (
    <>
      <Box
        className="relative w-full h-160 sm:h-192 px-32 sm:px-48 flex justify-center items-center"
        sx={{
          backgroundColor: '#111827',
        }}
      >
        {' '}
        <div className="logo">
          <img width="200" src="assets/images/logo/logo.png" alt="logo" />
        </div>
      </Box>
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
              src={contact.avatar || undefined}
            >
              {contact.name.charAt(0)}
            </Avatar>
            <div className="flex items-center ml-auto mb-4">
              <Button variant="contained" color="primary" component={NavLinkAdapter} to="edit">
                <FuseSvgIcon size={20}>heroicons-outline:pencil-alt</FuseSvgIcon>
                <span className="mx-8">Upraviť</span>
              </Button>
            </div>
          </div>

          <Typography className="mt-12 text-4xl font-bold truncate">{contact.name}</Typography>

          <div className="flex flex-wrap items-center mt-8">
            <Chip
              label={Object.keys(roles).map((key) => contact.role === key && roles[key])}
              className="mr-12 mb-12"
              size="small"
            />
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

            {userBoilers.length && userBoilers.some((item) => item.id.length > 0) ? (
              <div className="flex">
                <WhatshotIcon />
                <div className="min-w-0 ml-24 space-y-4">
                  {userBoilers.map(
                    (boiler) =>
                      boiler.id !== '' && (
                        <div className="flex items-center leading-6" key={boiler.id}>
                          {boiler.id}

                          {boiler.name && (
                            <>
                              <Typography className="text-md truncate" color="text.secondary">
                                <span className="mx-8">&bull;</span>
                                <span className="font-medium">{boiler.name}</span>
                              </Typography>
                            </>
                          )}
                          {boiler.phoneNumber && (
                            <>
                              <Typography className="text-md truncate" color="text.secondary">
                                <span className="mx-8">&bull;</span>
                                <span className="font-medium">{boiler.phoneNumber}</span>
                              </Typography>
                            </>
                          )}
                        </div>
                      )
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactView;
