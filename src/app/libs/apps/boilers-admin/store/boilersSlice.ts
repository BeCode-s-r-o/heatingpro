import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { collection, getDocs } from 'firebase/firestore';
import { db } from 'src/firebase-config';
import { RootState } from '../../../../store/index';

export const getBoilers = createAsyncThunk('admin/boilers/getBoilers', async () => {
  const boilers = await getDocs(collection(db, 'boilers'));
  const data = boilers.docs.map((user) => user.data());
  return { data };
});

const boilersAdapter = createEntityAdapter({});

export const {
  selectAll: selectAllBoilers,
  selectEntities: selectAllEntities,
  selectById: selectBoilerById,
  selectTotal: selectTotalBoilers,
  selectIds: selectBoilerIds,
} = boilersAdapter.getSelectors((state: RootState) => state.boilers);

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
