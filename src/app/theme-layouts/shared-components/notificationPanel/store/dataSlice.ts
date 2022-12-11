import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";

export const getNotifications = createAsyncThunk(
  "notificationPanel/getData",
  async () => {
    const response = await axios.get("/api/notifications");
    const data = await response.data;

    return data;
  }
);

export const dismissAll = createAsyncThunk(
  "notificationPanel/dismissAll",
  async () => {
    const response = await axios.delete("/api/notifications");
    await response.data;

    return true;
  }
);

export const dismissItem = createAsyncThunk(
  "notificationPanel/dismissItem",
  async (id) => {
    const response = await axios.delete(`/api/notifications/${id}`);
    await response.data;

    return id;
  }
);

export const addNotification = createAsyncThunk(
  "notificationPanel/addNotification",
  async (item) => {
    //@ts-ignore
    const response = await axios.post(`/api/notifications`, { ...item });
    const data = await response.data;

    return data;
  }
);

const notificationsAdapter = createEntityAdapter({});

const initialState = notificationsAdapter.upsertMany(
  notificationsAdapter.getInitialState(),
  []
);

export const {
  selectAll: selectNotifications,
  selectById: selectNotificationsById,
} =
  //@ts-ignore
  notificationsAdapter.getSelectors((state) => state.notificationPanel.data);

const dataSlice = createSlice({
  name: "notificationPanel/data",
  initialState,
  reducers: {},
  extraReducers: {
    //@ts-ignore
    [dismissItem.fulfilled]: (state, action) =>
      notificationsAdapter.removeOne(state, action.payload),
    //@ts-ignore
    [dismissAll.fulfilled]: (state, action) =>
      notificationsAdapter.removeAll(state),
    //@ts-ignore
    [getNotifications.fulfilled]: (state, action) =>
      notificationsAdapter.addMany(state, action.payload),
    //@ts-ignore
    [addNotification.fulfilled]: (state, action) =>
      notificationsAdapter.addOne(state, action.payload),
  },
});

export default dataSlice.reducer;
