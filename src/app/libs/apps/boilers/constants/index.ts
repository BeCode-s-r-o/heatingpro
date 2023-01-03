export const container = {
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export const tempColumns = [
  { accessor: 'time', columnName: 'Čas', unit: 's' },
  { accessor: 'k1', columnName: 'K1', unit: 's' },
  { accessor: 'k2', columnName: 'K2', unit: 's' },
  { accessor: 'uk_spiat', columnName: 'UK spiat.', unit: 's' },
  { accessor: 'uk', columnName: 'UK', unit: 's' },
  { accessor: 'spat_kotlov', columnName: 'spiat. kotlov', unit: 's' },
  { accessor: 'privod_kotlov', columnName: 'prívod kotlov', unit: 's' },
  { accessor: 'bojler', columnName: 'bojler', unit: 's' },
  { accessor: 'vonkajsia_teplota', columnName: 'vonk. teplota', unit: 's' },
  { accessor: 'tlak', columnName: 'tlak (uk)', unit: 's' },
  { accessor: 'alarm', columnName: 'alarm', unit: 's' },
];
