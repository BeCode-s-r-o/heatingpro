import { TEvent } from '@app/types/TEvent';
import { createAsyncThunk, createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import formatISO from 'date-fns/formatISO';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from 'src/firebase-config';
import { selectSelectedLabels } from './labelsSlice';

export const dateFormat = 'YYYY-MM-DDTHH:mm:ss.sssZ';

export const getEvents = createAsyncThunk('calendarApp/events/getEvents', async () => {
  const events = await getDocs(collection(db, 'calendar-events'));
  const data = events.docs.map((event) => event.data());
  return data;
});

export const addEvent = createAsyncThunk('calendarApp/events/addEvent', async (newEvent: TEvent) => {
  try {
    const eventRef = doc(db, 'calendar-events', newEvent.id);
    setDoc(eventRef, newEvent);
  } catch (error) {
    return error;
  }

  return newEvent;
});

export const updateEvent = createAsyncThunk('calendarApp/events/updateEvent', async (event: TEvent) => {
  try {
    const eventRef = doc(db, 'calendar-events', event.id);
    updateDoc(eventRef, event);
  } catch (error) {
    return error;
  }

  return event;
});

export const removeEvent = createAsyncThunk('calendarApp/events/removeEvent', async (eventId: string) => {
  try {
    const eventRef = doc(db, 'calendar-events', eventId);
    deleteDoc(eventRef);
  } catch (error) {
    return error;
  }

  return eventId;
});

const eventsAdapter = createEntityAdapter({});

export const {
  selectAll: selectEvents,
  selectIds: selectEventIds,
  selectById: selectEventById, //@ts-ignore
} = eventsAdapter.getSelectors((state) => state.calendarApp.events);

const eventsSlice = createSlice({
  name: 'calendarApp/events',
  initialState: eventsAdapter.getInitialState({
    eventDialog: {
      type: 'new',
      props: {
        open: false,
        anchorPosition: { top: 200, left: 400 },
      },
      data: null,
    },
  }),
  reducers: {
    openNewEventDialog: {
      //@ts-ignore
      prepare: (selectInfo) => {
        const { start, end, jsEvent } = selectInfo;
        const payload = {
          type: 'new',
          props: {
            open: true,
            anchorPosition: { top: jsEvent.pageY, left: jsEvent.pageX },
          },
          data: {
            start: formatISO(new Date(start)),
            end: formatISO(new Date(end)),
          },
        };
        return { payload };
      },
      reducer: (state, action) => {
        state.eventDialog = action.payload;
      },
    },
    openEditEventDialog: {
      //@ts-ignore
      prepare: (clickInfo) => {
        const { jsEvent, event } = clickInfo;
        const { id, title, allDay, start, end, extendedProps } = event;
        console.log(event, 'event');
        const payload = {
          type: 'edit',
          props: {
            open: true,
            anchorPosition: { top: jsEvent.pageY, left: jsEvent.pageX },
          },
          data: {
            id,
            title,
            allDay,
            deviceID: extendedProps.deviceID,
            extendedProps,
            start: formatISO(new Date(start)),
            end: formatISO(new Date(end)),
          },
        };
        return { payload };
      },
      reducer: (state, action) => {
        state.eventDialog = action.payload;
      },
    },
    closeNewEventDialog: (state) => {
      state.eventDialog = {
        type: 'new',
        props: {
          open: false,
          anchorPosition: { top: 200, left: 400 },
        },
        data: null,
      };
    },
    closeEditEventDialog: (state) => {
      state.eventDialog = {
        type: 'edit',
        props: {
          open: false,
          anchorPosition: { top: 200, left: 400 },
        },
        data: null,
      };
    },
  },

  extraReducers: {
    //@ts-ignore
    [getEvents.fulfilled]: eventsAdapter.setAll,
    //@ts-ignore
    [addEvent.fulfilled]: eventsAdapter.addOne,
    //@ts-ignore
    [updateEvent.fulfilled]: eventsAdapter.upsertOne,
    //@ts-ignore
    [removeEvent.fulfilled]: eventsAdapter.removeOne,
  },
});

export const { openNewEventDialog, closeNewEventDialog, openEditEventDialog, closeEditEventDialog } =
  eventsSlice.actions;
//@ts-ignore
export const selectFilteredEvents = createSelector(
  [selectSelectedLabels, selectEvents],
  (selectedLabels: string[], events: TEvent[]) => {
    return events.filter((item) => selectedLabels.includes(item.extendedProps.label));
  }
);

export const selectEventDialog = ({ calendarApp }) => calendarApp.events.eventDialog;

export default eventsSlice.reducer;
