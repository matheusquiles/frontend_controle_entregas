import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  formData: {
    motoboy: '',
    edress: '',
  },
  options: {},
  invalidFields: [],
  isLoading: false,
  isEditing: false,
  isUpdating: false,
  notification: { message: '', severity: 'info' },
  activeComponent: null,
  tableData: [],
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    startForm: (state) => {
      Object.assign(state, initialState);
      state.isEditing = true;
    },
    setUpdating: (state, action) => {
      state.isUpdating = action.payload;
    },
    setFormData: (state, action) => {
      const newData = action.payload.formData ? action.payload.formData : action.payload;
      state.formData = { ...state.formData, ...newData };
    },
    setNotification: (state, action) => {
      state.notification = action.payload;
    },
    clearNotification: (state) => {
      state.notification = { message: '', severity: 'info' };
    },
    setOptions: (state, action) => {
      const { route, options } = action.payload;
      state.options[route] = options;
    },
    setInvalidFields: (state, action) => {
      state.invalidFields = Array.isArray(action.payload) ? action.payload : [];
    },
    resetInvalidFields: (state) => {
      state.invalidFields = [];
    },
    setErrorMessage: (state, action) => {
      state.errorMessage = action.payload;
    },
    resetForm: (state) => {
      return {
        ...initialState,
        isLoading: state.isLoading,
        isEditing: state.isEditing,
        notification: state.notification,
      };
    },
    setIsValidResponse: (state, action) => {
      state.isValidResponse = action.payload;
    },
    setEditing: (state, action) => {
      state.isEditing = action.payload;
    },
    setActiveComponent: (state, action) => {
      state.activeComponent = action.payload;
    },
    setTableData: (state, action) => {
      state.tableData = action.payload;
    },
    resetTableData: (state) => {
      state.tableData = [];
    },
  },
});

export const {
  setLoading,
  startForm,
  setFormData,
  setOptions,
  setInvalidFields,
  resetInvalidFields,
  setErrorMessage,
  resetForm,
  setIsValidResponse,
  setEditing,
  setUpdating,
  setNotification,
  clearNotification,
  setActiveComponent,
  setTableData,
  resetTableData,
} = formSlice.actions;
export default formSlice.reducer;