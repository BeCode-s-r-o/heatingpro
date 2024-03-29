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
  smsLimit?: number;
  header: TBoilerInfo;
  notes: TBoilerNote[];
  requestedSMS: { dateOfRequest: string }[];
  monthTable: { columns: any; rows: any };
  contactsForNotification: TContactForNotification[];
  disabled?: boolean;
  lastReset?: number;
  effectivityConstant?: number;
  infSMS?: {
    body: {
      pocetSms?: {
        sent: number;
        total: number;
      };
      cisloZariadenia: string;
      pin: string;
      verziaSw: string;
      gate1: string;
      perioda: number;
      alarmy: string;
      'seq.': string;
      set: string;
    };
    lastUpdate: number;
  };
};
export type TContactForNotification = {
  name: string;
  phone: string;
  email: string;
  sendSmsAlarm: boolean;
  sendSmsMissingRecord: boolean;
  sendEmailMonthlyReport: boolean;
  sendEmailAlarm: boolean;
  sendEmailMissingRecord: boolean;
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
  id: string;
  max: any | null;
  min: any | null;
};

export interface TSms {
  id?: string;
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
  withService: boolean;
  isPaid: boolean;
  serialNumberAj: string;
  serialNumberEj: string;
  serialNumberEj2: string;
  companyDetails?: {
    name: string;
    ico: string;
    email: string;
    phone: string;
  };
}

interface Body {
  deviceID: string;
  digitalInput: Array<number | null>;
  inputData: Array<number | null>;
  prefix: string | null;
  timestamp: {
    display: string;
    original: string;
    unix: number;
  };
}
