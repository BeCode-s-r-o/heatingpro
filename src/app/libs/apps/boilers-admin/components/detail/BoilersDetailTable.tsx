import FuseSvgIcon from '@app/core/SvgIcon';
import { Avatar, Button, Tooltip } from '@mui/material';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/system';
import { DataGrid, GridRowId } from '@mui/x-data-grid';
import { AppDispatch, RootState } from 'app/store/index';
import { showMessage } from 'app/store/slices/messageSlice';
import { selectUser } from 'app/store/userSlice';
import axios from 'axios';
import { collection, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { TBoiler } from 'src/@app/types/TBoilers';
import { db } from 'src/firebase-config';
import { getBoiler, selectBoilerById } from '../../store/boilersSlice';
import { compareDates, getCurrentDate } from './functions/datesOperations';
import ConfirmModal from './modals/ConfirmModal';
import NewBoilerSettingsModal from './modals/NewBoilerSettingsModal';
import TableSettingsModal from './modals/TableSettingsModal';

export const BoilersDetailTable = ({ id, componentRef, printTable }) => {
  const dispatch = useDispatch<AppDispatch>();
  const boiler = useSelector<RootState, TBoiler | undefined>((state) => selectBoilerById(state, id || ''));
  const user = useSelector(selectUser);
  const [filterDate, setFilterDate] = useState<Date>();
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

  const wasCreatedDailyNote = (notes, date) => {
    return notes.some((note) => note.date === date);
  };

  const filterRowsByDate = (date) => {
    setFilterDate(date);

    !date ? setRows(defaultRows) : setRows(defaultRows.filter((sms) => compareDates(date, sms.lastUpdate)));
  };
  const handleCleanCalendar = () => {
    setRows(defaultRows);
    setFilterDate(undefined);
  };
  const nubmerIsInInterval = (min, max, number) => {
    return number >= min && number <= max;
  };

  const generateColumns = (data: TBoiler['columns']) => {
    const sortedData = data.sort((i) => i.order);

    const lastUpdate = {
      field: 'lastUpdate',
      sortable: false,
      flex: 1,
      minWidth: 170,
      headerName: 'Dátum',
      renderCell: (params) => {
        const isCreatedDailyNotes = wasCreatedDailyNote(boiler?.notes, params.value.slice(0, 10));
        return (
          <Tooltip
            title={isCreatedDailyNotes ? 'V daný deň bol vykonaný zápis' : 'V daný deň nebol vykonaný zápis'}
            placement="top"
          >
            <div className="flex gap-8">
              <div className={`rounded-full w-10 h-10 ${isCreatedDailyNotes ? 'bg-green' : 'bg-red'} `}></div>
              <p>{params.value}</p>
            </div>
          </Tooltip>
        );
      },
    };

    const generatedColumns = sortedData.map((item) => {
      return {
        field: item.accessor,
        headerName: `${item.columnName} (${item.unit})`,
        hide: item.hide,
        flex: 1,
        sortable: false,
        minWidth: 90,
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
    return data?.map((i) => {
      const inputData = i.body?.inputData || [];
      const digitalInput = i.body?.digitalInput || [];
      const mergedData = [...inputData, ...digitalInput];
      const reduce = mergedData.reduce(
        (acc, curr, idx) => ({
          lastUpdate: new Date(i.body?.timestamp.unix || '').toLocaleString(),
          id: i.messageID,
          ...acc,
          [String(idx)]: curr ?? '-',
        }),
        {}
      );

      return reduce;
    });
  };

  const sortedSMS = useMemo(
    () => [...(boiler?.sms || [])].sort((a, b) => b.timestamp.unix - a.timestamp.unix),
    [boiler]
  );

  const getPDF = async () => {
    let data = {
      boilerID: boiler?.id,
      user: user,
      date: getCurrentDate(),
      dateForFilter: filterDate ? filterDate : 'all',
    };

    dispatch(showMessage({ message: 'PDF sa generuje...' }));
    try {
      const response = await axios.post('https://api.monitoringpro.sk/pdf-dennik', data, {
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

  const columns = useMemo(() => generateColumns([...(boiler?.columns || [])]), [boiler]);
  const defaultRows: any = useMemo(() => generateRows(sortedSMS), [sortedSMS]);

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
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          disableColumnMenu
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
      <div className="flex gap-16 mt-20 flex-wrap dont-print">
        {rolesEnableDelete.includes(user.role) && (
          <Button
            className="whitespace-nowrap w-full sm:w-fit mb-2 dont-print"
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
            className="whitespace-nowrap w-full sm:w-fit mb-2  dont-print"
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
            className="whitespace-nowrap w-full sm:w-fit dont-print"
            variant="contained"
            color="primary"
            startIcon={
              <FuseSvgIcon className="text-48 text-white" size={24} color="action">
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
              className="whitespace-nowrap w-full sm:w-fit mb-2 dont-print"
              variant="contained"
              color="primary"
              onClick={getPDF}
            >
              <FuseSvgIcon className="text-48 mr-6 text-white" size={24}>
                material-outline:picture_as_pdf
              </FuseSvgIcon>{' '}
              Export
            </Button>
            {/*             <Button
              className="whitespace-nowrap w-fit mb-2 dont-print"
              variant="contained"
              color="primary"
              onClick={printTable}
            >
              <FuseSvgIcon className="text-48 text-white mr-6" size={24} color="action">
                material-outline:local_printshop
              </FuseSvgIcon>
              Tlač
            </Button> */}
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
                columnsValues={[...(sortedSMS[0]?.body?.inputData || []), ...(sortedSMS[0]?.body?.digitalInput || [])]}
              />
            )}
          </>
        )}
      </div>

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
