import { TBoiler } from '@app/types/TBoilers';
import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { collection, doc, getDoc, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { RootState } from '../../../../store/index';

export const getUserBoilers = createAsyncThunk('user/boilers/getUserBoilers', async (options?: { id: string }) => {
  if (options?.id) {
    const q = query(collection(getFirestore(), 'boilers'), where('assignedTo', '==', options.id));
    const queryData = await getDocs(q);
    const data = queryData.docs.map((user) => user.data());
    return data;
  }
  return [];
});

export const getUserBoiler = createAsyncThunk('user/boilers/getUserBoiler', async (id: string | undefined) => {
  if (id) {
    const data = await getDoc(doc(getFirestore(), 'boilers', id));
    return data.data();
  }
  return {};
});

const boilersAdapter = createEntityAdapter({});
const initialState = boilersAdapter.getInitialState();

export const {
  selectAll: selectAllBoilers,
  selectById: selectBoilerById,
  selectTotal: selectTotalBoilers,
  selectIds: selectBoilerIds,
} = boilersAdapter.getSelectors((state: RootState) => state.boilers);

const userBoilersSlice = createSlice({
  name: 'boilers',
  initialState,
  reducers: {
    resetBoilers: () => initialState,
  },
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
