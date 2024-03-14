import axiosInstance from 'app/config/axiosConfig';
import { useCallback, useEffect, useState } from 'react';

export const useFetchPaginated = (endpoint: string, options: any, initial?: any) => {
  const [hasMorePages, setHasMorePages] = useState(true);
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(initial ?? {});
  const [refetchIndex, setRefetchIndex] = useState(0);

  const getData = useCallback(async () => {
    setIsLoading(true);
    const {
      data: { isAll, totalLength, ...dataFromBe },
    } = await axiosInstance.post(endpoint, options);
    setData(dataFromBe);
    setRowCount(totalLength);
    setHasMorePages(!isAll);
    setIsLoading(false);
  }, [endpoint, options]);

  const refetch = () => setRefetchIndex((prevIndex) => prevIndex + 1);

  useEffect(() => {
    getData();
  }, [options, refetchIndex]);

  return { data, rowCount, hasMorePages, isLoading, refetch };
};
