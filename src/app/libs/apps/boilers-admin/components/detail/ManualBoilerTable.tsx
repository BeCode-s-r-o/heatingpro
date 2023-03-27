import FuseSvgIcon from '@app/core/SvgIcon';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/system';
import { DataGrid, GridRowId } from '@mui/x-data-grid';
import { AppDispatch, RootState } from 'app/store/index';
import { showMessage } from 'app/store/slices/messageSlice';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TBoiler } from 'src/@app/types/TBoilers';
import { db } from 'src/firebase-config';
import { getBoiler, selectBoilerById } from '../../store/boilersSlice';
import AddColumnModal from './AddColumnModal';
import AddRowModal from './AddRowModal';

export const ManualBoilerTable = ({ id }) => {
  const dispatch = useDispatch<AppDispatch>();
  const boiler = useSelector<RootState, TBoiler | undefined>((state) => selectBoilerById(state, id || ''));
  const [isEditRows, setIsEditRows] = React.useState(false);
  const [selectedRowsIds, setSelectedRowsIds] = React.useState<GridRowId[]>([]);
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const [showAddColumn, setShowAddColumn] = React.useState(false);
  const [showAddRow, setShowAddRow] = React.useState(false);
  const [showEditRow, setShowEditRow] = React.useState(false);
  const [rowForEdit, setRowForEdit] = React.useState({ id: '' });

  const handleClickOpen = () => {
    setShowConfirmModal(true);
  };

  const deleteSelectedRows = () => {
    const boilerRef = doc(db, 'boilers', id);
    const filteredRows = rows.filter((row) => !selectedRowsIds.includes(row.id));
    try {
      updateDoc(boilerRef, { monthTable: { columns: columns, rows: filteredRows } });
    } catch (error) {
      dispatch(showMessage({ message: 'Ups, vyskytla sa chyba' }));
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

  const saveEditedRow = (e) => {
    e.preventDefault();
    const boilerRef = doc(db, 'boilers', id);
    const updatedRows = rows.map((row) => (row.id === rowForEdit.id ? rowForEdit : row));

    try {
      updateDoc(boilerRef, { monthTable: { columns: columns, rows: updatedRows } });
    } catch (error) {
      dispatch(showMessage({ message: 'Ups, vyskytla sa chyba' }));

      setShowEditRow(false);
      return;
    }
    setShowEditRow(false);
    dispatch(showMessage({ message: 'Záznam úspešné zmazaný' }));
    dispatch(getBoiler(id || ''));
  };
  const columns = boiler?.monthTable.columns || [];
  const rows = boiler?.monthTable.rows || [];

  return (
    <Paper className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden">
      <Typography className="text-lg font-medium tracking-tight leading-6 truncate mx-auto">
        Mesačné Dáta pre kotolňu {id}
      </Typography>

      <div style={{ height: 300, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={[
            ...columns,
            {
              field: 'id',
              headerName: 'upraviť',
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
                  <>
                    <FuseSvgIcon onClick={onClick} color="action" className="cursor-pointer">
                      heroicons-solid:cog
                    </FuseSvgIcon>
                  </>
                );
              },
            },
          ]}
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
          {!isEditRows ? 'Upraviť záznamy' : 'Skryť'}
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
          onClick={() => setShowAddColumn(true)}
        >
          Pridať stĺpec
        </Button>
        <AddColumnModal
          isOpen={showAddColumn}
          close={() => setShowAddColumn(false)}
          columns={columns}
          rows={rows}
          deviceID={id}
        />
        <Button
          className="whitespace-nowrap w-fit mb-2"
          variant="contained"
          color="secondary"
          onClick={() => setShowAddRow(true)}
        >
          Pridať záznam
        </Button>
        <AddRowModal
          isOpen={showAddRow}
          close={() => setShowAddRow(false)}
          columns={columns}
          existingRows={rows}
          deviceID={id}
        />
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
            {Object.keys(rowForEdit).map(
              (key) =>
                key != 'id' && (
                  <TextField
                    key={key}
                    label={key}
                    name={key}
                    value={rowForEdit[key]}
                    onChange={handleRowChange}
                    fullWidth
                    margin="normal"
                  />
                )
            )}
          </DialogContent>
          <DialogActions>
            <Button
              className="whitespace-nowrap w-fit mb-2 mr-4"
              variant="contained"
              color="primary"
              onClick={() => {
                setShowEditRow(false);
              }}
            >
              Zatvoriť
            </Button>
            <Button
              className="whitespace-nowrap w-fit mb-2 mr-8"
              variant="contained"
              color="secondary"
              autoFocus
              type="submit"
            >
              Zmeniť
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      {/* confirm dialog */}
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
    </Paper>
  );
};
