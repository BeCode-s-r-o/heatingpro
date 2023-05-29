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
  contactsForNotification: TContactForNotification[];
  disabled?: boolean;
};
export type TContactForNotification = {
  name: string;
  phone: string;
  sendPhone: boolean;
  email: string;
  sendEmail: boolean;
};

export type TBoilerNote = {
  id: string;
  note: String;
  date: string;
  confirmedBy: string;
  createdBy: string;
  signatureImgURL: string | null;
};
export type TBoilers = TBoiler[];

export type TBoilerColumn = {
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
  softwareVersion: string;
  serialNumber: string;
  instalationDate: string;
  period: number;
  name: string;
  location: string;
  provider: string;
  maintenance: string;
  operator: string;
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
