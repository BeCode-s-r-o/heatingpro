import FuseSvgIcon from '@app/core/SvgIcon';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer,
  Input,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  TextField,
} from '@mui/material';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/system';
import { DataGrid, GridRowId } from '@mui/x-data-grid';
import * as Sentry from '@sentry/react';
import { AppDispatch, RootState } from 'app/store/index';
import { showMessage } from 'app/store/slices/messageSlice';
import { selectUser } from 'app/store/userSlice';
import axios from 'axios';
import { doc, updateDoc } from 'firebase/firestore';
import moment from 'moment';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { TBoiler, TBoilerNote } from 'src/@app/types/TBoilers';
import { db } from 'src/firebase-config';
import { selectBoilerById } from '../../store/boilersSlice';
import { compareDates, formatDateToSK, getCurrentDate } from './functions/datesOperations';
import ConfirmModal from './modals/ConfirmModal';
import HandleSignature from './modals/HandleSignature';

export const DailyNotesTable = ({ id, componentRef }) => {
  const todayDate = new Date().toISOString().split('T')[0];
  const dispatch = useDispatch<AppDispatch>();
  const boiler = useSelector<RootState, TBoiler | undefined>((state) => selectBoilerById(state, id || ''));
  const user: any = useSelector(selectUser);
  const [filterDate, setFilterDate] = useState<Date>();
  const [isEditRows, setIsEditRows] = useState(false);
  const [selectedRowsIds, setSelectedRowsIds] = useState<GridRowId[]>([]);
  const [showDeletRowsConfirmModal, setShowDeleteRowsConfirmModal] = useState(false);
  const [showDetailNote, setShowDetailNote] = useState(false);
  const [showNewNoteModal, setShowNewNoteModal] = useState(false);
  const [showRecordConfirmModal, setShowRecordConfirmModal] = useState(false);
  const [record, setRecord] = useState<TBoilerNote>({
    id: '',
    date: '',
    note: '',
    createdBy: '',
    confirmedBy: '',
    signatureImgURL: null,
  });
  const [rows, setRows] = useState<TBoilerNote[]>([]);

  const [newRecord, setNewRecord] = useState({
    date: todayDate,
    note: '',
    createdBy: user.data.name,
    confirmedBy: '',
    signatureImgURL: null,
    id: self.crypto.randomUUID(),
  });
  const handleClickOpen = () => {
    setShowDeleteRowsConfirmModal(true);
  };
  const defaultRows = boiler?.notes || [];

  useEffect(
    () =>
      setRows(
        [...defaultRows].sort((a, b) => moment(b.date, 'DD.MM.YYYY').valueOf() - moment(a.date, 'DD.MM.YYYY').valueOf())
      ),
    [boiler]
  );

  const addNewRecord = () => {
    let createdRecord = { ...newRecord, date: formatDateToSK(newRecord.date) };
    let newRecordRef = doc(db, 'boilers', id);
    let updatedRows = [...rows, createdRecord];

    try {
      updateDoc(newRecordRef, { notes: updatedRows });
      setShowNewNoteModal(false);
      setRows(updatedRows);
      dispatch(showMessage({ message: 'Záznam úspešné pridaný' }));
    } catch (error) {
      dispatch(showMessage({ message: 'Ups, vyskytla sa chyba ' + error }));
    }
  };

  const deleteSelectedRows = () => {
    const boilerRef = doc(db, 'boilers', id);
    const filteredRows = rows.filter((row) => !selectedRowsIds.includes(row.id));
    try {
      updateDoc(boilerRef, { notes: filteredRows });
    } catch (error) {
      dispatch(showMessage({ message: 'Ups, vyskytla sa chyba ' + error }));
      return;
    }
    dispatch(showMessage({ message: 'Záznam úspešné zmazaný' }));
    setShowDeleteRowsConfirmModal(false);
    setRows(filteredRows);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRecord((prev) => ({ ...prev, [name]: value }));
  };
  const columns = [
    {
      field: 'date',
      headerName: `Dátum`,
      minWidth: 100,
      flex: 0,
      sortable: false,
    },
    {
      field: 'note',
      headerName: `Poznámka`,
      flex: 2,
      minWidth: 200,
      sortable: false,
    },
    {
      field: 'createdBy',
      headerName: `Pridal`,
      flex: 1,
      minWidth: 150,
      sortable: false,
    },
    {
      field: 'confirmedBy',
      headerName: `Kompetentná osoba`,
      flex: 1,
      minWidth: 150,
      sortable: false,
    },

    { field: 'signatureImgURL', hide: true },
    {
      field: 'action',
      headerName: 'Detail',
      flex: 0,
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
            <FuseSvgIcon onClick={onClick} color="action" className="cursor-pointer dont-print">
              heroicons-outline:search
            </FuseSvgIcon>
          </>
        );
      },
    },
  ];
  const handleCleanCalendar = () => {
    setRows(defaultRows);
    setFilterDate(undefined);
  };

  const filterRowsByDate = (date) => {
    setFilterDate(date);

    !date ? setRows(defaultRows) : setRows(defaultRows.filter((row) => compareDates(date, row.date)));
  };
  const getPDF = async () => {
    let data = {
      boilerID: boiler?.id,
      user: user,
      date: getCurrentDate(),
      dateForFilter: filterDate ? filterDate : 'all',
    };

    dispatch(showMessage({ message: 'PDF sa generuje...' }));
    try {
      const response = await axios.post('https://api.monitoringpro.sk/pdf-zapisy', data, {
        responseType: 'blob',
      });
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `Výpis z Kotolne ${boiler?.id} (2 z 3).pdf`;
      link.click();
    } catch (error) {
      Sentry.captureException(error);
      dispatch(showMessage({ message: 'Vyskytla sa chyba pri generovaní PDF' }));
    }
  };
  const rolesEnabledEdit = ['admin'];
  return (
    <Paper className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden" ref={componentRef}>
      <Typography className="text-lg font-medium tracking-tight leading-6 truncate mx-auto">
        Zápisy z dňa {id}
      </Typography>
      {user.role !== 'staff' && (
        <div className="relative my-16">
          <div className="border p-4 relative flex items-center justify-center w-fit  ">
            <FuseSvgIcon className="text-48 pr-4" size={24} color="action">
              material-twotone:calendar_today
            </FuseSvgIcon>
            <DatePicker
              onChange={filterRowsByDate}
              selected={filterDate}
              dateFormat="MM/yyyy"
              showMonthYearPicker
              placeholderText="Vyber mesiac"
              className="w-[6rem] sm:w-[10rem] cursor-pointer"
            />
            <Button onClick={handleCleanCalendar}>Vyčistiť</Button>
          </div>
        </div>
      )}

      <div style={{ height: 300, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          checkboxSelection={isEditRows}
          disableColumnMenu
          onSelectionModelChange={(ids) => {
            setSelectedRowsIds(ids);
          }}
          localeText={{
            MuiTablePagination: {
              labelDisplayedRows: ({ from, to, count: totalCount }) => `${from}-${to} z ${totalCount}`,
            },
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
      <div className="flex flex-wrap sm:flex-nowrap gap-16 mt-20">
        {rolesEnabledEdit.includes(user.role) && (
          <Button
            className="whitespace-nowrap w-full sm:w-fit mb-2 dont-print"
            variant="contained"
            color="primary"
            onClick={() => {
              setIsEditRows((prev) => !prev);
            }}
            startIcon={
              !isEditRows && (
                <FuseSvgIcon className="text-48 text-white" size={24}>
                  material-outline:edit
                </FuseSvgIcon>
              )
            }
          >
            {!isEditRows ? 'Upraviť záznamy' : 'Skryť'}
          </Button>
        )}
        {isEditRows && (
          <Button
            disabled={selectedRowsIds.length < 1}
            className="whitespace-nowrap w-full sm:w-fit mb-2 dont-print"
            variant="contained"
            color="secondary"
            onClick={handleClickOpen}
            startIcon={
              <FuseSvgIcon className="text-48 text-white" size={24}>
                material-outline:delete
              </FuseSvgIcon>
            }
          >
            Zmazať vybrané riadky
          </Button>
        )}
        <Button
          className="whitespace-nowrap w-full sm:w-fit mb-2 dont-print text-white"
          variant="contained"
          color="primary"
          onClick={() => {
            setShowNewNoteModal(true);
          }}
          startIcon={
            <FuseSvgIcon className="text-48" size={24}>
              heroicons-outline:plus-sm
            </FuseSvgIcon>
          }
        >
          Pridať záznam
        </Button>
        <Button
          className="whitespace-nowrap w-full sm:w-fit mb-2 dont-print"
          variant="contained"
          color="primary"
          onClick={getPDF}
          startIcon={
            <FuseSvgIcon className="text-48 text-white" size={24}>
              material-outline:picture_as_pdf
            </FuseSvgIcon>
          }
        >
          Export
        </Button>
        {/*         <Button
          className="whitespace-nowrap w-fit mb-2 dont-print"
          variant="contained"
          color="primary"
          onClick={printTable}
          startIcon={
            <FuseSvgIcon className="text-48 text-white " size={24} color="action">
              material-outline:local_printshop
            </FuseSvgIcon>
          }
        >
          Tlač
        </Button> */}
      </div>
      {/* Confirm Delete */}
      <ConfirmModal
        open={showDeletRowsConfirmModal}
        onClose={() => setShowDeleteRowsConfirmModal(false)}
        onConfirm={deleteSelectedRows}
        title="Želáte si zmazať dané záznamy?"
        message="Táto akcia je nezvratná"
        confirmText="Zmazať"
        cancelText="Zrušiť"
      />
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
            <strong>Pridal</strong>: {record.createdBy}
          </DialogContentText>
          <DialogContentText id="alert-dialog-description" className="mt-8">
            <strong>Potvrdil</strong>: {record.confirmedBy}
          </DialogContentText>
          <DialogContentText id="alert-dialog-description" className="mt-8">
            <strong>Záznam</strong>: {record.note}
          </DialogContentText>
          <DialogContentText className="mt-8">
            <strong>Podpis</strong>:
            {record.signatureImgURL !== null && <img className="mt-24" src={record.signatureImgURL} />}
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Drawer anchor="right" open={showNewNoteModal} onClose={() => setShowNewNoteModal(false)}>
        <div className="max-w-[98vw] overflow-x-scroll">
          <List className="w-[300px] ">
            <ListItem>
              <ListItemText primary="Pridanie záznamu" className="text-center" />
            </ListItem>

            <ListItem className="flex justify-center items-center gap-8">
              <InputLabel htmlFor="dateForNote">Dátum:</InputLabel>
              <Input
                type="date"
                id="dateForNote"
                name="date"
                readOnly={user.role !== 'admin'}
                value={newRecord.date}
                inputProps={{ min: '2018-01-01', max: todayDate }}
                onChange={handleChange}
              />
            </ListItem>

            <ListItem className="w-full">
              <TextField
                aria-label="minimum height"
                label="Pridal"
                name="createdBy"
                disabled
                value={newRecord.createdBy}
                onChange={handleChange}
                className="border w-full"
              />
            </ListItem>

            <ListItem className="w-full">
              <TextField
                aria-label="minimum height"
                label="Meno kompetentnej osoby"
                name="confirmedBy"
                value={newRecord.confirmedBy}
                placeholder="Nepoviné pole"
                onChange={handleChange}
                className="border w-full"
              />
            </ListItem>
            <ListItem className="-mt-10 mb-8">
              <Typography className="text-gray text-sm">Vypĺňať iba ak sa nezhoduje s osobou ktorá zapisuje</Typography>
            </ListItem>

            <ListItem className="w-full">
              <TextareaAutosize
                aria-label="minimum height"
                minRows={15}
                name="note"
                placeholder="Miesto pre vašu poznámku"
                value={newRecord.note}
                onChange={handleChange}
                className="border w-full p-12"
              />
            </ListItem>
            <ListItem>
              <HandleSignature imageURL={newRecord.signatureImgURL} setImageURL={setNewRecord} />
            </ListItem>
            <ListItem className="flex justify-end gap-12 sticky bottom-0 z-50 bg-white">
              <Button
                className="whitespace-nowrap"
                variant="contained"
                color="primary"
                disabled={!newRecord.date || !newRecord.note}
                onClick={() => setShowRecordConfirmModal(true)}
              >
                Uložiť
              </Button>
              <Button
                className="whitespace-nowrap"
                variant="contained"
                color="secondary"
                onClick={() => {
                  setShowNewNoteModal(false);
                }}
              >
                Zrušiť
              </Button>
            </ListItem>
          </List>
        </div>
      </Drawer>
      <ConfirmModal
        open={showRecordConfirmModal}
        onClose={() => setShowRecordConfirmModal(false)}
        onConfirm={addNewRecord}
        title="Želáte si pridať nový záznam?"
        message={`Dátum: ${formatDateToSK(newRecord.date)}<br/> Poznámka: ${newRecord.note} <br/> Pridal: ${
          newRecord.confirmedBy
        }`}
        confirmText="Pridať"
        cancelText="Zrušiť"
      />
    </Paper>
  );
};
