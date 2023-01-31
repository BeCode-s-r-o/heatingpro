export type TBoiler = {
  name: string;
  id: string;
  phoneNumber: string;
  period: string;
  assignedTo: string;
  columns: TBoilerColumn[];
  lastUpdate: string;
};

export type TBoilers = TBoiler[];

type TBoilerColumn = {
  accessor: string;
  columnName: string;
  unit: string;
  hide?: boolean;
  order: number;
  limit: {
    max: any | null;
    min: any | null;
  };
};
