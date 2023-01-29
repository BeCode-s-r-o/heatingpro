import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import { AppDispatch, RootState } from 'app/store/index';
import { selectUser } from 'app/store/userSlice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { TBoiler } from 'src/@app/types/TBoilers';
import { tempColumns } from '../../constants';
import { selectBoilerById, getBoilers, getBoiler } from '../../store/boilersSlice';

interface Props {
  data: any;
}

export const BoilersDetailTable = ({ data }: Props) => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const boiler = useSelector<RootState, TBoiler | undefined>((state) => selectBoilerById(state, id || ''));

  useEffect(() => {
    dispatch(getBoiler(id || ''));
  }, [id, dispatch]);

  const generateColumns = (data: TBoiler['columns']) => {
    return data.map((item) => {
      return {
        field: item.accessor,
        headerName: `${item.columnName} (${item.unit})`,
        hide: item.hide,
      };
    });
  };

  const columns = generateColumns(tempColumns.sort((a, b) => a.order - b.order));
  console.log(
    columns.map((item) => item.headerName),
    'columns'
  );
  const rows = [
    {
      time: 12.5,
      k1: 1.5,
      k2: 3.2,
      uk_spiat: 0.8,
      uk: 2.5,
      spat_kotlov: 0.7,
      privod_kotlov: 2.1,
      bojler: 0.9,
      vonkajsia_teplota: -1.5,
      tlak: 3.5,
      alarm: true,
    },
  ];
  return (
    <Paper className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden">
      <Typography className="text-lg font-medium tracking-tight leading-6 truncate">Bojler {data?.id}</Typography>

      <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[10]} getRowId={(row) => row.time} />
      </div>
    </Paper>
  );
};
