export interface TEvent {
  id: string;
  allDay: boolean;
  start: string;
  end: string;
  extendedProps: { desc: string; label: string };
  title: string;
  [key: string]: any;
}

export interface TLabel {
  id: string;
  color: string;
  title: string;
  [key: string]: any;
}
