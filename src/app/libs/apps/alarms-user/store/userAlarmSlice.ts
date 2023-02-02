import { TBoiler, TSms } from '@app/types/TBoilers';
import { createAsyncThunk, createEntityAdapter, createSlice, EntityAdapter } from '@reduxjs/toolkit';
import { collection, doc, getDoc, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { RootState } from '../../../../store/index';

export const getUserAlarms = createAsyncThunk('userBoilers/getUserAlarms', async (id: string) => {
  const q = query(collection(getFirestore(), 'boilers'), where('assignedTo', '==', id));
  const queryData = await getDocs(q);
  const data = queryData.docs.map((user) => user.data() as TBoiler);
  return data;
});

export const getUserBoiler = createAsyncThunk(
  'userBoilers/getUserBoiler',
  async ({ id, userId }: { id: string | undefined; userId: string }) => {
    if (id) {
      const data = await getDoc(doc(getFirestore(), 'boilers', id));
      const boilerData = data.data() as TBoiler;
      if (!(boilerData.assignedTo === userId)) {
        return {} as TBoiler;
      }
      const smsQuery = query(collection(getFirestore(), 'sms'), where('deviceID', '==', id));
      const sms = await getDocs(smsQuery);
      const smsData = sms.docs.map((doc) => doc.data() as TSms);

      const merged = { ...boilerData, sms: smsData };
      return merged as TBoiler;
    }
    return {} as TBoiler;
  }
);

const alarmsAdapter: EntityAdapter<TBoiler> = createEntityAdapter({});

export const {
  selectAll: selectAllBoilers,
  selectById: selectBoilerById,
  selectTotal: selectTotalBoilers,
  selectIds: selectBoilerIds,
} = alarmsAdapter.getSelectors((state: RootState) => state.userAlarms);

const userAlarmsSlice = createSlice({
  name: 'userAlarms',
  initialState: alarmsAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserAlarms.fulfilled, (state, action) => {
      alarmsAdapter.setAll(state, action.payload);
    });
  },
});

export default userAlarmsSlice.reducer;
