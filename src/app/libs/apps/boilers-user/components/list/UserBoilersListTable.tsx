import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import { TBoiler, TBoilers } from 'src/@app/types/TBoilers';
import FuseSvgIcon from '@app/core/SvgIcon';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
interface Props {
  data: TBoilers;
}

export const BoilersListTable = ({ data }: Props) => {
  const columns = ['Názov kotolne', 'Adresa kotolne', 'ID kotolne', 'Telefónne číslo SIM'];
  const rows: any = data;
  const selectBoilerState = (boiler) => {
    if (boiler.alarms.length !== 0) {
      return 'bg-red';
    }
    if (boiler.columns.length === 0) {
      return 'bg-yellow';
    }
    return 'bg-green';
  };
  return (
    <Paper className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden">
      <Typography className="text-lg font-medium tracking-tight leading-6 truncate">Zoznam systémov</Typography>
      <Box className="flex  gap-12 mt-12">
        <Typography color="text.secondary" className="font-semibold text-12 whitespace-nowrap flex gap-6 items-center">
          <div className="w-12 h-12 rounded-full bg-green"></div>vporiadku
        </Typography>
        <Typography color="text.secondary" className="font-semibold text-12 whitespace-nowrap flex gap-6 items-center">
          <div className="w-12 h-12 rounded-full bg-yellow"></div>chýba nastavenie
        </Typography>
        <Typography color="text.secondary" className="font-semibold text-12 whitespace-nowrap flex gap-6 items-center">
          <div className="w-12 h-12 rounded-full bg-red"></div>alarm
        </Typography>
      </Box>
      <div className="table-responsive">
        <Table className="w-full min-w-full">
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell key={index}>
                  <Typography color="text.secondary" className="font-semibold text-12 whitespace-nowrap">
                    {column}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows?.map((row, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Typography
                    color="text.secondary"
                    className="font-semibold text-12 whitespace-nowrap flex gap-6 items-center"
                  >
                    <div className={`w-12 h-12 rounded-full ${selectBoilerState(row)}`}></div>
                    {row.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="text.secondary" className="font-semibold text-12 whitespace-nowrap">
                    {row.address.street + ', ' + row.address.city}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="text.secondary" className="font-semibold text-12 whitespace-nowrap">
                    {row.id}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="text.secondary" className="font-semibold text-12 whitespace-nowrap">
                    {row.phoneNumber}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="text.secondary" className="font-semibold text-12 whitespace-nowrap">
                    {/* alarm */}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="text.secondary" className="font-semibold text-12 whitespace-nowrap">
                    <Link to={String(row.id || '')} role="button" className="flex  items-center" color="primary">
                      <Button color="primary" className="whitespace-nowrap gap-6 " variant="contained">
                        <FuseSvgIcon className="text-48 text-white" size={16} color="action">
                          heroicons-solid:external-link
                        </FuseSvgIcon>
                        Detail
                      </Button>
                    </Link>
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Paper>
  );
};
