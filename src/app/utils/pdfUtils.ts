import * as Sentry from '@sentry/react';
import axiosInstance from 'app/config/axiosConfig';
import { showMessage } from 'app/store/slices/messageSlice';
import { getCurrentDate } from '../libs/apps/boilers/components/detail/functions/datesOperations';

export const getPDFVykonnost = async (boiler, user, filterDate, dispatch) => {
  let data = {
    boilerID: boiler?.id,
    user: user,
    date: getCurrentDate(),
    dateForFilter: filterDate ? filterDate : 'last12months',
  };

  dispatch(showMessage({ message: 'PDF sa generuje...' }));
  try {
    const response = await axiosInstance.post('pdf-vykonnost', data, {
      responseType: 'blob',
    });
    const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `Mesačné odpisy stavu spotreby ${boiler?.id} (3 z 3).pdf`;
    link.click();
  } catch (error) {
    Sentry.captureException(error);
    dispatch(showMessage({ message: 'Vyskytla sa chyba pri generovaní PDF' }));
  }
};
