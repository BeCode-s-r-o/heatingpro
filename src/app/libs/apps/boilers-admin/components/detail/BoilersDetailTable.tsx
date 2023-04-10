import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/system';
import { DataGrid, GridRowId } from '@mui/x-data-grid';
import { AppDispatch, RootState } from 'app/store/index';
import { selectUser } from 'app/store/userSlice';
import { collection, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import moment from 'moment';
import React, { useState } from 'react';
import FuseSvgIcon from '@app/core/SvgIcon';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TBoiler, TSms } from 'src/@app/types/TBoilers';
import { db } from 'src/firebase-config';
import { getBoiler, selectBoilerById } from '../../store/boilersSlice';
import NewBoilerSettingsModal from './modals/NewBoilerSettingsModal';
import TableSettingsModal from './modals/TableSettingsModal';
import ConfirmModal from './modals/ConfirmModal';

export const BoilersDetailTable = ({ id, componentRef, generatePDF, printTable }) => {
  const dispatch = useDispatch<AppDispatch>();
  const boiler = useSelector<RootState, TBoiler | undefined>((state) => selectBoilerById(state, id || ''));
  const [isEditRows, setIsEditRows] = React.useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedRowsIds, setSelectedRowsIds] = React.useState<GridRowId[]>([]);
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const [rows, setRows] = React.useState<any[]>([]);
  const user = useSelector(selectUser);

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
    const lastUpdate = { field: 'lastUpdate', sortable: false, flex: 1, minWidth: 110, headerName: 'Dátum' };
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
      <Typography className="text-lg font-medium tracking-tight leading-6 truncate mx-auto">
        Prevádzkový denník {id}
      </Typography>
      <div className="relative">
        <div className="w-fit border p-10">
          <label htmlFor="start">Vyberte mesiac: </label>
          <input type="month" id="start" name="start" min="2023-01" onChange={filterRowsByDate} />
        </div>
        <div className="flex mx-4 absolute right-0 top-0 show-on-print">
          <Avatar src={user?.data?.avatar || undefined}>{user?.data?.name[0]}</Avatar>
          <Typography component="span" className="font-semibold my-auto mx-8 md:mx-16  ">
            {user?.data?.name}
          </Typography>
        </div>
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
      <div className="flex gap-16 dont-print">
        <Button
          className="whitespace-nowrap w-fit mb-2 dont-print"
          variant="contained"
          color="primary"
          onClick={() => {
            setIsEditRows((prev) => !prev);
          }}
        >
          {!isEditRows && (
            <FuseSvgIcon className="text-48 text-white mr-6" size={24} color="action">
              material-outline:edit
            </FuseSvgIcon>
          )}
          {!isEditRows ? 'Upraviť záznamy' : 'Skryť'}
        </Button>
        {isEditRows && (
          <Button
            disabled={selectedRowsIds.length < 1}
            className="whitespace-nowrap w-fit mb-2 dont-print"
            variant="contained"
            color="secondary"
            onClick={() => setShowConfirmModal(true)}
            startIcon={
              <FuseSvgIcon className="text-48 text-white " size={24} color="action">
                material-outline:delete
              </FuseSvgIcon>
            }
          >
            Zmazať vybrané riadky
          </Button>
        )}
        <Button
          className="whitespace-nowrap"
          variant="contained"
          color="primary"
          startIcon={<FuseSvgIcon size={20}>heroicons-solid:cog</FuseSvgIcon>}
          onClick={() => {
            setIsSettingsModalOpen(true);
          }}
        >
          Nastaviť stĺpce
        </Button>
        <Button
          className="whitespace-nowrap w-fit mb-2 dont-print"
          variant="contained"
          color="primary"
          onClick={generatePDF}
        >
          <FuseSvgIcon className="text-48 text-white mr-6" size={24} color="action">
            material-outline:picture_as_pdf
          </FuseSvgIcon>{' '}
          Export
        </Button>
        <Button
          className="whitespace-nowrap w-fit mb-2 dont-print"
          variant="contained"
          color="primary"
          onClick={printTable}
        >
          <FuseSvgIcon className="text-48 text-white mr-6" size={24} color="action">
            material-outline:local_printshop
          </FuseSvgIcon>
          Tlač
        </Button>
        {boiler && (
          <>
            {boiler.columns.length === 0 ? (
              <NewBoilerSettingsModal
                boiler={boiler}
                isOpen={isSettingsModalOpen}
                toggleOpen={() => {
                  setIsSettingsModalOpen((prev) => !prev);
                }}
              />
            ) : (
              <TableSettingsModal
                boiler={boiler}
                isOpen={isSettingsModalOpen}
                toggleOpen={() => {
                  setIsSettingsModalOpen((prev) => !prev);
                }}
              />
            )}
          </>
        )}
      </div>

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
