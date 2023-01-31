import { TBoiler, TBoilers } from '@app/types/TBoilers';
import { TContact } from '@app/types/TContact';
import { TUserState } from '@app/types/TUserData';
import { configureStore, Dictionary } from '@reduxjs/toolkit';
import createReducer from './rootReducer';

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./rootReducer', () => {
    const newRootReducer = require('./rootReducer').default;
    store.replaceReducer(newRootReducer.createReducer());
  });
}

const middlewares = [];

if (process.env.NODE_ENV === 'development') {
  const { createLogger } = require(`redux-logger`);
  const logger = createLogger({ collapsed: (getState, action, logEntry) => !logEntry.error });
  //@ts-ignore
  middlewares.push(logger);
}

const store = configureStore({
  reducer: createReducer(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).concat(middlewares),
  devTools: process.env.NODE_ENV === 'development',
});

//@ts-ignore
store.asyncReducers = {};

export const injectReducer = (key, reducer) => {
  //@ts-ignore
  if (store.asyncReducers[key]) {
    return false;
  }
  //@ts-ignore
  store.asyncReducers[key] = reducer;
  //@ts-ignore
  store.replaceReducer(createReducer(store.asyncReducers));
  return store;
};

type TBoilersState = {
  entities: Dictionary<TBoiler>;
  ids: string[];
};

type TcontactsState = {
  entities: Dictionary<TContact>;
  ids: string[];
};

type TContactsState = {
  entities: Dictionary<TContact>;
  ids: string[];
  searchText: string;
};

export type RootState = {
  fuse: any;
  user: TUserState;
  userBoilers: TBoilersState;
  adminBoilers: TBoilersState;
  contacts: TcontactsState;
};
export type AppDispatch = typeof store.dispatch;

export default store;
