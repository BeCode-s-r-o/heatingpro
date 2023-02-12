import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { db } from 'src/firebase-config';
import axios from 'axios';
import _ from '@lodash';
import { TLabel } from '@app/types/TEvent';

export const getLabels = createAsyncThunk('calendarApp/labels/getLabels', async () => {
  const labels = await getDocs(collection(db, 'calendar-labels'));
  const data = labels.docs.map((label) => label.data());
  return data;
});

export const addLabel = createAsyncThunk('calendarApp/labels/addLabel', async (newLabel: TLabel, { dispatch }) => {
  try {
    const labelRef = doc(db, 'calendar-labels', newLabel.id);
    setDoc(labelRef, newLabel);
  } catch (error) {
    return error;
  }

  return newLabel;
});

export const updateLabel = createAsyncThunk('calendarApp/labels/updateLabel', async (label: TLabel, { dispatch }) => {
  try {
    const labelRef = doc(db, 'calendar-labels', label.id);
    updateDoc(labelRef, label);
  } catch (error) {
    return error;
  }

  return label;
});

export const removeLabel = createAsyncThunk('calendarApp/labels/removeLabel', async (labelId: string, { dispatch }) => {
  try {
    const labelRef = doc(db, 'calendar-labels', labelId);
    deleteDoc(labelRef);
  } catch (error) {
    return error;
  }

  return labelId;
});

const labelsAdapter = createEntityAdapter({});

export const {
  selectAll: selectLabels,
  selectIds: selectLabelIds,
  selectById: selectLabelById, //@ts-ignore
} = labelsAdapter.getSelectors((state) => state.calendarApp.labels);

const labelsSlice = createSlice({
  name: 'calendarApp/labels',
  initialState: labelsAdapter.getInitialState({
    selectedLabels: [],
    labelsDialogOpen: false,
  }),
  reducers: {
    toggleSelectedLabels: (state, action) => {
      state.selectedLabels = _.xor(state.selectedLabels, [action.payload]);
    },
    openLabelsDialog: (state, action) => {
      state.labelsDialogOpen = true;
    },
    closeLabelsDialog: (state, action) => {
      state.labelsDialogOpen = false;
    },
  },
  extraReducers: {
    //@ts-ignore
    [getLabels.fulfilled]: (state, action) => {
      labelsAdapter.setAll(state, action.payload);
      state.selectedLabels = action.payload.map((item) => item.id);
    }, //@ts-ignore
    [addLabel.fulfilled]: labelsAdapter.addOne, //@ts-ignore
    [updateLabel.fulfilled]: labelsAdapter.upsertOne, //@ts-ignore
    [removeLabel.fulfilled]: labelsAdapter.removeOne,
  },
});

export const selectSelectedLabels = ({ calendarApp }) => calendarApp.labels.selectedLabels;
export const selectFirstLabelId = ({ calendarApp }) => calendarApp.labels.ids[0];
export const selectLabelsDialogOpen = ({ calendarApp }) => calendarApp.labels.labelsDialogOpen;

export const { toggleSelectedLabels, openLabelsDialog, closeLabelsDialog } = labelsSlice.actions;

export default labelsSlice.reducer;
