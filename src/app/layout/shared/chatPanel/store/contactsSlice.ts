import { TContact } from '@app/types/TContact';
import { createAsyncThunk, createEntityAdapter, createSlice, EntityAdapter } from '@reduxjs/toolkit';
import { RootState } from 'app/store/index';
import { collection, getDocs, getFirestore } from 'firebase/firestore';

export const getContacts = createAsyncThunk('contacts/getContacts', async () => {
  const users = await getDocs(collection(getFirestore(), 'users'));
  const data = users.docs.map((user) => user.data() as TContact);
  return data;
});

const contactsAdapter: EntityAdapter<TContact> = createEntityAdapter();

export const { selectAll: selectAllContacts } = contactsAdapter.getSelectors((state: RootState) => state.contacts);

export const contactsSlice = createSlice({
  name: 'contacts',
  initialState: contactsAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getContacts.fulfilled, (state, action) => {
      contactsAdapter.setAll(state, action.payload);
    });
  },
});
