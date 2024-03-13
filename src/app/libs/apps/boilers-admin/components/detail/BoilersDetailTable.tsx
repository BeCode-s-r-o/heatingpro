import FuseSvgIcon from '@app/core/SvgIcon';
import { Button, Tooltip } from '@mui/material';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { GridRowId } from '@mui/x-data-grid';
import * as Sentry from '@sentry/react';
import axiosInstance from 'app/config/axiosConfig';
import { DataTable } from 'app/shared/DataTable';
import { AppDispatch, RootState } from 'app/store/index';
import { showMessage } from 'app/store/slices/messageSlice';
import { selectUser } from 'app/store/userSlice';
import { deleteDoc, doc } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { TBoiler } from 'src/@app/types/TBoilers';
import { useFetchPaginated } from 'src/app/hooks/useFetchPaginated';
import { db } from 'src/firebase-config';
import { getBoiler, selectBoilerById } from '../../store/boilersSlice';
import { getCurrentDate } from './functions/datesOperations';
import ConfirmModal from './modals/ConfirmModal';
import NewBoilerSettingsModal from './modals/NewBoilerSettingsModal';
import TableSettingsModal from './modals/TableSettingsModal';

export const BoilersDetailTable = ({ id, componentRef }) => {
  const dispatch = useDispatch<AppDispatch>();
  const boiler = useSelector<RootState, TBoiler | undefined>((state) => selectBoilerById(state, id || ''));
  const user = useSelector(selectUser);
  const [filterDate, setFilterDate] = useState<Date>();
  const [isEditRows, setIsEditRows] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedRowsIds, setSelectedRowsIds] = useState<GridRowId[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showHidden, setShowHidden] = useState(false);
  const [page, setPage] = useState(0);

  const rolesEnableDelete = ['admin', 'instalater'];
  const rolesEnableEditColumns = ['admin', 'instalater'];
  const rolesEnabledExportAndPrint = ['admin', 'user', 'instalater', 'obsluha'];

  useEffect(() => {
    dispatch(getBoiler(id || ''));
  }, [id, dispatch]);

  const options = useMemo(
    () => ({ id, page: page + 1, date: filterDate, showHidden }),
    [id, page, filterDate, showHidden]
  );
  const { data, rowCount, hasMorePages, isLoading, refetch } = useFetchPaginated('first-table-data', options, {
    rows: [],
    columns: [],
  });

  const wasCreatedDailyNote = (notes, date) => {
    return notes.some((note) => note.date === date);
  };

  const filterRowsByDate = (date) => {
    setPage(0);
    setFilterDate(date);
  };

  const handleCleanCalendar = () => {
    setPage(0);
    setFilterDate(undefined);
  };
  const nubmerIsInInterval = (min, max, number) => {
    return number >= min && number <= max;
  };

  const generateColumns = (columnsData: TBoiler['columns']) => {
    const prefix = {
      field: 'prefix',
      sortable: false,
      flex: 1,
      minWidth: 70,
      headerName: 'Typ',
    };

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
            title={isCreatedDailyNotes ? 'V daný deň bol vykonaný záznam' : 'V daný deň nebol vykonaný záznam'}
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

    const cellsWithColors = columnsData.map((i: any) => ({
      ...i,
      renderCell: (params) => {
        if (i.field === 'prefix') {
          return params.value;
        }
        return (
          <Tooltip title={i.desc === '' ? 'Bez popisu' : i.desc} placement="top">
            <p className={nubmerIsInInterval(i.min, i.max, params.value) ? 'text-green' : 'text-red'}>{params.value}</p>
          </Tooltip>
        );
      },
    }));

    return [lastUpdate, prefix, ...cellsWithColors];
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
      const response = await axiosInstance.post('pdf-dennik', data, {
        responseType: 'blob',
      });
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `Prevádzkový denník kotolne ${boiler?.id} (1 z 3).pdf`;
      link.click();
    } catch (error) {
      Sentry.captureException(error);
      dispatch(showMessage({ message: 'Vyskytla sa chyba pri generovaní PDF' }));
    }
  };

  const columns = useMemo(() => generateColumns(data.columns), [data.columns]);

  const deleteSelectedRows = async () => {
    try {
      const promises = selectedRowsIds.map(async (selectedId) => {
        const ref = doc(db, 'sms', selectedId as string);
        await deleteDoc(ref);
      });
      await Promise.all(promises);

      refetch();
      dispatch(showMessage({ message: 'Záznam úspešné zmazaný' }));
    } catch (error) {
      dispatch(showMessage({ message: 'Ups, vyskytla sa chyba ' + error }));
    } finally {
      setShowConfirmModal(false);
    }
  };

  useEffect(() => {
    setShowHidden(isSettingsModalOpen);
  }, [isSettingsModalOpen]);

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
      <div style={{ height: 650, width: '100%' }}>
        <DataTable
          rowCount={rowCount}
          rows={data.rows}
          isEditRows={isEditRows}
          columns={columns}
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
          getRowId={(row) => (row as any).id || (row as any).lastUpdate}
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
              </FuseSvgIcon>
              Export
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
              <TableSettingsModal //existing boiler
                //@ts-ignore
                boiler={{ ...boiler, columns: data.columns }}
                isOpen={isSettingsModalOpen}
                toggleOpen={() => {
                  setIsSettingsModalOpen((prev) => !prev);
                }}
                columnsValues={data.columns}
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
