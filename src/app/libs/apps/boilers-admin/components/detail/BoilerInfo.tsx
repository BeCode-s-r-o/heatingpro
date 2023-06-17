import FuseSvgIcon from '@app/core/SvgIcon';
import { TBoiler } from '@app/types/TBoilers';
import { TContact } from '@app/types/TContact';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { AppDispatch } from 'app/store/index';
import { showMessage } from 'app/store/slices/messageSlice';
import axios from 'axios';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import BoilerInfoModal from './modals/BoilerInfoModal';
import ChangeNotifications from './modals/ChangeNotfications';
import ConfirmModal from './modals/ConfirmModal';

const BoilerInfo = ({ boiler, headerRef, user }: { boiler: TBoiler; headerRef: any; user: TContact | undefined }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showChangeNotifications, setShowChangeNotifications] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const deleteBoiler = async () => {
    const data = {
      phoneNumber: boiler?.phoneNumber,
      boilerId: boiler?.id,
      period: '0',
    };
    try {
      await axios.post('https://api.monitoringpro.sk/delete-boiler', data);
      dispatch(showMessage({ message: 'Kotolňa bola vymazaná.' }));
      //todo - vymazat boiler z DB alebo mu nastavit ze disabled a nezobrazovat v appke
    } catch (error) {
      dispatch(showMessage({ message: 'Ups, vyskytla sa chyba ' + error }));
    }
  };

  const availableColumns = boiler?.columns.reduce<any>((acc, curr) => {
    if (curr.hide || !curr.desc) {
      return acc;
    }
    return [...acc, { description: curr.desc, name: curr.columnName, unit: curr.unit }];
  }, []);

  return (
    <Paper ref={headerRef} className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden">
      <Box
        className="flex jusitfy-between flex-wrap gap-20 lg:gap-0 overflow-x-scroll"
        style={{ width: '100%', justifyContent: 'space-between' }}
      >
        <Box>
          <Typography className="text-xl pt-7 font-light tracking-tight leading-6 truncate">
            <strong className="font-semibold">Sériové číslo:</strong> {boiler?.header.serialNumber}
          </Typography>
          <Typography className="text-xl pt-7 font-light tracking-tight leading-6 truncate">
            <strong className="font-semibold">Dátum inštalácie:</strong> {boiler?.header.instalationDate}
          </Typography>
          <Typography className="text-xl pt-7 font-light tracking-tight leading-6 truncate">
            <strong className="font-semibold">ID zariadenia:</strong> {boiler?.id}
          </Typography>
          <Typography className="text-xl pt-7 font-light tracking-tight leading-6 truncate">
            <strong className="font-semibold">Adresa:</strong>{' '}
            {boiler?.address.street + ', ' + boiler?.address.city + ', ' + boiler?.address.zip}
          </Typography>
          <Typography className="text-xl pt-7 font-light tracking-tight leading-6 truncate">
            <strong className="font-semibold">Umiestnenie v objekte:</strong> {boiler?.header.location}
          </Typography>
          <Typography className="text-xl pt-7 font-light tracking-tight leading-6 truncate">
            <strong className="font-semibold">Prevádzkovateľ:</strong> {boiler?.header.operator}
          </Typography>
          <Typography className="text-xl pt-7 font-light tracking-tight leading-6 truncate">
            <strong className="font-semibold">Obsluha kotolne:</strong> {boiler?.header.provider}
          </Typography>
          <Typography className="text-xl pt-7 font-light tracking-tight leading-6 truncate">
            <strong className="font-semibold">Kurič 1:</strong> {boiler?.header.staff1}
          </Typography>
          {boiler?.header.staff2 && (
            <Typography className="text-xl pt-7 font-light tracking-tight leading-6 truncate">
              <strong className="font-semibold">Kurič 2:</strong> {boiler?.header.staff2}
            </Typography>
          )}
        </Box>
        <Box className="w-full lg:w-[30%] max-h-25vh overflow-scroll">
          <Button
            onClick={() => setShowChangeNotifications(true)}
            startIcon={
              <FuseSvgIcon className="text-48" size={24} color="primary">
                heroicons-outline:bell
              </FuseSvgIcon>
            }
          >
            Upozornenia
          </Button>
          {boiler?.contactsForNotification.map((notificationContact, i) => {
            return (
              <Typography className="text-lg pt-7 font-light tracking-tight leading-6 truncate" key={i}>
                <strong className="font-semibold">{notificationContact.name}</strong> : {notificationContact.phone}{' '}
                {' ' + notificationContact.email}
              </Typography>
            );
          })}
        </Box>
        {availableColumns.length > 0 && (
          <Box className="w-full lg:w-[30%] max-h-25vh overflow-scroll">
            <Typography className="text-xl pt-7 font-light tracking-tight leading-6 truncate">
              <strong>Vysvetlivky k stĺpcom:</strong>
            </Typography>

            {availableColumns?.map((column, i) => {
              return (
                <Typography key={i} className="text-sm pt-7 font-light tracking-tight leading-6 truncate">
                  <strong className="font-semibold">
                    {column.name} {column.unit ? `(${column.unit})` : null}
                  </strong>{' '}
                  - {column.description}
                </Typography>
              );
            })}
          </Box>
        )}
      </Box>
      <Box className="flex mt-16 gap-12 flex-wrap">
        <Button
          className="whitespace-nowrap w-full sm:w-fit dont-print  "
          variant="contained"
          color="primary"
          startIcon={
            <FuseSvgIcon className="text-48 text-white" size={24} color="action">
              feather:settings
            </FuseSvgIcon>
          }
          onClick={() => setIsModalOpen(true)}
        >
          Nastaviť info
        </Button>
        {user?.role === 'admin' && (
          <Button
            className="whitespace-nowrap  w-full sm:w-fit dont-print "
            variant="contained"
            color="secondary"
            onClick={() => setShowConfirmModal(true)}
          >
            <FuseSvgIcon className="text-32 sm:text-48 text-white mr-6" size={24} color="action">
              material-outline:cancel
            </FuseSvgIcon>
            Vymazať kotolňu
          </Button>
        )}
      </Box>
      <BoilerInfoModal
        boilerData={boiler}
        boilerInfo={boiler.header}
        isOpen={isModalOpen}
        toggleOpen={() => setIsModalOpen((prev) => !prev)}
      />
      <ChangeNotifications
        isOpen={showChangeNotifications}
        close={() => setShowChangeNotifications(false)}
        deviceID={boiler.id}
        notificationsContacts={boiler.contactsForNotification}
      />
      <ConfirmModal
        open={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={deleteBoiler}
        title="Želáte si vymazať kotolňu?"
        message="Táto akcia je nezvratná"
        confirmText="Zmazať"
        cancelText="Zrušiť"
      />
    </Paper>
  );
};

export default BoilerInfo;
