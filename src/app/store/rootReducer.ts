import { combineReducers } from '@reduxjs/toolkit';
import slices from './slices';

import user from './userSlice';

const createReducer = (asyncReducers?: any) => (state, action) => {
  const combinedReducer = combineReducers({
    fuse: slices,
    user,
    ...asyncReducers,
  });

  if (action.type === 'user/logoutUser') {
    state = undefined;
  }

  return combinedReducer(state, action as never);
};

export default createReducer;
