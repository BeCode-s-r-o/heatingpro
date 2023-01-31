import { combineReducers } from '@reduxjs/toolkit';
import contacts from './contactsSlice';
import contact from './singleContactSlice';

const reducer = combineReducers({
  contacts,
  contact,
});

export default reducer;
