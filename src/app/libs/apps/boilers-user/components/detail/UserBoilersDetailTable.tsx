import { Button } from '@mui/material';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/system';
import { DataGrid } from '@mui/x-data-grid';
import moment from 'moment';
import { TBoiler } from 'src/@app/types/TBoilers';
import FuseSvgIcon from '@app/core/SvgIcon';
type Props = {
  boiler: TBoiler | undefined;
  id: string;
  generatePDF: () => void;
  printTable: () => void;
};

export const BoilersDetailTable = ({ boiler, id, generatePDF, printTable }: Props) => {
  const generateColumns = (data: TBoiler['columns']) => {
    const dateColumn = {
      field: 'date',
      headerName: `Dátum a čas`,
      filterable: false,
      flex: 1,
      minWidth: 110,
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

  return (
    <Paper className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden">
      <Typography className="text-lg font-medium tracking-tight leading-6 truncate">Kotolňa {id}</Typography>

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
      <div className="flex gap-16 dont-print mt-12">
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
      </div>
    </Paper>
  );
};
