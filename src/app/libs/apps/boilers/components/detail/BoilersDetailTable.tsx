import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import { TBoiler } from 'src/@app/types/TBoilers';
import { tempColumns } from '../../constants';

interface Props {
  data: any;
}

export const BoilersDetailTable = ({ data }: Props) => {
  const generateColumns = (data: TBoiler) => {
    //@ts-ignore
    return data.map((item) => {
      return {
        field: item.accessor,
        headerName: `${item.columnName} (${item.unit})`,
        hide: item.hide,
      };
    });
  };
  //@ts-ignore
  const columns = generateColumns(tempColumns.sort((a, b) => a.order - b.order));
  const rows = [];
  return (
    <Paper className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden">
      <Typography className="text-lg font-medium tracking-tight leading-6 truncate">Bojler {data?.id}</Typography>

      <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[10]} />
      </div>
    </Paper>
  );
};
