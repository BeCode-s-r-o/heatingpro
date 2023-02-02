import { TBoiler, TSms } from '@app/types/TBoilers';
import { createAsyncThunk, createEntityAdapter, createSlice, EntityAdapter } from '@reduxjs/toolkit';
import { collection, doc, getDoc, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { RootState } from '../../../../store/index';

export const getUserBoilers = createAsyncThunk('userBoilers/getUserBoilers', async (id: string) => {
  const q = query(collection(getFirestore(), 'boilers'), where('assignedTo', '==', id));
  const queryData = await getDocs(q);
  const data = queryData.docs.map((user) => user.data() as TBoiler);
  return data;
});

export const getUserBoiler = createAsyncThunk(
  'userBoilers/getUserBoiler',
  async ({ id, userId }: { id: string; userId: string }) => {
    const data = await getDoc(doc(getFirestore(), 'boilers', id));
    const boilerData = data.data() as TBoiler;

    if (boilerData.assignedTo !== userId) {
      return {} as TBoiler;
    }

    const smsQuery = query(collection(getFirestore(), 'sms'), where('deviceID', '==', id));
    const sms = await getDocs(smsQuery);
    const smsData = sms.docs.map((doc) => doc.data() as TSms);

    const merged = { ...boilerData, sms: smsData };
    return merged as TBoiler;
  }
);

const boilersAdapter: EntityAdapter<TBoiler> = createEntityAdapter({});

export const {
  selectAll: selectAllBoilers,
  selectById: selectBoilerById,
  selectTotal: selectTotalBoilers,
  selectIds: selectBoilerIds,
} = boilersAdapter.getSelectors((state: RootState) => state.userBoilers);

const userBoilersSlice = createSlice({
  name: 'userBoilers',
  initialState: boilersAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserBoilers.fulfilled, (state, action) => {
      boilersAdapter.setAll(state, action.payload);
    });
    builder.addCase(getUserBoiler.fulfilled, (state, action) => {
      boilersAdapter.upsertOne(state, action.payload);
    });
  },
});

export default userBoilersSlice.reducer;
