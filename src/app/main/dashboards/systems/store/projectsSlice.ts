import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const getProjects = createAsyncThunk('projectDashboardApp/projects/getProjects', async () => {
  const response = await axios.get('/api/dashboards/project/projects');
  return response.data;
});

const projectsAdapter = createEntityAdapter({});

export const {
  selectAll: selectProjects,
  selectEntities: selectProjectsEntities,
  selectById: selectProjectById,
} = projectsAdapter.getSelectors((state: any) => state.projectDashboardApp.projects);

const projectsSlice = createSlice({
  name: 'admin/projects',
  initialState: projectsAdapter.getInitialState(),
  reducers: {},
  extraReducers: {
    [getProjects.fulfilled as any]: projectsAdapter.setAll,
  },
});

export default projectsSlice.reducer;
