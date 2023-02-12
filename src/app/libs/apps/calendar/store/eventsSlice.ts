import { TEvent } from '@app/types/TEvent';
import { createAsyncThunk, createEntityAdapter, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import formatISO from 'date-fns/formatISO';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from 'src/firebase-config';
import { selectSelectedLabels } from './labelsSlice';

export const dateFormat = 'YYYY-MM-DDTHH:mm:ss.sssZ';

export const getEvents = createAsyncThunk<TEvent[]>('calendarApp/events/getEvents', async () => {
  const events = await getDocs(collection(db, 'calendar-events'));
  const data = events.docs.map((event) => event.data()) as TEvent[];
  return data;
});

export const addEvent = createAsyncThunk<TEvent, TEvent>('calendarApp/events/addEvent', async (newEvent) => {
  try {
    const eventRef = doc(db, 'calendar-events', newEvent.id);
    await setDoc(eventRef, newEvent);
  } catch (error) {}

  return newEvent;
});

export const updateEvent = createAsyncThunk<TEvent, TEvent>('calendarApp/events/updateEvent', async (event) => {
  try {
    const eventRef = doc(db, 'calendar-events', event.id);
    await updateDoc(eventRef, event);
  } catch (error) {}

  return event;
});

export const removeEvent = createAsyncThunk<string, string>('calendarApp/events/removeEvent', async (eventId) => {
  try {
    const eventRef = doc(db, 'calendar-events', eventId);
    await deleteDoc(eventRef);
  } catch (error) {}

  return eventId;
});

const eventsAdapter = createEntityAdapter<TEvent>({});

export const {
  selectAll: selectEvents,
  selectIds: selectEventIds,
  selectById: selectEventById,
} = eventsAdapter.getSelectors((state: { calendarApp: { events: any } }) => state.calendarApp.events);

interface EventDialogState {
  type: 'new' | 'edit';
  props: {
    open: boolean;
    anchorPosition: { top: number; left: number };
  };
  data: TEvent | null;
}

interface EventsState {
  eventDialog: EventDialogState;
}

const eventsSlice = createSlice({
  name: 'calendarApp/events',
  initialState: eventsAdapter.getInitialState<EventsState>({
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
      prepare: (selectInfo: { start: Date; end: Date; jsEvent: MouseEvent }) => {
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
        } as EventDialogState;
        return { payload };
      },
      reducer: (state, action: PayloadAction<EventDialogState>) => {
        state.eventDialog = action.payload;
      },
    },
    openEditEventDialog: {
      prepare: (clickInfo: { start: Date; end: Date; jsEvent: MouseEvent; event: TEvent }) => {
        const { jsEvent, event } = clickInfo;
        const { id, title, allDay, start, end, extendedProps } = event;
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
      reducer: (state: any, action: any) => {
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

  extraReducers: (builder) => {
    builder
      .addCase(getEvents.fulfilled, (state, action) => {
        eventsAdapter.setAll(state, action.payload);
      })
      .addCase(addEvent.fulfilled, (state, action) => {
        eventsAdapter.addOne(state, action.payload);
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        eventsAdapter.upsertOne(state, action.payload);
      })
      .addCase(removeEvent.fulfilled, (state, action) => {
        eventsAdapter.removeOne(state, action.payload);
      });
  },
});

export const { openNewEventDialog, closeNewEventDialog, openEditEventDialog, closeEditEventDialog } =
  eventsSlice.actions;

export const selectFilteredEvents = createSelector(
  [selectSelectedLabels, selectEvents],
  (selectedLabels: string[], events: TEvent[]) => {
    return events.filter((item) => selectedLabels.includes(item.extendedProps.label));
  }
);

export const selectEventDialog = ({ calendarApp }) => calendarApp.events.eventDialog;

export default eventsSlice.reducer;
