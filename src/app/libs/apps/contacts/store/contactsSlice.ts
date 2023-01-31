//@ts-nocheck
import { TContact } from '@app/types/TContact';
import FuseUtils from '@app/utils';
import { createAsyncThunk, createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'app/store/index';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../../../firebase-config';
import { addContact, removeContact, updateContact } from './singleContactSlice';

const contactsAdapter = createEntityAdapter({});

export const getContacts = createAsyncThunk('contacts/getContacts', async () => {
  const users = await getDocs(collection(db, 'users'));
  const data = users.docs.map((user) => user.data() as TContact);
  return data;
});

export const selectSearchText = (state: RootState) => state.contacts;

export const {
  selectAll: selectContacts,
  selectById: selectContactById,
  selectTotal: selectTotalContacts,
} = contactsAdapter.getSelectors((state: RootState) => state.contacts);

export const selectFilteredContacts = createSelector([selectContacts, selectSearchText], (contacts, searchText) => {
  if (searchText.length === 0) {
    return contacts;
  }
  return FuseUtils.filterArrayByString(contacts, searchText);
});

export const selectGroupedFilteredContacts = createSelector([selectFilteredContacts], (contacts) => {
  return contacts
    .sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }))
    .reduce((r, e) => {
      const group = e.name[0];
      if (!r[group]) r[group] = { group, children: [e] };
      else r[group].children.push(e);
      return r;
    }, {});
});

const contactsSlice = createSlice({
  name: 'contacts',
  initialState: contactsAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {
    setContactsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      //@ts-ignore
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getContacts.fulfilled, contactsAdapter.setAll);
    builder.addCase(updateContact.fulfilled, contactsAdapter.upsertOne);
    builder.addCase(addContact.fulfilled, contactsAdapter.addOne);
    //@ts-ignore
    builder.addCase(removeContact.fulfilled, (state, action) => contactsAdapter.removeOne(state, action.payload));
    builder.addCase(getContacts.fulfilled, (state, action) => {
      const { data } = action.payload;
      contactsAdapter.setAll(state, data);
      state.searchText = '';
    });
  },
});

export const { setContactsSearchText } = contactsSlice.actions;

export default contactsSlice.reducer;
