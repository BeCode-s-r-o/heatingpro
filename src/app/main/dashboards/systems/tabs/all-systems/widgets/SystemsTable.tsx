import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import { ESystemsPeriod } from 'src/app/types/TSystems';

function SystemsTable() {
  // const widgets = useSelector(selectWidgets);
  const columns = ['Názov', 'Číslo', 'Telefónne číslo', 'Perióda'];
  const rows = [
    {
      name: 'Systém 1',
      number: '123456789',
      phoneNumber: '0901234567',
      period: ESystemsPeriod['12_HOD'],
    },
    {
      name: 'Systém 2',
      number: '123456789',
      phoneNumber: '0901234567',
      period: ESystemsPeriod['24_HOD'],
    },
  ];
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
            {rows.map((row, index) => (
              <TableRow key={index}>
                {Object.values(row).map((value) => (
                  <TableCell key={index}>
                    <Typography color="text.secondary" className="font-semibold text-12 whitespace-nowrap">
                      {value}
                    </Typography>
                  </TableCell>
                ))}
                <TableCell key={index}>
                  <Typography color="text.secondary" className="font-semibold text-12 whitespace-nowrap">
                    <a href="#">Detail</a>
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Paper>
  );
}

export default memo(SystemsTable);
