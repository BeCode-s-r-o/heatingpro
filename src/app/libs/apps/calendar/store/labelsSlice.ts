import { createAsyncThunk, createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { db } from 'src/firebase-config';
import axios from 'axios';
import _ from '@lodash';
import { TLabel } from '@app/types/TEvent';

export const getLabels = createAsyncThunk<TLabel[]>('calendarApp/labels/getLabels', async () => {
  const labels = await getDocs(collection(db, 'calendar-labels'));
  const data = labels.docs.map((label) => label.data());
  return data as TLabel[];
});

export const addLabel = createAsyncThunk<TLabel, TLabel, {}>(
  'calendarApp/labels/addLabel',
  async (newLabel: TLabel, { dispatch }) => {
    try {
      const labelRef = doc(db, 'calendar-labels', newLabel.id);
      setDoc(labelRef, newLabel);
    } catch (error) {
      return Promise.reject(error);
    }

    return newLabel;
  }
);

export const updateLabel = createAsyncThunk<TLabel, TLabel, {}>(
  'calendarApp/labels/updateLabel',
  async (label, { dispatch }) => {
    try {
      const labelRef = doc(db, 'calendar-labels', label.id);
      await updateDoc(labelRef, label);
    } catch (error) {
      return Promise.reject(error);
    }

    return label;
  }
);

export const removeLabel = createAsyncThunk<string, string, {}>(
  'calendarApp/labels/removeLabel',
  async (labelId, { dispatch }) => {
    try {
      const labelRef = doc(db, 'calendar-labels', labelId);
      await deleteDoc(labelRef);
    } catch (error) {
      return Promise.reject(error);
    }

    return labelId;
  }
);

const labelsAdapter = createEntityAdapter<TLabel>({});

export const {
  selectAll: selectLabels,
  selectIds: selectLabelIds,
  selectById: selectLabelById,
} = labelsAdapter.getSelectors((state: TLabel) => state.calendarApp.labels);

interface LabelsState {
  selectedLabels: string[];
  labelsDialogOpen: boolean;
}

const labelsSlice = createSlice({
  name: 'calendarApp/labels',
  initialState: labelsAdapter.getInitialState<LabelsState>({
    selectedLabels: [],
    labelsDialogOpen: false,
  }),
  reducers: {
    toggleSelectedLabels: (state, action: PayloadAction<string>) => {
      state.selectedLabels = _.xor(state.selectedLabels, [action.payload]);
    },
    openLabelsDialog: (state) => {
      state.labelsDialogOpen = true;
    },
    closeLabelsDialog: (state) => {
      state.labelsDialogOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLabels.fulfilled, (state, action) => {
        labelsAdapter.setAll(state, action.payload);
        state.selectedLabels = action.payload.map((item) => item.id);
      })
      .addCase(addLabel.fulfilled, labelsAdapter.addOne)
      .addCase(updateLabel.fulfilled, labelsAdapter.upsertOne)
      .addCase(removeLabel.fulfilled, labelsAdapter.removeOne);
  },
});

export const selectSelectedLabels = ({ calendarApp }) => calendarApp.labels.selectedLabels;
export const selectFirstLabelId = ({ calendarApp }) => calendarApp.labels.ids[0];
export const selectLabelsDialogOpen = ({ calendarApp }) => calendarApp.labels.labelsDialogOpen;

export const { toggleSelectedLabels, openLabelsDialog, closeLabelsDialog } = labelsSlice.actions;

export default labelsSlice.reducer;
