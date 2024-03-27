import FuseSvgIcon from '@app/core/SvgIcon';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { GridRowId } from '@mui/x-data-grid';
import { DataTable } from 'app/shared/DataTable';
import { AppDispatch, RootState } from 'app/store/index';
import { showMessage } from 'app/store/slices/messageSlice';
import { selectUser } from 'app/store/userSlice';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import moment from 'moment';
import React, { useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { TBoiler } from 'src/@app/types/TBoilers';
import { useFetchPaginated } from 'src/app/hooks/useFetchPaginated';
import { getPDFVykonnost } from 'src/app/utils/pdfUtils';
import { db } from 'src/firebase-config';
import { selectBoilerById } from '../../store/boilersSlice';
import AddColumnModal from '../detail/modals/AddColumnModal';
import AddRowModal from '../detail/modals/AddRowModal';
import ConfirmModal from '../detail/modals/ConfirmModal';

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
  const [filterDate, setFilterDate] = useState<any>(new Date(moment().startOf('month').valueOf()));
  const [isEditRows, setIsEditRows] = React.useState(false);
  const [selectedRowsIds, setSelectedRowsIds] = React.useState<GridRowId[]>([]);
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const [showAddColumn, setShowAddColumn] = React.useState(false);
  const [showAddRow, setShowAddRow] = React.useState(false);
  const [showEditRow, setShowEditRow] = React.useState(false);
  const [rowForEdit, setRowForEdit] = React.useState<any>({ id: '' });

  const [page, setPage] = useState(0);

  const options = useMemo(() => ({ id, page: page + 1, date: filterDate }), [id, page, filterDate]);
  const { data, rowCount, hasMorePages, isLoading, refetch } = useFetchPaginated('third-table-data', options, {
    rows: [],
    columns: [],
  });

  const handleClickOpen = () => {
    setShowConfirmModal(true);
  };

  const deleteSelectedRows = async () => {
    try {
      const promises = selectedRowsIds.map(async (selectedId) => {
        const ref = doc(db, 'monthTableValues', selectedId as string);
        await deleteDoc(ref);
      });
      await Promise.all(promises);
      refetch();
    } catch (error) {
      dispatch(showMessage({ message: 'Ups, vyskytla sa chyba ' + error }));
      return;
    }
    dispatch(showMessage({ message: 'Záznamy úspešné zmazané' }));
    setShowConfirmModal(false);
  };

  const getEffectivityColor = (params) => {
    const { value } = params;
    if (!value) {
      return '';
    }

    const effNumber = Number(value.replace('%', ''));
    if (!effNumber) {
      return '';
    }
    if (effNumber > 80) {
      return 'ucinnost-green';
    }
    if (effNumber > 70) {
      return 'ucinnost-yellow';
    }

    return 'ucinnost-red';
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
    setPage(0);
  };
  const handleCleanCalendar = () => {
    setFilterDate(undefined);
    setPage(0);
  };

  const saveEditedRow = async (e) => {
    e.preventDefault();

    const { id, date, ucinnost, boilerId, oldId, ...edited } = rowForEdit;

    const newDate = moment(date, 'DD.MM.YYYY').valueOf();

    let values = {};
    Object.entries(edited).forEach((element: any) => {
      values[element[0]] = typeof element[1] === 'string' ? Number(element[1].replaceAll(',', '.')) : element[1];
    });

    const objectToSave = {
      ...values,
      date: newDate,
    };

    try {
      const ref = doc(db, 'monthTableValues', id);
      await updateDoc(ref, objectToSave);
      dispatch(showMessage({ message: 'Záznam úspešné uložený' }));
    } catch (error) {
      dispatch(showMessage({ message: 'Ups, vyskytla sa chyba ' + error }));
      setShowEditRow(false);
      return;
    } finally {
      setShowEditRow(false);
    }
  };

  const columnsWithEditIcon = useMemo(
    () => [
      ...data.columns.filter((i) => i.field !== 'ucinnost'),
      {
        ...data.columns.find((i) => i.field === 'ucinnost'),
        cellClassName: getEffectivityColor,
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
              data.rows.find((row) => row.id === thisRow.id)
            );
          };

          return (
            <FuseSvgIcon onClick={onClick} color="action" className="cursor-pointer dont-print">
              material-outline:edit
            </FuseSvgIcon>
          );
        },
      },
    ],
    [data.columns]
  );

  return (
    <Paper
      style={{ background: 'url(/assets/images/backgrounds/white.jpg)', backgroundSize: 'cover' }}
      ref={componentRef}
      className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden"
    >
      <Typography className="text-lg font-medium tracking-tight leading-6 truncate mx-auto">
        Mesačné odpisy stavu spotreby {id}
      </Typography>
      <div className="relative my-16 flex flex-wrap">
        <div className="w-full lg:w-[50%]">
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
      </div>
      <Box className="w-full lg:w-[50%] max-h-25vh overflow-scroll">
        {columns.length ? (
          <Typography className="text-xl pt-7 font-light tracking-tight leading-6 truncate ">
            <strong>Vysvetlivky k stĺpcom:</strong>
          </Typography>
        ) : null}
        <Box className="grid grid-cols-1 sm:grid-cols-2">
          {columns?.length > 0 &&
            columns.map((column, i) => (
              <Typography key={i} className="text-sm pt-7 font-light tracking-tight leading-6 truncate">
                <strong className="font-semibold">
                  {column.headerName} {column.unit ? `(${column.unit})` : null}
                </strong>{' '}
                - {column.desc}
              </Typography>
            ))}
        </Box>
      </Box>
      <div style={{ height: 400, width: '100%' }}>
        <DataTable
          rows={data.rows}
          columns={columnsWithEditIcon}
          rowCount={rowCount}
          isEditRows={isEditRows}
          onSelectionModelChange={(ids) => {
            setSelectedRowsIds(ids);
          }}
          page={page}
          onPageChange={(newPage) => {
            if (hasMorePages || newPage < page) {
              setPage(newPage);
            }
          }}
          isLoading={isLoading}
          getRowId={(row) => (row as any).id || (row as any).id}
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
          rows={data.rows}
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
          refetch={refetch}
          isOpen={showAddRow}
          close={() => setShowAddRow(false)}
          columns={data.columns}
          existingRows={data.rows}
          deviceID={id}
        />
        {rolesEnabledExportAndPrint.includes(user.role) && (
          <>
            <Button
              className="whitespace-nowrap  w-full sm:w-fit mb-2 dont-print"
              variant="contained"
              color="primary"
              onClick={() => getPDFVykonnost(boiler, user, filterDate, dispatch)}
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
              const textFieldElement = (
                <TextField
                  key={key}
                  label={key === 'date' ? 'Dátum' : key}
                  name={key}
                  value={rowForEdit[key]}
                  onChange={handleRowChange}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    endAdornment: <Typography>{columns.find((item) => item.headerName === key)?.unit}</Typography>,
                  }}
                />
              );

              if (key === 'date') {
                return [textFieldElement, ...acc];
              } else if (!['ucinnost', 'id', 'oldId', 'boilerId'].includes(key)) {
                return [...acc, textFieldElement];
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
