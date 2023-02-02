import { TContact } from '@app/types/TContact';
import history from '@history';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { db, secondaryApp } from '../../../../../firebase-config';
import ContactModel from '../model/ContactModel';

export const getContact = (id) =>
  createAsyncThunk('contactsApp/task/getContact', async () => {
    try {
      const usersRef = doc(db, 'users', `${id}`);
      const userDoc = await getDoc(usersRef);
      return userDoc.data();
    } catch (error) {
      history.push({ pathname: `/pouzivatelia` });
      return null;
    }
  });

export const addContact = createAsyncThunk(
  'contactsApp/contacts/addContact',
  async (contact: TContact, { dispatch, getState }) => {
    const password = 'lubojekral';
    const sAuth = getAuth(secondaryApp);
    createUserWithEmailAndPassword(sAuth, contact.email, password)
      .then((data) => {
        const id = data.user.uid;
        const customerRef = doc(db, 'users', id);

        setDoc(customerRef, { ...contact, id })
          .then(() => {
            console.log('Document has been added successfully');
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error.message);
      });
  }
);

export const updateContact = createAsyncThunk(
  'contactsApp/contacts/updateContact',
  async (contact: TContact, { dispatch, getState }) => {
    const customerRef = doc(db, 'users', contact.id);
    setDoc(customerRef, contact)
      .then(() => {
        console.log('Document has been added successfully');
      })
      .catch((error) => {
        console.log(error);
      });
  }
);

export const removeContact = (id) =>
  createAsyncThunk('contactsApp/contacts/removeContact', async () => {
    const customerRef = doc(db, 'users', `${id}`);

    deleteDoc(customerRef)
      .then(() => {
        console.log('Entire Document has been deleted successfully.');
      })
      .catch((error) => {
        console.log(error);
      });
    const response = await axios.delete(`/api/contacts/${id}`);

    await response.data;

    return id;
  });

export const selectContact = ({ contactsApp }) => contactsApp.contact;

const contactSlice = createSlice({
  name: 'contactsApp/contact',
  initialState: null as TContact | null,
  reducers: {
    newContact: () => ContactModel(),
    resetContact: () => null,
  },
  extraReducers: (builder) => {
    builder
      //@ts-ignore
      .addCase(getContact.pending, (state) => null)
      //@ts-ignore
      .addCase(getContact.fulfilled, (state, action) => {
        const contact = action.payload as TContact;
        return contact;
      })
      .addCase(updateContact.fulfilled, (state, action) => action.payload)
      //@ts-ignore
      .addCase(removeContact.fulfilled, (state) => null);
  },
});

export const { resetContact, newContact } = contactSlice.actions;

export default contactSlice.reducer;
