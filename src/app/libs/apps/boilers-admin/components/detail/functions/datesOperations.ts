import moment from 'moment';

export const compareDates = (date1, date2) => {
  const d1 = moment(date1, 'DD.MM.YYYY HH:mm:ss');
  const d2 = moment(date2, 'YYYY-MM').startOf('month');
  return d1.isSame(d2, 'month') && d1.isSame(d2, 'year');
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
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  // Return the formatted date string
  return `${day}.${month}.${year}`;
};
