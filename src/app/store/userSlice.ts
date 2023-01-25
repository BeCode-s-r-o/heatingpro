/* eslint import/no-extraneous-dependencies: off */
import { TContact } from '@app/types/TContact';
import { TUserData } from '@app/types/TUserData';
import history from '@history';
import _ from '@lodash';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setInitialSettings } from 'app/store/slices/settingsSlice';
import { settingsConfig } from 'app/config/settingsConfig';

interface IUserState {
  role: string[];
  data: {
    displayName: string;
    photoURL: string;
    email: string;
    shortcuts: string[];
    settings?: any;
  };
}

export const setUser = createAsyncThunk('user/setUser', async (user: TContact) => {
  const roles = { admin: 'Admin', user: 'Zákazník', guest: 'Hosť' };
  /*
    You can redirect the logged-in user to a specific route depending on his role
    */

  if (user.role === 'user') {
    settingsConfig.loginRedirectUrl = '/pouzivatelske-systemy/';
  }

  const userData: TUserData = {
    role: [Object.keys(roles).find((key) => user.role === key) || 'guest'], // guest
    data: {
      ...user,
      displayName: user.name,
      photoURL: 'assets/images/avatars/brian-hughes.jpg',
      shortcuts: ['apps.calendar', 'apps.mailbox', 'apps.contacts', 'apps.tasks'],
    },
  };
  return userData;
});

export const updateUserSettings = createAsyncThunk('user/updateSettings', async (settings, { dispatch, getState }) => {
  //@ts-ignore
  const { user } = getState();
  const newUser = _.merge({}, user, { data: { settings } });

  return newUser;
});

export const logoutUser = () => async (dispatch, getState) => {
  const { user } = getState();

  if (!user.role || user.role.length === 0) {
    // is guest
    return null;
  }

  history.push({
    pathname: '/',
  });

  dispatch(setInitialSettings());

  return dispatch(userLoggedOut());
};

const initialState: IUserState = {
  role: [], // guest
  data: {
    displayName: 'John Doe',
    photoURL: 'assets/images/avatars/brian-hughes.jpg',
    email: 'johndoe@withinpixels.com',
    shortcuts: ['apps.calendar', 'apps.mailbox', 'apps.contacts', 'apps.tasks'],
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userLoggedOut: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUserSettings.fulfilled, (state, action: PayloadAction<IUserState>) => {
        return action.payload;
      })
      .addCase(setUser.fulfilled, (state, action: PayloadAction<IUserState>) => {
        return action.payload;
      });
  },
});

export const { userLoggedOut } = userSlice.actions;

export const selectUser = ({ user }) => user;

export const selectUserShortcuts = ({ user }) => user.data.shortcuts;

export default userSlice.reducer;
