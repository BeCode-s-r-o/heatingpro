import { TContact } from '@app/types/TContact';
import { createAsyncThunk, createEntityAdapter, createSelector, createSlice, EntityAdapter } from '@reduxjs/toolkit';
import { RootState } from 'app/store/index';
import { collection, deleteDoc, doc, getDoc, getDocs, getFirestore, setDoc } from 'firebase/firestore';
import history from '@history';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { secondaryApp } from 'src/firebase-config';
import FuseUtils from '@app/utils/FuseUtils';

export const selectSearchText = (state: RootState) => state.contacts.searchText;

export const getContacts = createAsyncThunk('contacts/getContacts', async () => {
  const users = await getDocs(collection(getFirestore(), 'users'));
  const data = users.docs.map((user) => user.data() as TContact);
  return data;
});

export const getContact = createAsyncThunk('contactsApp/task/getContact', async (id: string) => {
  try {
    const usersRef = doc(getFirestore(), 'users', `${id}`);
    const userDoc = await getDoc(usersRef);
    return userDoc.data();
  } catch (error) {
    history.push({ pathname: `/pouzivatelia` });
    return null;
  }
});

export const addContact = createAsyncThunk(
  'contactsApp/contacts/addContact',
  async (contact: TContact & { password: string }) => {
    const sAuth = getAuth(secondaryApp);
    createUserWithEmailAndPassword(sAuth, contact.email, contact.password)
      .then((data) => {
        const id = data.user.uid;
        const customerRef = doc(getFirestore(), 'users', id);

        setDoc(customerRef, { ...contact, id })
          .then(() => {})
          .catch((error) => {});
      })
      .catch((error) => {});
  }
);

export const updateContact = createAsyncThunk('contactsApp/contacts/updateContact', async (contact: TContact) => {
  const customerRef = doc(getFirestore(), 'users', contact.id);
  setDoc(customerRef, contact)
    .then(() => {})
    .catch((error) => {});
});

export const removeContact = createAsyncThunk('contactsApp/contacts/removeContact', async (id: string) => {
  const customerRef = doc(getFirestore(), 'users', `${id}`);

  deleteDoc(customerRef)
    .then(() => {})
    .catch((error) => {});
});

const contactsAdapter: EntityAdapter<TContact> = createEntityAdapter();

export const { selectAll: selectAllContacts, selectById: selectContactById } = contactsAdapter.getSelectors(
  (state: RootState) => state.contacts
);

export const selectFilteredContacts = createSelector([selectAllContacts, selectSearchText], (contacts, searchText) => {
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

export const contactsSlice = createSlice({
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
      prepare: (event) => ({ payload: event?.target?.value || '' }),
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getContacts.fulfilled, (state, action) => {
      contactsAdapter.setAll(state, action.payload);
    });
  },
});

export const { setContactsSearchText } = contactsSlice.actions;
