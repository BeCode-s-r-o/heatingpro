import FuseSvgIcon from '@app/core/SvgIcon';
import { Avatar, Button, Tooltip } from '@mui/material';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/system';
import { DataGrid, GridRowId } from '@mui/x-data-grid';
import { AppDispatch, RootState } from 'app/store/index';
import { selectUser } from 'app/store/userSlice';
import { collection, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TBoiler } from 'src/@app/types/TBoilers';
import { db } from 'src/firebase-config';
import { getBoiler, selectBoilerById } from '../../store/boilersSlice';
import { compareDates } from './functions/datesOperations';
import ConfirmModal from './modals/ConfirmModal';
import NewBoilerSettingsModal from './modals/NewBoilerSettingsModal';
import TableSettingsModal from './modals/TableSettingsModal';

export const BoilersDetailTable = ({ id, componentRef, generatePDF, printTable }) => {
  const dispatch = useDispatch<AppDispatch>();
  const boiler = useSelector<RootState, TBoiler | undefined>((state) => selectBoilerById(state, id || ''));
  const user = useSelector(selectUser);

  const [isEditRows, setIsEditRows] = React.useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedRowsIds, setSelectedRowsIds] = React.useState<GridRowId[]>([]);
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const [rows, setRows] = React.useState([]);

  const rolesEnableDelete = ['admin', 'instalater'];
  const rolesEnableEditColumns = ['admin', 'instalater'];
  const rolesEnabledExportAndPrint = ['admin', 'user', 'instalater', 'obsluha'];

  useEffect(() => {
    dispatch(getBoiler(id || ''));
  }, [id, dispatch]);

  useEffect(() => {
    setRows(defaultRows);
  }, [boiler]);

  const filterRowsByDate = (e) => {
    let { value } = e.target;
    let showAllRecords = !value;
    showAllRecords ? setRows(defaultRows) : setRows(defaultRows.filter((sms) => compareDates(sms.lastUpdate, value)));
  };
  const nubmerIsInInterval = (min, max, number) => {
    return number >= min && number <= max;
  };
  const generateColumns = (data: TBoiler['columns']) => {
    const sortedData = data.sort((i) => i.order);
    const lastUpdate = { field: 'lastUpdate', sortable: false, flex: 1, minWidth: 160, headerName: 'Dátum' };
    const generatedColumns = sortedData.map((item) => {
      return {
        field: item.accessor,
        headerName: `${item.columnName} (${item.unit})`,
        hide: item.hide,
        flex: 1,
        renderCell: (params) => {
          return (
            <Tooltip title={item.desc === '' ? 'Bez popisu' : item.desc} placement="top">
              <p className={nubmerIsInInterval(item.min, item.max, params.value) ? 'text-green' : 'text-red'}>
                {params.value}
              </p>
            </Tooltip>
          );
        },
      };
    });
    return [lastUpdate, ...generatedColumns];
  };

  const generateRows = (data: TBoiler['sms']) => {
    return data
      ?.sort((a, b) => b.timestamp.unix - a.timestamp.unix)
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

  const columns = generateColumns([...(boiler?.columns || [])]);
  const defaultRows: any = generateRows([...(boiler?.sms || [])]);

  const deleteSelectedRows = () => {
    var deleteQuery = query(collection(db, 'sms'), where('messageID', 'in', selectedRowsIds));
    getDocs(deleteQuery).then((querySnapshot) => {
      querySnapshot.forEach((doc) => deleteDoc(doc.ref));
    });
    setShowConfirmModal(false);
  };

  return (
    <Paper ref={componentRef} className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden">
      <Typography className="text-lg font-medium tracking-tight leading-6 truncate mx-auto">
        Prevádzkový denník {id}
      </Typography>
      {user.role !== 'staff' && (
        <div className="relative">
          <div className="w-fit border p-10">
            <label htmlFor="start">Vyberte mesiac: </label>
            <input type="month" id="start" name="start" min="2023-01" onChange={filterRowsByDate} />
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
      )}
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={15}
          checkboxSelection={isEditRows}
          onSelectionModelChange={(ids) => {
            setSelectedRowsIds(ids);
          }}
          rowsPerPageOptions={[15]}
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
        {rolesEnableDelete.includes(user.role) && (
          <Button
            className="whitespace-nowrap w-fit mb-2 dont-print"
            variant="contained"
            color="primary"
            onClick={() => {
              setIsEditRows((prev) => !prev);
            }}
          >
            {!isEditRows ? (
              <FuseSvgIcon className="text-48 text-white mr-6" size={24} color="action">
                material-outline:edit
              </FuseSvgIcon>
            ) : null}
            {isEditRows ? 'Skryť' : 'Upraviť záznamy'}
          </Button>
        )}

        {isEditRows && (
          <Button
            className="whitespace-nowrap w-fit mb-2 dont-print"
            variant="contained"
            color="secondary"
            onClick={() => setShowConfirmModal(true)}
            disabled={selectedRowsIds.length < 1}
            startIcon={
              <FuseSvgIcon className="text-48 text-white " size={24} color="action">
                material-outline:delete
              </FuseSvgIcon>
            }
          >
            Zmazať vybrané riadky
          </Button>
        )}
        {rolesEnableEditColumns.includes(user.role) && (
          <Button
            className="whitespace-nowrap dont-print"
            variant="contained"
            color="primary"
            startIcon={
              <FuseSvgIcon className="text-48 text-white" size={24}>
                heroicons-solid:cog
              </FuseSvgIcon>
            }
            onClick={() => {
              setIsSettingsModalOpen(true);
            }}
          >
            Nastaviť stĺpce
          </Button>
        )}

        {rolesEnabledExportAndPrint.includes(user.role) && (
          <>
            <Button
              className="whitespace-nowrap w-fit mb-2 dont-print"
              variant="contained"
              color="primary"
              onClick={generatePDF}
            >
              <FuseSvgIcon className="text-48 mr-6 text-white" size={24}>
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
          </>
        )}
        {boiler && (
          <>
            {boiler.columns.length === 0 ? ( //initializing new boiler
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
