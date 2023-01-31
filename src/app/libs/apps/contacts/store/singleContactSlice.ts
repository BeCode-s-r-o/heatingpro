import { TContact } from '@app/types/TContact';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'app/store/index';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { deleteDoc, doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import { db, secondaryApp } from '../../../../../firebase-config';
import ContactModel from '../model/ContactModel';

export const getContact = createAsyncThunk('contacts/getContact', async (id: string) => {
  const userDoc = await getDoc(doc(getFirestore(), 'users', `${id}`));
  return userDoc.data();
});

export const addContact = createAsyncThunk('contacts/addContact', async (contact: TContact) => {
  const password = 'lubojekral';
  createUserWithEmailAndPassword(getAuth(secondaryApp), contact.email, password).then((data) => {
    const id = data.user.uid;
    setDoc(doc(getFirestore(), 'users', id), { ...contact, id })
      .then(() => {
        //TODO - pridaj nejake oznamenie, ze sa to podarilo
      })
      .catch((error) => {
        //TODO - pridaj nejake oznamenie, ze sa to nepodarilo
      });
  });
});

export const updateContact = createAsyncThunk('contacts/updateContact', async (contact: TContact) => {
  updateDoc(doc(db, 'users', contact.id), { ...contact })
    .then(() => {
      //TODO - pridaj nejake oznamenie, ze sa to podarilo
    })
    .catch((error) => {
      //TODO - pridaj nejake oznamenie, ze sa to nepodarilo
    });
});

export const removeContact = createAsyncThunk('contacts/removeContact', async (id: string) => {
  const customerRef = doc(getFirestore(), 'users', `${id}`);

  deleteDoc(customerRef)
    .then(() => {
      //TODO - pridaj nejake oznamenie, ze sa to podarilo
    })
    .catch((error) => {
      //TODO - pridaj nejake oznamenie, ze sa to nepodarilo
    });
  return id;
});

export const selectContacts = (state: RootState) => state.contacts;

const contactSlice = createSlice({
  name: 'contacts',
  initialState: null as TContact | null,
  reducers: {
    newContact: () => ContactModel(),
    resetContact: () => null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getContact.pending, () => null)
      .addCase(getContact.fulfilled, (_, action) => {
        const contact = action.payload as TContact;
        return contact;
      })
      .addCase(updateContact.fulfilled, (_, action) => action.payload)
      .addCase(removeContact.fulfilled, () => null);
  },
});

export const { resetContact, newContact } = contactSlice.actions;

export default contactSlice.reducer;
