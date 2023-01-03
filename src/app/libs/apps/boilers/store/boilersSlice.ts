import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { TBoilers } from 'src/@app/types/TBoilers';
import { RootState } from '../../../../store/index';

export const getBoilers = createAsyncThunk('admin/boilers/getBoilers', async () => {
  const response = { data: [] };
  return response.data as TBoilers;
});

const boilersAdapter = createEntityAdapter({});

export const {
  selectAll: selectAllBoilers,
  selectEntities: selectAllEntities,
  selectById: selectBoilerById,
  selectTotal: selectTotalBoilers,
  selectIds: selectBoilerIds,
} = boilersAdapter.getSelectors((state: RootState) => state.boilers.boilers);

const boilersSlice = createSlice({
  name: 'boilers',
  initialState: boilersAdapter.getInitialState(),
  reducers: {},
  extraReducers: {
    //@ts-ignore
    [getBoilers.fulfilled]: boilersAdapter.setAll,
  },
});

export default boilersSlice.reducer;
