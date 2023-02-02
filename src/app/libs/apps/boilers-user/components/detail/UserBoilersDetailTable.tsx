import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/system';
import { DataGrid } from '@mui/x-data-grid';
import moment from 'moment';
import { TBoiler } from 'src/@app/types/TBoilers';

type Props = {
  boiler: TBoiler | undefined;
  id: string;
};

export const BoilersDetailTable = ({ boiler, id }: Props) => {
  const generateColumns = (data: TBoiler['columns']) => {
    const dateColumn = {
      field: 'date',
      headerName: `Dátum a čas`,
      filterable: false,
      flex: 1,
    };
    const sortedData = data
      .sort((i) => i.order)
      .map((item) => {
        return {
          field: item.accessor,
          headerName: `${item.columnName} (${item.unit})`,
          hide: item.hide,
          filterable: false,
          flex: 1,
        };
      });
    return [dateColumn, ...sortedData];
  };

  const generateRows = (data: TBoiler['sms']) => {
    return data
      ?.sort((a, b) => b.timestamp.unix - a.timestamp.unix)
      .map(
        (i) =>
          i.body?.inputData?.reduce((acc, curr, idx) => ({ ...acc, [String(idx)]: curr || '-' }), {
            date: moment(i.timestamp.unix).format('DD.MM.YYYY HH:mm:ss'),
          }) || {}
      );
  };

  const columns = generateColumns([...(boiler?.columns || [])]);
  const rows = generateRows([...(boiler?.sms || [])]);
  console.log(rows);
  return (
    <Paper className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden">
      <Typography className="text-lg font-medium tracking-tight leading-6 truncate">Bojler {id}</Typography>

      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          disableColumnFilter
          disableColumnSelector
          disableColumnMenu
          hideFooter
          rows={rows}
          columns={columns}
          getRowId={(row) => Math.random()}
          components={{
            ColumnSortedAscendingIcon: () => null,
            ColumnSortedDescendingIcon: () => null,
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
