import FuseLoading from '@app/core/Loading';
import NavLinkAdapter from '@app/core/NavLinkAdapter';
import FuseSvgIcon from '@app/core/SvgIcon';
import { TContact } from '@app/types/TContact';
import PermDeviceInformationIcon from '@mui/icons-material/PermDeviceInformation';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import { Tooltip } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Box from '@mui/system/Box';
import { AppDispatch, RootState } from 'app/store/index';
import { selectUser } from 'app/store/userSlice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectContactById } from '../../../../layout/shared/chatPanel/store/contactsSlice';
import { getBoilers, selectAllBoilers, userAssignedHeaters } from '../../boilers/store/boilersSlice';

const ContactView = () => {
  const { id } = useParams();
  const contact: TContact | undefined = useSelector((state: RootState) => selectContactById(state, id || '')); //@ts-ignore
  const allBoilers = useSelector(selectAllBoilers);
  const userBoilers = userAssignedHeaters(allBoilers, contact?.heaters || []);
  const dispatch = useDispatch<AppDispatch>();
  const { data: user } = useSelector(selectUser);
  useEffect(() => {
    dispatch(getBoilers());
  }, [dispatch]);

  const roles = {
    admin: 'Admin',
    user: 'Klient',
    staff: 'Kurič',
    obsluha: 'Obsluha kotolne',
    instalater: 'Inštalatér',
  };

  if (!contact) {
    return <FuseLoading />;
  }

  const isEditDisabled = () => {
    if (contact?.role === 'admin' && user?.role !== 'admin') {
      return true;
    } else if (user?.role === 'user' && contact?.role !== 'staff') {
      return true;
    }
  };

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
              {(user?.role === 'admin' || (contact.role === 'staff' && user?.role === 'obsluha')) && (
                <Button
                  variant="contained"
                  color="primary"
                  component={NavLinkAdapter}
                  to="edit"
                  disabled={isEditDisabled()}
                >
                  <FuseSvgIcon size={20}>heroicons-outline:pencil-alt</FuseSvgIcon>
                  <span className="mx-8">Upraviť</span>
                </Button>
              )}
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

            {userBoilers.length > 0 ? (
              <div className="flex">
                <WhatshotIcon />

                <div className="min-w-0 ml-24 space-y-4">
                  {userBoilers.map((boiler) =>
                    user?.role === 'admin' || !boiler.disabled ? (
                      <Tooltip
                        key={boiler.id}
                        title={boiler.disabled ? 'Kotolňa je vymazaná' : 'Kotolňa je dostupná'}
                        placement="top"
                      >
                        <div className="flex items-center leading-6">
                          <div className="flex gap-8 justify-center align-items-center">
                            <div
                              className={`rounded-full mt-6 w-10 h-10 ${boiler.disabled ? 'bg-red' : 'bg-green'} `}
                            />
                            {boiler.id}
                          </div>
                          {boiler.header.name && (
                            <>
                              <Typography className="text-md truncate" color="text.secondary">
                                <span className="mx-8">&bull;</span>
                                <span className="font-medium">{boiler.header.name}</span>
                              </Typography>
                            </>
                          )}{' '}
                        </div>
                      </Tooltip>
                    ) : null
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
