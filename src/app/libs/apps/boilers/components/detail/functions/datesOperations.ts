import moment from 'moment';

export const compareDates = (date1, date2) => {
  const d1 = moment(date1, 'ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
  const d2 = moment(date2, 'DD.MM.YYYY HH:mm:ss');
  return d1.isSame(d2, 'month') && d1.isSame(d2, 'year');
};
export const compareDatesYears = (date1, date2) => {
  const d1 = moment(date1, 'ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
  const d2 = moment(date2, 'D.M.YYYY');
  return d1.isSame(d2, 'year');
};
export const getCurrentDate = () => {
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  return `${day}.${month}.${year}`;
};

export const formatDateToSK = (dateString) => {
  // Create a new Date object using the dateString
  const date = new Date(dateString);

  // Extract the day, month, and year from the date object
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();

  // Return the formatted date string
  return `${day}.${month}.${year}`;
};

export const getFullActualSkTime = () => {
  const now = new Date();
  const today = now
    .toLocaleDateString('sk-SK', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    .replace(/. /g, '.');

  const time = now.toLocaleTimeString('sk-SK', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return `${today} ${time}`;
};
