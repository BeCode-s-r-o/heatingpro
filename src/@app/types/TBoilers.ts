export type TBoiler = {
  name: string;
  id: string;
  phoneNumber: string;
  period: string;
  assignedTo: string;
  columns: TBoilerColumn[];
  lastUpdate: string;
  sms: TSms[];
  header: TBoilerInfo;
};

export type TBoilers = TBoiler[];

type TBoilerColumn = {
  accessor: string;
  columnName: string;
  unit: string;
  hide?: boolean;
  order: number;

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
  name: string;
  location: string;
  provider: string;
  maintenance: string;
  staff1: string;
  staff2: string;
  monitoringDeviceID: string;
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
