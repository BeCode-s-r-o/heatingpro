/* eslint import/no-extraneous-dependencies: off */
import { TContact, TUserRoles } from '@app/types/TContact';
import { TUserState } from '@app/types/TUserData';
import history from '@history';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '.';

export const setUser = createAsyncThunk('user/setUser', async (user: TContact) => {
  const userData: TUserState = {
    role: user.role,
    data: user,
  };
  return userData;
});

export const logoutUser = createAsyncThunk('user/logoutUser', async (dispatch) => {
  history.push({
    pathname: '/prihlasenie',
  });
});

const initialState: TUserState = {
  role: TUserRoles.none,
  data: undefined,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(logoutUser.fulfilled, (state) => {
      return initialState;
    });
    builder.addCase(setUser.fulfilled, (state, action: PayloadAction<TUserState>) => {
      return action.payload;
    });
  },
});

export const selectUser = (state: RootState) => state.user;

export const selectUserShortcuts = ({ user }) => user.data.shortcuts;

export default userSlice.reducer;
