import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import { setDoc, doc } from 'firebase/firestore';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { db } from 'src/firebase-config';
import { showMessage } from 'app/store/slices/messageSlice';
import { Typography } from '@mui/material';
import FuseSvgIcon from '@app/core/SvgIcon';
import { Box } from '@mui/system';
import axios from 'axios';
interface Props {
  isOpen: boolean;
  toggleOpen: () => void;
}

const AddNewBoilerModal = ({ isOpen, toggleOpen }: Props) => {
  const dispatch = useDispatch();
  const [pageNumber, setPageNumber] = useState(1);
  const [header, setHeader] = useState({
    name: '',
    location: '',
    provider: '',
    maintenance: '',
    staff1: '',
    staff2: '',
    monitoringDeviceID: '',
  });
  const [newBoiler, setNewBoiler] = useState({
    name: header.name,
    phoneNumber: '',
    assignedTo: '',
    columns: [],
    id: '',
    period: '24',
    header: header,
    notes: [],
    monthTable: { columns: [], rows: [] },
  });

  const handleHeaderChange = (e) => {
    const { name, value } = e.target;
    setHeader((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBoiler((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const pages = [
    {
      number: 1,
      content: (
        <>
          <ListItem>
            <TextField
              className="w-[500px]"
              data-nested="nested"
              type="text"
              label="Názov kotolne"
              value={header.name}
              name="name"
              onChange={handleHeaderChange}
            />
          </ListItem>
          <ListItem>
            <TextField
              className="w-[500px]"
              type="text"
              label="ID"
              value={newBoiler.id}
              name="id"
              onChange={handleChange}
            />
          </ListItem>
          <ListItem>
            <TextField
              className="w-[500px]"
              type="text"
              label="Telefónne číslo"
              value={newBoiler.phoneNumber}
              name="phoneNumber"
              onChange={handleChange}
            />
          </ListItem>
          <ListItem>
            <TextField
              className="w-[500px]"
              type="text"
              label="Perióda"
              value={newBoiler.period}
              name="period"
              onChange={handleChange}
            />
          </ListItem>
          <ListItem>
            <TextField
              className="w-[500px]"
              type="text"
              label="Majiteľ"
              value={newBoiler.assignedTo}
              name="assignedTo"
              onChange={handleChange}
            />
          </ListItem>
        </>
      ),
    },
    {
      number: 2,
      content: (
        <>
          <ListItem>
            <TextField
              className="w-[500px]"
              data-nested="nested"
              type="text"
              label="Umiestnenie v objekte"
              value={header.location}
              name="location"
              onChange={handleHeaderChange}
            />
          </ListItem>
          <ListItem>
            <TextField
              className="w-[500px]"
              data-header=""
              type="text"
              label="Prevádzkovateľ"
              value={header.provider}
              name="provider"
              onChange={handleHeaderChange}
            />
          </ListItem>
          <ListItem>
            <TextField
              className="w-[500px]"
              data-header=""
              type="text"
              label="Kúrič 1"
              value={header.maintenance}
              name="maintenance"
              onChange={handleHeaderChange}
            />
          </ListItem>
          <ListItem>
            <TextField
              className="w-[500px]"
              data-header=""
              type="text"
              label="Kúrič 2"
              value={header.staff1}
              name="staff1"
              onChange={handleHeaderChange}
            />
          </ListItem>
          <ListItem>
            <TextField
              className="w-[500px]"
              data-header=""
              type="text"
              label="ID monit. zariadenia"
              value={header.staff2}
              name="staff2"
              onChange={handleHeaderChange}
            />
          </ListItem>
        </>
      ),
    },
  ];
  const createBoilerOnBackend = async () => {
    try {
      const response = await axios.post('/', {});
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const saveNewBoiler = () => {
    try {
      const boilerRef = doc(db, 'boilers', newBoiler.id);
      setDoc(boilerRef, newBoiler);
      createBoilerOnBackend();
      toggleOpen();
      dispatch(showMessage({ message: 'Boiler bol úspšene pridaný' }));
    } catch (error) {
      toggleOpen();
      dispatch(showMessage({ message: 'Vyskytol sa nejaký problém' }));
    }
  };
  return (
    <Drawer anchor="right" open={isOpen} onClose={toggleOpen}>
      <List className="w-[500px]">
        <ListItem>
          <ListItemText primary="Pridať nový systém" className="text-center" />
        </ListItem>
        {pages.map((page, i) => (
          <div key={i}>{page.number === pageNumber && page.content}</div>
        ))}
        <ListItem className="flex justify-center">
          {pageNumber > 1 && (
            <FuseSvgIcon
              className="text-48 cursor-pointer"
              size={24}
              color="action"
              onClick={() => {
                setPageNumber((prev) => prev - 1);
              }}
            >
              heroicons-outline:arrow-left
            </FuseSvgIcon>
          )}

          {pageNumber === 1 && (
            <FuseSvgIcon
              className="text-48 cursor-pointer"
              size={24}
              color="action"
              onClick={() => {
                setPageNumber((prev) => prev + 1);
              }}
            >
              heroicons-outline:arrow-right
            </FuseSvgIcon>
          )}
        </ListItem>
        <ListItem>
          <Typography className=" text-lg mx-auto">{pageNumber}/2</Typography>
        </ListItem>
        <ListItem className="flex  justify-end gap-12">
          <Button
            className="whitespace-nowrap"
            variant="contained"
            color="primary"
            onClick={saveNewBoiler}
            disabled={pageNumber === 1}
          >
            Vytvoriť
          </Button>
          <Button className="whitespace-nowrap" variant="contained" color="secondary" onClick={toggleOpen}>
            Zrušiť
          </Button>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default AddNewBoilerModal;
