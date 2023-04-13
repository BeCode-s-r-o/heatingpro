import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import { showMessage } from 'app/store/slices/messageSlice';
import 'firebase/firestore';
import Avatar from '@mui/material/Avatar';
import { doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import FuseSvgIcon from '@app/core/SvgIcon';
import { TBoiler, TBoilerInfo } from '@app/types/TBoilers';
import { AppDispatch } from 'app/store/index';
import { useDispatch } from 'react-redux';
import { db } from 'src/firebase-config';
import { getBoiler } from '../../../store/boilersSlice';
import Box from '@mui/material/Box';
interface Props {
  boilerInfo: TBoilerInfo;
  boilerData: TBoiler;
  isOpen: boolean;
  toggleOpen: () => void;
}

function ChangeHeaderInfoModal({ boilerInfo, boilerData, isOpen, toggleOpen }: Props) {
  const [image, setImage] = useState(boilerInfo.avatar || '');
  const [headerData, setHeaderData] = useState(boilerInfo);
  const dispatch = useDispatch<AppDispatch>();

  const handleChange = (e) => {
    const value = e.target.value;
    setHeaderData((prev) => ({
      ...prev,
      [e.target.name]: value,
    }));
  };

  const uptadeHeaderInfo = (id, data) => {
    const newBoilerRef = doc(db, 'boilers', id);
    updateDoc(newBoilerRef, data);
  };

  const updateBoilerDocument = () => {
    try {
      const data = { ...boilerData, header: { ...headerData, avatar: image } };
      uptadeHeaderInfo(boilerData.id, data);
      dispatch(getBoiler(boilerData.id || ''));
      dispatch(showMessage({ message: 'Zmeny boli uložené' }));
      toggleOpen();
    } catch (error) {
      toggleOpen();

      dispatch(showMessage({ message: 'Vyskytol sa nejaký problém' }));
    }
  };

  const handlePicture = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();

    reader.onload = () => {
      //@ts-ignore
      setImage(`data:${file.type};base64,${btoa(reader.result)}`);
    };

    reader.readAsBinaryString(file);
  };

  const handleRemove = () => {
    setImage('');
  };
  return (
    <Drawer anchor="right" open={isOpen} onClose={toggleOpen}>
      <List className="w-[300px]">
        <ListItem>
          <ListItemText primary="Nastavenie Info" />
        </ListItem>
        <ListItem>
          <Box
            sx={{
              borderWidth: 4,
              borderStyle: 'solid',
              borderColor: 'background.paper',
            }}
            className="relative flex items-center justify-center w-128 h-128 rounded-full overflow-hidden mx-auto"
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div>
                <label htmlFor="button-avatar" className="flex p-8 cursor-pointer">
                  <input accept="image/*" className="hidden" id="button-avatar" type="file" onChange={handlePicture} />
                  <FuseSvgIcon className="text-white">heroicons-outline:camera</FuseSvgIcon>
                </label>
              </div>
              <div>
                <IconButton onClick={handleRemove}>
                  <FuseSvgIcon className="text-white">heroicons-solid:trash</FuseSvgIcon>
                </IconButton>
              </div>
            </div>
            <Avatar
              sx={{
                backgroundColor: 'background.default',
                color: 'text.secondary',
              }}
              className="object-cover w-full h-full text-64 font-bold"
              src={image}
              alt={boilerData.name}
            >
              {boilerData.name.charAt(0)}
            </Avatar>
          </Box>
        </ListItem>
        <ListItem>
          <TextField
            className="w-full"
            type="text"
            label="Umiestnenie"
            value={headerData.location}
            name="location"
            onChange={handleChange}
          />
        </ListItem>
        <ListItem>
          <TextField
            className="w-full"
            type="text"
            label="Prevádzkovateľ"
            value={headerData.provider}
            name="provider"
            onChange={handleChange}
          />
        </ListItem>
        <ListItem>
          <TextField
            className="w-full"
            type="text"
            label="Obsluha"
            value={headerData.maintenance}
            name="maintenance"
            onChange={handleChange}
          />
        </ListItem>
        <ListItem>
          <TextField
            className="w-full"
            type="text"
            label="Prevádzkovateľ"
            value={headerData.maintenance}
            name="maintenance"
            onChange={handleChange}
          />
        </ListItem>
        <ListItem>
          <TextField
            className="w-full"
            type="text"
            label="Kurič 1"
            value={headerData.staff1}
            name="staff1"
            onChange={handleChange}
          />
        </ListItem>
        <ListItem>
          <TextField
            className="w-full"
            type="text"
            label="Kurič 2"
            value={headerData.staff2}
            name="staff2"
            onChange={handleChange}
          />
        </ListItem>
        <ListItem>
          <TextField
            className="w-full"
            type="text"
            label="ID monit.zariadenia"
            value={headerData.monitoringDeviceID}
            name="monitoringDeviceID"
            onChange={handleChange}
          />
        </ListItem>{' '}
        <ListItem>
          <TextField
            className="w-full"
            type="number"
            label="Perióda"
            value={headerData.period}
            name="period"
            onChange={handleChange}
          />
        </ListItem>
        <ListItem className="flex justify-end gap-12">
          <Button
            className="whitespace-nowrap"
            variant="contained"
            color="primary"
            onClick={() => updateBoilerDocument()}
          >
            Uložiť
          </Button>
          <Button className="whitespace-nowrap" variant="contained" color="secondary" onClick={toggleOpen}>
            Zrušiť
          </Button>
        </ListItem>
      </List>
    </Drawer>
  );
}

export default ChangeHeaderInfoModal;
