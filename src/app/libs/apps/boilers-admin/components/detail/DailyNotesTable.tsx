import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer,
  List,
  ListItem,
  ListItemText,
  TextField,
} from '@mui/material';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/system';
import { DataGrid, GridRowId } from '@mui/x-data-grid';
import { AppDispatch, RootState } from 'app/store/index';
import { collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import React from 'react';
import FuseSvgIcon from '@app/core/SvgIcon';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from 'app/store/userSlice';
import { TBoiler } from 'src/@app/types/TBoilers';
import { db } from 'src/firebase-config';
import { getBoiler, selectBoilerById } from '../../store/boilersSlice';
import { showMessage } from 'app/store/slices/messageSlice';

export const DailyNotesTable = ({ id }) => {
  const dispatch = useDispatch<AppDispatch>();
  const boiler = useSelector<RootState, TBoiler | undefined>((state) => selectBoilerById(state, id || ''));
  const actualUser: any = useSelector(selectUser);
  const [isEditRows, setIsEditRows] = React.useState(false);
  const [selectedRowsIds, setSelectedRowsIds] = React.useState<GridRowId[]>([]);
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const [showDetailNote, setShowDetailNote] = React.useState(false);
  const [showNewNoteModal, setShowNewNoteModal] = React.useState(false);
  const [record, setRecord] = React.useState({ date: '', note: '', addedBy: '' });
  const [newNote, setNewNote] = React.useState('');

  const handleClickOpen = () => {
    setShowConfirmModal(true);
  };

  useEffect(() => {
    dispatch(getBoiler(id || ''));
  }, [id, dispatch]);

  const getCurrentDate = () => {
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const addNewRecord = () => {
    const newRecord = {
      date: getCurrentDate(),
      note: newNote,
      addedBy: actualUser.data.name,
      id: self.crypto.randomUUID(),
    };
    const newRecordRef = doc(db, 'boilers', id);
    updateDoc(newRecordRef, { notes: [...rows, newRecord] });
    setShowNewNoteModal(false);
  };

  const deleteSelectedRows = () => {
    const boilerRef = doc(db, 'boilers', id);
    const filteredRows = rows.filter((row) => !selectedRowsIds.includes(row.id));
    try {
      updateDoc(boilerRef, { notes: filteredRows });
    } catch (error) {
      dispatch(showMessage({ message: 'Ups, vyskytla sa chyba' }));
      return;
    }
    dispatch(showMessage({ message: 'Záznam úspešné zmazaný' }));
    dispatch(getBoiler(id || ''));
    setShowConfirmModal(false);
  };

  const columns = [
    {
      field: 'date',
      headerName: `Dátum`,

      flex: 1,
    },
    {
      field: 'note',
      headerName: `Poznámka`,

      flex: 3,
    },
    {
      field: 'addedBy',
      headerName: `Pridal`,

      flex: 1,
    },
    {
      field: 'action',
      headerName: 'Detail',
      sortable: false,
      renderCell: (params) => {
        const onClick = (e) => {
          e.stopPropagation(); // don't select this row after clicking

          const api = params.api;
          const thisRow = {};

          api
            .getAllColumns()
            .filter((c) => c.field !== '__check__' && !!c)
            .forEach((c) => (thisRow[c.field] = params.getValue(params.id, c.field)));
          //@ts-ignore
          setRecord(thisRow);
          setShowDetailNote(true);
        };

        return (
          <>
            <FuseSvgIcon onClick={onClick} color="action" className="cursor-pointer">
              heroicons-outline:search
            </FuseSvgIcon>
          </>
        );
      },
    },
  ];
  const rows = boiler ? boiler.notes : [];

  return (
    <Paper className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden">
      <Typography className="text-lg font-medium tracking-tight leading-6 truncate mx-auto">
        Denník pre kotolňu {id}
      </Typography>

      <div style={{ height: 300, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          checkboxSelection={isEditRows}
          onSelectionModelChange={(ids) => {
            setSelectedRowsIds(ids);
          }}
          rowsPerPageOptions={[10]}
          components={{
            NoRowsOverlay: () => (
              <Stack height="100%" alignItems="center" justifyContent="center">
                Žiadne dáta
              </Stack>
            ),
          }}
        />
      </div>
      <div className="flex gap-16">
        <Button
          className="whitespace-nowrap w-fit mb-2"
          variant="contained"
          color="primary"
          onClick={() => {
            setIsEditRows((prev) => !prev);
          }}
        >
          {!isEditRows ? 'Upraviť' : 'Skryť'}
        </Button>
        {isEditRows && (
          <Button
            disabled={selectedRowsIds.length < 1}
            className="whitespace-nowrap w-fit mb-2"
            variant="contained"
            color="secondary"
            onClick={handleClickOpen}
          >
            Zmazať vybrané riadky
          </Button>
        )}
        <Button
          className="whitespace-nowrap w-fit mb-2"
          variant="contained"
          color="secondary"
          onClick={() => {
            setShowNewNoteModal(true);
          }}
        >
          Pridať
        </Button>
      </div>
      {/* Confirm Dialog */}
      <Dialog
        open={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Želáte si zmazať danné záznamy?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">Táto akcia je nezvratná</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            className="whitespace-nowrap w-fit mb-2 mr-4"
            variant="contained"
            color="primary"
            onClick={() => {
              setShowConfirmModal(false);
            }}
          >
            Zrusiť
          </Button>
          <Button
            className="whitespace-nowrap w-fit mb-2 mr-8"
            variant="contained"
            color="secondary"
            autoFocus
            onClick={deleteSelectedRows}
          >
            Zmazať
          </Button>
        </DialogActions>
      </Dialog>
      {/* Note detail dialog */}
      <Dialog
        onClose={() => {
          setShowDetailNote(false);
        }}
        open={showDetailNote}
      >
        <DialogTitle>Detail</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <strong>Pridané dňa</strong>: {record.date}
          </DialogContentText>
          <DialogContentText id="alert-dialog-description" className="mt-8">
            <strong>Pridal</strong>: {record.addedBy}
          </DialogContentText>
          <DialogContentText id="alert-dialog-description" className="mt-8">
            <strong>Poznámka</strong>: {record.note}
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Drawer anchor="right" open={showNewNoteModal} onClose={() => setShowNewNoteModal(false)}>
        <List className="w-[300px] my-auto">
          <ListItem>
            <ListItemText primary="Pridanie poznámky" className="text-center" />
          </ListItem>

          <ListItem className="w-full">
            <TextareaAutosize
              aria-label="minimum height"
              minRows={15}
              value={newNote}
              onChange={(e) => {
                setNewNote(e.target.value);
              }}
              className="border w-full"
            />
          </ListItem>

          <ListItem className="flex justify-around">
            <Button className="whitespace-nowrap" variant="contained" color="secondary" onClick={addNewRecord}>
              Uložiť
            </Button>
            <Button
              className="whitespace-nowrap"
              variant="contained"
              color="primary"
              onClick={() => {
                setShowNewNoteModal(false);
              }}
            >
              Zrušiť
            </Button>
          </ListItem>
        </List>
      </Drawer>
    </Paper>
  );
};
