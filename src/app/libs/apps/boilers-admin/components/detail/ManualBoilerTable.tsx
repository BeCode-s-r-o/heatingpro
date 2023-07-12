import FuseSvgIcon from '@app/core/SvgIcon';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Stack } from '@mui/system';
import { DataGrid, GridRowId } from '@mui/x-data-grid';
import { AppDispatch, RootState } from 'app/store/index';
import { showMessage } from 'app/store/slices/messageSlice';
import { selectUser } from 'app/store/userSlice';
import axios from 'axios';
import { collection, doc, getDocs, getFirestore, updateDoc } from 'firebase/firestore';
import moment from 'moment';
import React, { useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { TBoiler } from 'src/@app/types/TBoilers';
import { db } from 'src/firebase-config';
import { getBoiler, selectBoilerById } from '../../store/boilersSlice';
import { compareDatesYears, getCurrentDate } from './functions/datesOperations';
import AddColumnModal from './modals/AddColumnModal';
import AddRowModal from './modals/AddRowModal';
import ConfirmModal from './modals/ConfirmModal';

export const ManualBoilerTable = ({ id, componentRef }) => {
  const dispatch = useDispatch<AppDispatch>();
  const boiler = useSelector<RootState, TBoiler | undefined>((state) => selectBoilerById(state, id || ''));
  const user = useSelector(selectUser);

  const defaultRows = boiler?.monthTable.rows || [];
  const rolesEnabledEdit = ['admin'];
  const rolesEnabledAddColumn = ['admin', 'instalater'];
  const rolesEnabledAddRecord = ['admin', 'staff'];
  const rolesEnabledExportAndPrint = ['admin', 'instalater', 'user'];
  const [columns, setColumns] = React.useState(boiler?.monthTable.columns || []);
  const [filterDate, setFilterDate] = React.useState<Date>();
  const [isEditRows, setIsEditRows] = React.useState(false);
  const [selectedRowsIds, setSelectedRowsIds] = React.useState<GridRowId[]>([]);
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const [showAddColumn, setShowAddColumn] = React.useState(false);
  const [showAddRow, setShowAddRow] = React.useState(false);
  const [showEditRow, setShowEditRow] = React.useState(false);
  const [rowForEdit, setRowForEdit] = React.useState({ id: '' });
  const [rows, setRows] = React.useState<any[]>([]);

  const [effectivityConstant, setEffectivityConstant] = React.useState({});

  useEffect(() => {
    const getEffectivityConstant = async () => {
      const docSnap = await getDocs(collection(getFirestore(), 'effectivityConstant'));

      let data = {};
      docSnap.forEach((document) => {
        data = {
          ...data,
          [document.id]: document.data(),
        };
      });

      setEffectivityConstant(data);
    };

    getEffectivityConstant();
  }, []);

  useEffect(() => {
    setColumns(boiler?.monthTable.columns || []);
  }, [boiler]);

  useEffect(() => {
    const rowsSortedAsc = [...defaultRows].sort((a, b) => a.id - b.id);

    const rowsWithEfficiency = rowsSortedAsc.map((row, index) => {
      const prevRow = rowsSortedAsc[index - 1];

      if (prevRow && effectivityConstant) {
        let sumOfRozdielVOs = 0;
        for (let i = 1; i <= 8; i++) {
          const voKey = 'VO' + i;
          if (
            row.hasOwnProperty(voKey) &&
            prevRow.hasOwnProperty(voKey) &&
            row[voKey] !== '-' &&
            prevRow[voKey] !== '-'
          ) {
            const rozdielVO = row[voKey] - prevRow[voKey];
            sumOfRozdielVOs += rozdielVO;
          }
        }

        const rozdielPlynomer = row['Plyn'] - prevRow['Plyn'];

        const date = moment(row.date, 'D.M.YYYY');
        const year = date.year();
        const month = date.month();

        const monthEffectivityConstant = effectivityConstant[year]?.[month] ?? 0;

        const ucinnost = Number(sumOfRozdielVOs / (rozdielPlynomer * Number(monthEffectivityConstant))).toFixed(4);

        return { ...row, ucinnost };
      }
      return { ...row, ucinnost: '-' };
    });

    setRows(rowsWithEfficiency.sort((a, b) => a.id - b.id));
  }, [boiler, effectivityConstant]);

  const handleClickOpen = () => {
    setShowConfirmModal(true);
  };

  const deleteSelectedRows = () => {
    const boilerRef = doc(db, 'boilers', id);
    const filteredRows = rows.filter((row) => !selectedRowsIds.includes(row.id));
    try {
      updateDoc(boilerRef, { monthTable: { columns: columns, rows: filteredRows } });
    } catch (error) {
      dispatch(showMessage({ message: 'Ups, vyskytla sa chyba ' + error }));
      return;
    }
    dispatch(showMessage({ message: 'Záznam úspešné zmazaný' }));
    dispatch(getBoiler(id || ''));
    setShowConfirmModal(false);
  };

  const handleRowChange = (e) => {
    const { name, value } = e.target;

    setRowForEdit((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filterRowsByDate = (date) => {
    setFilterDate(date);

    !date ? setRows(defaultRows) : setRows(defaultRows.filter((row) => compareDatesYears(date, row.date)));
  };
  const handleCleanCalendar = () => {
    setRows(defaultRows);
    setFilterDate(undefined);
  };
  const getPDF = async () => {
    let data = {
      boilerID: boiler?.id,
      user: user,
      date: getCurrentDate(),
    };

    dispatch(showMessage({ message: 'PDF sa generuje...' }));
    try {
      const response = await axios.post('https://api.monitoringpro.sk/pdf-vykonnost', data, {
        responseType: 'blob',
      });
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `Výpis z Kotolne ${boiler?.id}.pdf`;
      link.click();
    } catch (error) {
      dispatch(showMessage({ message: 'Vyskytla sa chyba pri generovaní PDF' }));
    }
  };

  const saveEditedRow = (e) => {
    e.preventDefault();
    const boilerRef = doc(db, 'boilers', id);
    const updatedRows = rows.map((row) => (row.id === rowForEdit.id ? { ...rowForEdit } : row));
    try {
      updateDoc(boilerRef, { monthTable: { columns: columns, rows: updatedRows } });
    } catch (error) {
      dispatch(showMessage({ message: 'Ups, vyskytla sa chyba ' + error }));

      setShowEditRow(false);
      return;
    }
    setShowEditRow(false);
    setRows(updatedRows);
    dispatch(showMessage({ message: 'Záznam úspešné uložený' }));
    dispatch(getBoiler(id || ''));
  };

  const formatNumberWithSpaces = (num) => (num ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : '');

  const cols = [
    { field: 'date', headerName: 'Dátum', minWidth: 100, sortable: false },
    ...columns.map((column) => ({
      ...column,
      sortable: false,
      renderCell: (params) => formatNumberWithSpaces(params.value),
    })),
    {
      field: 'ucinnost',
      headerName: 'Účinnosť kotolne',
      id: 'asdasd',
      sortable: false,
      renderCell: (params) => {
        return (
          <Tooltip title={params.value} placement="top">
            <Typography>{params.value !== '-' ? `${params.value * 100}%` : '-'}</Typography>
          </Tooltip>
        );
      },
    },
    rolesEnabledEdit.includes(user.role) && {
      field: 'id',
      headerName: 'Upraviť',
      id: 'ahskjahsf',
      sortable: false,
      renderCell: (params) => {
        const onClick = (e) => {
          e.stopPropagation();

          const api = params.api;
          const thisRow = {};

          api
            .getAllColumns()
            .filter((c) => c.field !== '__check__' && !!c)
            .forEach((c) => (thisRow[c.field] = params.getValue(params.id, c.field)));
          setShowEditRow(true);
          setRowForEdit(
            //@ts-ignore
            rows.find((row) => row.id === thisRow.id)
          );
        };

        return (
          <FuseSvgIcon onClick={onClick} color="action" className="cursor-pointer dont-print">
            material-outline:edit
          </FuseSvgIcon>
        );
      },
    },
  ].map((i) => ({ ...i, flex: 1 }));

  return (
    <Paper ref={componentRef} className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden">
      <Typography className="text-lg font-medium tracking-tight leading-6 truncate mx-auto">
        Mesačné odpisy stavu spotreby {id}
      </Typography>
      <div className="relative my-16 ">
        <div className="border p-4 relative flex items-center justify-center w-fit">
          <FuseSvgIcon className="text-48 pr-4" size={24} color="action">
            material-twotone:calendar_today
          </FuseSvgIcon>
          <DatePicker
            onChange={filterRowsByDate}
            selected={filterDate}
            dateFormat="yyyy"
            showYearPicker
            placeholderText="Vyber rok"
            className="w-[10rem] cursor-pointer"
          />
          <Button onClick={handleCleanCalendar}>Vyčistiť</Button>
        </div>
      </div>
      <div style={{ height: 300, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={cols}
          pageSize={10}
          disableColumnMenu
          checkboxSelection={isEditRows}
          onSelectionModelChange={(ids) => {
            setSelectedRowsIds(ids);
          }}
          initialState={{
            sorting: {
              sortModel: [{ field: 'id', sort: 'desc' }],
            },
          }}
          localeText={{
            MuiTablePagination: {
              labelDisplayedRows: ({ from, to, count: totalCount }) => `${from}-${to} z ${totalCount}`,
            },
          }}
          rowsPerPageOptions={[12]}
          components={{
            NoRowsOverlay: () => (
              <Stack height="100%" alignItems="center" justifyContent="center">
                Žiadne dáta
              </Stack>
            ),
          }}
        />
      </div>
      <div className="flex gap-16 mt-20 flex-wrap md:flex-nowrap">
        {rolesEnabledEdit.includes(user.role) && (
          <Button
            className="whitespace-nowrap  w-full sm:w-fit mb-2 dont-print"
            variant="contained"
            color="primary"
            onClick={() => {
              setIsEditRows((prev) => !prev);
            }}
            startIcon={
              !isEditRows && (
                <FuseSvgIcon className="text-48 text-white" size={24} color="action">
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
            className="whitespace-nowrap  w-full sm:w-fit mb-2 dont-print"
            variant="contained"
            color="secondary"
            onClick={handleClickOpen}
            startIcon={
              <FuseSvgIcon className="text-48 text-white" size={24} color="action">
                heroicons-outline:trash
              </FuseSvgIcon>
            }
          >
            Zmazať vybrané riadky
          </Button>
        )}
        {rolesEnabledAddColumn.includes(user.role) && (
          <Button
            className="whitespace-nowrap  w-full sm:w-fit mb-2 dont-print"
            variant="contained"
            color="primary"
            onClick={() => setShowAddColumn(true)}
            startIcon={<FuseSvgIcon size={20}>heroicons-solid:cog</FuseSvgIcon>}
          >
            Nastaviť stĺpce
          </Button>
        )}
        <AddColumnModal
          isOpen={showAddColumn}
          close={() => setShowAddColumn(false)}
          columns={columns}
          rows={rows}
          deviceID={id}
          setColumns={setColumns}
        />
        {rolesEnabledAddRecord.includes(user.role) && (
          <Button
            className="whitespace-nowrap w-full sm:w-fit mb-2 dont-print"
            variant="contained"
            color="primary"
            onClick={() => setShowAddRow(true)}
            startIcon={
              <FuseSvgIcon className="text-48 text-white" size={24} color="action">
                heroicons-outline:plus-sm
              </FuseSvgIcon>
            }
          >
            Pridať záznam
          </Button>
        )}
        <AddRowModal
          isOpen={showAddRow}
          close={() => setShowAddRow(false)}
          columns={columns}
          existingRows={rows}
          deviceID={id}
        />
        {rolesEnabledExportAndPrint.includes(user.role) && (
          <>
            <Button
              className="whitespace-nowrap  w-full sm:w-fit mb-2 dont-print"
              variant="contained"
              color="primary"
              onClick={getPDF} //TODO call api to create pdf
              startIcon={
                <FuseSvgIcon className="text-48 text-white " size={24} color="action">
                  material-outline:picture_as_pdf
                </FuseSvgIcon>
              }
            >
              Export
            </Button>
          </>
        )}
      </div>
      <Dialog
        onClose={() => {
          setShowEditRow(false);
        }}
        open={showEditRow}
      >
        <DialogTitle>Upraviť záznam</DialogTitle>
        <form onSubmit={saveEditedRow}>
          <DialogContent>
            {Object.keys(rowForEdit).reduce<any>((acc, key) => {
              if (key !== 'ucinnost' && key !== 'date' && key !== 'id') {
                return [
                  ...acc,
                  <TextField
                    key={key}
                    label={key}
                    name={key}
                    value={rowForEdit[key]}
                    onChange={handleRowChange}
                    fullWidth
                    margin="normal"
                    InputProps={{
                      endAdornment: <Typography>{columns.find((item) => item.headerName === key)?.unit}</Typography>,
                    }}
                  />,
                ];
              }
              return acc;
            }, [])}
          </DialogContent>
          <DialogActions>
            <Button className="whitespace-nowrap w-fit mb-2 mr-8" variant="contained" color="primary" type="submit">
              Uložiť zmeny
            </Button>
            <Button
              className="whitespace-nowrap w-fit mb-2 mr-4"
              variant="contained"
              color="secondary"
              onClick={() => {
                setShowEditRow(false);
              }}
            >
              Zatvoriť
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      {/* confirm dialog */}
      <ConfirmModal
        open={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={deleteSelectedRows}
        title="Želáte si zmazať dané záznamy?"
        message="Táto akcia je nezvratná"
        confirmText="Zmazať"
        cancelText="Zrušiť"
      />
    </Paper>
  );
};
