import FuseSvgIcon from '@app/core/SvgIcon';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { selectUser } from 'app/store/userSlice';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { TBoilers } from 'src/@app/types/TBoilers';

interface Props {
  data: TBoilers;
}

export const BoilersListTable = ({ data }: Props) => {
  const user = useSelector(selectUser);
  const rolesEnabledSeePhone = ['admin', 'instalater'];
  let columns = ['Názov kotolne', 'Adresa kotolne', 'ID kotolne', 'Telefónne číslo SIM'];
  const navigate = useNavigate();
  if (!rolesEnabledSeePhone.includes(user.role)) {
    columns = columns.filter((column) => column !== 'Telefónne číslo SIM');
  }

  const rows: any = data;

  return (
    <Paper className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden">
      <Typography className="text-lg font-medium tracking-tight leading-6 truncate">Zoznam systémov</Typography>

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
              <TableRow
                key={index}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  navigate(`/systemy/${row.id}`);
                }}
              >
                <TableCell>
                  <Typography
                    color="text.secondary"
                    className="font-semibold text-12 whitespace-nowrap flex gap-6 items-center"
                    style={{ color: row.disabled ? 'red' : 'inherit' }}
                  >
                    {row.header.name} {row.disabled && <FuseSvgIcon size={20}>heroicons-solid:trash</FuseSvgIcon>}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="text.secondary" className="font-semibold text-12 whitespace-nowrap">
                    {row.address?.street + ', ' + row.address?.city}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="text.secondary" className="font-semibold text-12 whitespace-nowrap">
                    {row.id}
                  </Typography>
                </TableCell>
                {rolesEnabledSeePhone.includes(user?.role) && (
                  <TableCell>
                    <Typography color="text.secondary" className="font-semibold text-12 whitespace-nowrap">
                      {row.phoneNumber}
                    </Typography>
                  </TableCell>
                )}
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
