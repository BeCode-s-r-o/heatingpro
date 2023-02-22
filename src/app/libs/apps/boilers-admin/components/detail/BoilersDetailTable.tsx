import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/system';
import { DataGrid } from '@mui/x-data-grid';
import { AppDispatch, RootState } from 'app/store/index';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TBoiler } from 'src/@app/types/TBoilers';
import { getBoiler, selectBoilerById } from '../../store/boilersSlice';

export const BoilersDetailTable = ({ id, componentRef }) => {
  const dispatch = useDispatch<AppDispatch>();
  const boiler = useSelector<RootState, TBoiler | undefined>((state) => selectBoilerById(state, id || ''));

  useEffect(() => {
    dispatch(getBoiler(id || ''));
  }, [id, dispatch]);

  const generateColumns = (data: TBoiler['columns']) => {
    const sortedData = data.sort((i) => i.order);
    return sortedData.map((item) => {
      return {
        field: item.accessor,
        headerName: `${item.columnName} (${item.unit})`,
        hide: item.hide,
        flex: 1,
      };
    });
  };

  const generateRows = (data: TBoiler['sms']) => {
    return data
      ?.sort((i) => i.timestamp.unix)
      .map((i) => i.body?.inputData?.reduce((acc, curr, idx) => ({ ...acc, [String(idx)]: curr || '-' }), {}) || {});
  };

  const columns = generateColumns([...(boiler?.columns || [])]);
  const rows = generateRows([...(boiler?.sms || [])]);

  return (
    <Paper ref={componentRef} className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden">
      <Typography className="text-lg font-medium tracking-tight leading-6 truncate">Bojler {id}</Typography>

      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          getRowId={(row) => Math.random()}
          components={{
            NoRowsOverlay: () => (
              <Stack height="100%" alignItems="center" justifyContent="center">
                Žiadne dáta
              </Stack>
            ),
          }}
        />
      </div>
    </Paper>
  );
};
