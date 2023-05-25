import { TBoiler, TSms } from '@app/types/TBoilers';
import { createAsyncThunk, createEntityAdapter, createSlice, EntityAdapter } from '@reduxjs/toolkit';
import { collection, doc, getDoc, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { RootState } from '../../../../store/index';

export const userAssignedHeaters = (heaters: TBoiler[], ids: string[]) => {
  let allAsignedHeatersData = heaters.filter((heater) => ids.includes(heater.id) && !heater.disabled);
  return allAsignedHeatersData as TBoiler[];
};

export const getBoilers = createAsyncThunk('adminBoilers/getAdminBoilers', async () => {
  const { docs } = await getDocs(collection(getFirestore(), 'boilers'));
  const data = docs.map((user) => user.data() as TBoiler);
  return data;
});

export const getBoiler = createAsyncThunk('adminBoilers/getAdminBoiler', async (id: string | undefined) => {
  if (id) {
    const data = await getDoc(doc(getFirestore(), 'boilers', id));
    const smsQuery = query(collection(getFirestore(), 'sms'), where('deviceID', '==', id));
    const sms = await getDocs(smsQuery);
    const smsData = sms.docs.map((doc) => doc.data() as TSms);
    const boiler = data.data() as TBoiler;
    const merged = { ...boiler, sms: smsData };
    return merged as TBoiler;
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

export const selectBoilersByIds = (state: RootState, ids: string[]) => {
  //@ts-ignore
  const allBoilers = selectAllBoilers(state.adminBoilers);
  return allBoilers.filter((boiler) => ids.includes(boiler.id)) as TBoiler[];
};
