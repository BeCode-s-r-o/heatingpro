import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/system';
import { DataGrid, GridRowId } from '@mui/x-data-grid';
import { AppDispatch, RootState } from 'app/store/index';
import { collection, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import moment from 'moment';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TBoiler, TSms } from 'src/@app/types/TBoilers';
import { db } from 'src/firebase-config';
import { getBoiler, selectBoilerById } from '../../store/boilersSlice';

export const BoilersDetailTable = ({ id, componentRef }) => {
  const dispatch = useDispatch<AppDispatch>();
  const boiler = useSelector<RootState, TBoiler | undefined>((state) => selectBoilerById(state, id || ''));
  const [isEditRows, setIsEditRows] = React.useState(false);
  const [selectedRowsIds, setSelectedRowsIds] = React.useState<GridRowId[]>([]);
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const [rows, setRows] = React.useState<any[]>([]);

  useEffect(() => {
    dispatch(getBoiler(id || ''));
  }, [id, dispatch]);
  useEffect(() => {
    setRows(defaultRows);
  }, [boiler]);

  const compareDates = (date1, date2) => {
    const d1 = moment(date1, 'DD.MM.YYYY HH:mm:ss');
    const d2 = moment(date2, 'YYYY-MM').startOf('month');

    return d1.isSame(d2, 'month') && d1.isSame(d2, 'year');
  };

  const filterRowsByDate = (e) => {
    !e.target.value
      ? setRows(defaultRows)
      : setRows(defaultRows.filter((i) => compareDates(i.lastUpdate, e.target.value)));
  };
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

  const generateRows = (data: TBoiler['sms']) => {
    return data
      ?.sort((i) => i.timestamp.unix)
      .map(
        (i) =>
          i.body?.inputData?.reduce(
            (acc, curr, idx) => ({
              lastUpdate: i.body?.timestamp.display,
              id: i.messageID,
              ...acc,
              [String(idx)]: curr || '-',
            }),
            {}
          ) || {}
      );
  };
  const deleteSelectedRows = () => {
    var deleteQuery = query(collection(db, 'sms'), where('messageID', 'in', selectedRowsIds));
    getDocs(deleteQuery).then((querySnapshot) => {
      querySnapshot.forEach((doc) => deleteDoc(doc.ref));
    });
    setShowConfirmModal(false);
  };
  const columns = generateColumns([...(boiler?.columns || [])]);
  const defaultRows: any = generateRows([...(boiler?.sms || [])]);

  return (
    <Paper ref={componentRef} className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden">
      <Typography className="text-lg font-medium tracking-tight leading-6 truncate mx-auto">Kotolňa {id}</Typography>
      <div className="w-fit border p-8">
        <label htmlFor="start">Vyberte mesiac: </label>
        <input type="month" id="start" name="start" min="2023-01" onChange={filterRowsByDate} />
      </div>

      <div style={{ height: 400, width: '100%' }}>
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
            onClick={() => setShowConfirmModal(true)}
          >
            Zmazať vybrané riadky
          </Button>
        )}
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
