import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/system';
import { DataGrid, GridRowId } from '@mui/x-data-grid';
import { AppDispatch, RootState } from 'app/store/index';
import { collection, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import React from 'react';
import { useEffect } from 'react';
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

  const handleClickOpen = () => {
    setShowConfirmModal(true);
  };

  useEffect(() => {
    dispatch(getBoiler(id || ''));
  }, [id, dispatch]);

  const generateColumns = (data: TBoiler['columns']) => {
    const sortedData = data.sort((i) => i.order);
    const lastUpdate = { field: 'lastUpdate', sortable: false, flex: 1, headerName: 'Dátum' };
    const generatedColumns = sortedData.map((item) => {
      return {
        field: item.accessor,
        headerName: `${item.columnName} (${item.unit})`,
        hide: item.hide,
        flex: 1,
      };
    });
    return [lastUpdate, ...generatedColumns];
  };

  const deleteSelectedRows = () => {
    var deleteQuery = query(collection(db, 'sms'), where('messageID', 'in', selectedRowsIds));
    getDocs(deleteQuery).then((querySnapshot) => {
      querySnapshot.forEach((doc) => deleteDoc(doc.ref));
    });
    setShowConfirmModal(false);
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
          color="primary"
          onClick={() => setShowAddColumn(true)}
        >
          Pridať stĺpec
        </Button>
        <AddColumnModal isOpen={showAddColumn} close={() => setShowAddColumn(false)} columns={columns} deviceID={id} />
        <Button
          className="whitespace-nowrap w-fit mb-2"
          variant="contained"
          color="primary"
          onClick={() => setShowAddRow(true)}
        >
          Pridať záznam
        </Button>
        <AddRowModal
          isOpen={showAddRow}
          close={() => setShowAddRow(false)}
          columns={columns}
          rows={rows}
          deviceID={id}
        />
      </div>
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
