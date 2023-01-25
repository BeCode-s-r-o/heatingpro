import { combineReducers } from '@reduxjs/toolkit';
import slices from './slices';

import user from './userSlice';

const createReducer = (asyncReducers) => (state, action) => {
  const combinedReducer = combineReducers({
    fuse: slices,
    user,
    ...asyncReducers,
  });

  if (action.type === 'user/userLoggedOut') {
    state = undefined;
  }

  return combinedReducer(state, action);
};

export default createReducer;
