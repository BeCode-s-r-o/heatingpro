import { combineReducers } from '@reduxjs/toolkit';
import boilers from './boilersSlice';

const reducer = combineReducers({
  boilers,
});

export default reducer;
