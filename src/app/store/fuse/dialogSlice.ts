import { createSlice } from "@reduxjs/toolkit";

const dialogSlice = createSlice({
  name: "dialog",
  initialState: {
    state: false,
    options: {
      children: "Hi",
    },
  },
  reducers: {
    openDialog: (state, action) => {
      state.state = true;
      state.options = action.payload;
    },
    closeDialog: (state) => {
      state.state = false;
    },
  },
});

export const { openDialog, closeDialog } = dialogSlice.actions;

export const selectFuseDialogState = ({ store }: any) => store.dialog.state;

export const selectFuseDialogOptions = ({ store }: any) => store.dialog.options;

export default dialogSlice.reducer;
