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
  { accessor: 'time', columnName: 'Čas', unit: 's', hide: false, order: 1, limit: { max: null, min: null } },
  { accessor: 'k1', columnName: 'K1', unit: 's', hide: true, order: 2, limit: { max: null, min: null } },
  { accessor: 'k2', columnName: 'K2', unit: 's', hide: false, order: 3, limit: { max: null, min: null } },
  { accessor: 'uk_spiat', columnName: 'UK spiat.', unit: 's', hide: false, order: 4, limit: { max: null, min: null } },
  { accessor: 'uk', columnName: 'UK', unit: 's', hide: false, order: 5, limit: { max: null, min: null } },
  {
    accessor: 'spat_kotlov',
    columnName: 'spiat. kotlov',
    unit: 's',
    hide: false,
    order: 6,
    limit: { max: null, min: null },
  },
  {
    accessor: 'privod_kotlov',
    columnName: 'prívod kotlov',
    unit: 's',
    hide: false,
    order: 7,
    limit: { max: null, min: null },
  },
  { accessor: 'bojler', columnName: 'bojler', unit: 's', hide: false, order: 8, limit: { max: null, min: null } },
  {
    accessor: 'vonkajsia_teplota',
    columnName: 'vonk. teplota',
    unit: 's',
    hide: false,
    order: 9,
    limit: { max: null, min: null },
  },
  { accessor: 'tlak', columnName: 'tlak (uk)', unit: 's', hide: false, order: 10, limit: { max: null, min: null } },
  { accessor: 'alarm', columnName: 'alarm', unit: 's', hide: false, order: 11, limit: { max: null, min: null } },
];
