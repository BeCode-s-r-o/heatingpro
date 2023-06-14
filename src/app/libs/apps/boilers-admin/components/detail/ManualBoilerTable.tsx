import FuseSvgIcon from '@app/core/SvgIcon';
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { Stack } from '@mui/system';
import { DataGrid, GridRowId } from '@mui/x-data-grid';
import { AppDispatch, RootState } from 'app/store/index';
import { showMessage } from 'app/store/slices/messageSlice';
import { selectUser } from 'app/store/userSlice';
import { doc, updateDoc } from 'firebase/firestore';
import moment from 'moment';
import React, { useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { TBoiler } from 'src/@app/types/TBoilers';
import { db } from 'src/firebase-config';
import { getBoiler, selectBoilerById } from '../../store/boilersSlice';
import { compareDatesYears } from './functions/datesOperations';
import AddColumnModal from './modals/AddColumnModal';
import AddRowModal from './modals/AddRowModal';
import ConfirmModal from './modals/ConfirmModal';

export const ManualBoilerTable = ({ id, printTable, componentRef }) => {
  const dispatch = useDispatch<AppDispatch>();
  const boiler = useSelector<RootState, TBoiler | undefined>((state) => selectBoilerById(state, id || ''));
  const user = useSelector(selectUser);

  const columns = boiler?.monthTable.columns || [];
  const defaultRows = boiler?.monthTable.rows || [];
  const rolesEnabledEdit = ['admin'];
  const rolesEnabledAddColumn = ['admin', 'instalater'];
  const rolesEnabledAddRecord = ['admin', 'staff'];
  const rolesEnabledExportAndPrint = ['admin', 'instalater', 'user'];

  const [filterDate, setFilterDate] = React.useState<Date>();
  const [isEditRows, setIsEditRows] = React.useState(false);
  const [selectedRowsIds, setSelectedRowsIds] = React.useState<GridRowId[]>([]);
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const [showAddColumn, setShowAddColumn] = React.useState(false);
  const [showAddRow, setShowAddRow] = React.useState(false);
  const [showEditRow, setShowEditRow] = React.useState(false);
  const [rowForEdit, setRowForEdit] = React.useState({ id: '' });
  const [rows, setRows] = React.useState<any[]>([]);

  //todo
  const constantUpdateDate = moment().endOf('month').subtract(1, 'weeks');

  useEffect(() => {
    const rowsWithEfficiency = defaultRows.map((row, index) => {
      const prevRow = defaultRows[index - 1];
      const effectivityConstant = row.effectivityConstant;

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

        const ucinnost = sumOfRozdielVOs / (rozdielPlynomer * Number(effectivityConstant));

        return { ...row, ucinnost };
      }
      return { ...row, ucinnost: 'Nedá sa vypočítať' };
    });

    setRows(rowsWithEfficiency);
  }, [boiler]);

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
  const saveEditedRow = (e) => {
    e.preventDefault();
    const boilerRef = doc(db, 'boilers', id);
    const updatedRows = rows.map((row) => (row.id === rowForEdit.id ? rowForEdit : row));

    try {
      updateDoc(boilerRef, { monthTable: { columns: columns, rows: updatedRows } });
    } catch (error) {
      dispatch(showMessage({ message: 'Ups, vyskytla sa chyba ' + error }));

      setShowEditRow(false);
      return;
    }
    setShowEditRow(false);
    dispatch(showMessage({ message: 'Záznam úspešné uložený' }));
    dispatch(getBoiler(id || ''));
  };

  const cols = [
    { field: 'date', headerName: 'Dátum' },
    ...columns,
    {
      field: 'ucinnost',
      headerName: 'Účinnosť kotolne',
      id: 'asdasd',
    },
    rolesEnabledEdit.includes(user.role) && {
      field: 'id',
      headerName: 'Upraviť',
      id: 'ahskjahsf',
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
          setRowForEdit(thisRow);
          setShowEditRow(true);
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
      <div className="relative">
        <div className="border p-4 relative flex items-center justify-center w-fit">
          <FuseSvgIcon className="text-48 pr-4" size={24} color="action">
            material-twotone:calendar_today
          </FuseSvgIcon>
          <DatePicker
            onChange={filterRowsByDate}
            selected={filterDate}
            dateFormat="yyyy"
            showYearPicker
            placeholderText="Vyber mesiac"
            className="w-[10rem] cursor-pointer"
          />
          <Button onClick={handleCleanCalendar}>Vyčistiť</Button>
        </div>
        <div className="flex mx-4 absolute right-0 top-0 show-on-print">
          <Avatar variant="rounded" src={user?.data?.avatar || undefined}>
            {user?.data?.name[0]}
          </Avatar>
          <Typography component="span" className="font-semibold my-auto mx-8 md:mx-16  ">
            {user?.data?.name}
          </Typography>
        </div>
      </div>
      <div style={{ height: 300, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={cols}
          pageSize={10}
          checkboxSelection={isEditRows}
          onSelectionModelChange={(ids) => {
            setSelectedRowsIds(ids);
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
      <div className="flex gap-16">
        {rolesEnabledEdit.includes(user.role) && (
          <Button
            className="whitespace-nowrap w-fit mb-2 dont-print"
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
            className="whitespace-nowrap w-fit mb-2 dont-print"
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
            className="whitespace-nowrap w-fit mb-2 dont-print"
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
        />
        {rolesEnabledAddRecord.includes(user.role) && (
          <Button
            className="whitespace-nowrap w-fit mb-2 dont-print"
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
              className="whitespace-nowrap w-fit mb-2 dont-print"
              variant="contained"
              color="primary"
              onClick={() => {}} //TODO call api to create pdf
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
              if (key !== 'ucinnost' && key !== 'date' && key !== 'id' && key !== 'effectivityConstant') {
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
            <TextField
              key={'effectivityConstant'}
              label={'Konštanta účinnosti'}
              name={'effectivityConstant'}
              value={rowForEdit['effectivityConstant']}
              onChange={handleRowChange}
              fullWidth
              margin="normal"
            />
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
        title="Želáte si zmazať danné záznamy?"
        message="Táto akcia je nezvratná"
        confirmText="Zmazať"
        cancelText="Zrušiť"
      />
    </Paper>
  );
};
