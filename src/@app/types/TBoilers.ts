export type TBoiler = {
  name: string;
  id: string;
  phoneNumber: string;
  address: { city: string; street: string; zip: string };
  period: string;
  assignedTo: string;
  columns: TBoilerColumn[];
  lastUpdate: string;
  sms: TSms[];
  header: TBoilerInfo;
  notes: TBoilerNote[];
  monthTable: { columns: any; rows: any };
};
type TBoilerNote = { id: string; note: String; date: string; addedBy: string };
export type TBoilers = TBoiler[];

type TBoilerColumn = {
  accessor: string;
  columnName: string;
  unit: string;
  hide?: boolean;
  order: number;
  desc?: string;
  max: any | null;
  min: any | null;
};

export interface TSms {
  deviceID: string;
  fromPhoneNumber: string;
  messageID: string;
  messageServiceID: string;
  originalBody: string;
  status: string;
  timestamp: {
    firestore: string;
    unix: number;
  };
  toPhoneNumber: string;
  body?: Body;
}

export interface TBoilerInfo {
  period: number;
  name: string;
  location: string;
  provider: string;
  maintenance: string;
  staff1: string;
  staff2: string;
  monitoringDeviceID: string;
  avatar: string;
}

interface Body {
  deviceID: string;
  digitalInput: Array<number | null>;
  digitalOutput: Array<number>;
  inputData: Array<number | null>;
  timestamp: {
    display: string;
    original: string;
    unix: number;
  };
}
