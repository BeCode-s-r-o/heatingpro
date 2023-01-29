import { TBoiler } from '@app/types/TBoilers';
import { createAsyncThunk, createEntityAdapter, createSlice, EntityAdapter } from '@reduxjs/toolkit';
import { collection, getDocs, getDoc, getFirestore, doc } from 'firebase/firestore';
import { RootState } from '../../../../store/index';

export const getBoilers = createAsyncThunk('adminBoilers/getAdminBoilers', async () => {
  const { docs } = await getDocs(collection(getFirestore(), 'boilers'));
  const data = docs.map((user) => user.data() as TBoiler);
  return data;
});
export const getBoiler = createAsyncThunk('adminBoilers/getAdminBoiler', async (id: string | undefined) => {
  if (id) {
    const data = await getDoc(doc(getFirestore(), 'boilers', id));
    return data.data() as TBoiler;
  }
  return {} as TBoiler;
});
const boilersAdapter: EntityAdapter<TBoiler> = createEntityAdapter({});

export const {
  selectAll: selectAllBoilers,
  selectById: selectBoilerById,
  selectTotal: selectTotalBoilers,
} = boilersAdapter.getSelectors((state: RootState) => state.adminBoilers);

export const boilersSlice = createSlice({
  name: 'adminBoilers',
  initialState: boilersAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getBoilers.fulfilled, (state, action) => {
      boilersAdapter.setAll(state, action.payload);
    });
    builder.addCase(getBoiler.fulfilled, (state, action) => {
      boilersAdapter.upsertOne(state, action.payload);
    });
  },
});
