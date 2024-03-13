import { Stack } from '@mui/system';
import { DataGrid } from '@mui/x-data-grid';

export const DataTable = ({
  rows,
  page,
  isLoading,
  columns,
  getRowId,
  isEditRows,
  rowCount,
  onPageChange,
  onSelectionModelChange,
}) => {
  return (
    <DataGrid
      rows={rows}
      columns={columns}
      disableColumnMenu
      getRowId={getRowId}
      paginationMode="server"
      checkboxSelection={isEditRows}
      rowCount={rowCount}
      onSelectionModelChange={onSelectionModelChange}
      page={page}
      pageSize={15}
      onPageChange={onPageChange}
      loading={isLoading}
      autoPageSize
      rowsPerPageOptions={[]}
      pagination
      initialState={{ pagination: { pageSize: 15, page: 0 } }}
      localeText={{
        MuiTablePagination: {
          labelDisplayedRows: ({ from, to }) => `Strana ${page + 1} (${from}-${to})`,
        },
      }}
      components={{
        NoRowsOverlay: () => (
          <Stack height="100%" alignItems="center" justifyContent="center">
            Žiadne dáta
          </Stack>
        ),
        NoResultsOverlay: () => (
          <Stack height="100%" alignItems="center" justifyContent="center">
            Žiadne dáta
          </Stack>
        ),
      }}
    />
  );
};
