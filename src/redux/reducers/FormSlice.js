import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  formData: {},
  selectedPedidos: [],
  options: {},
  invalidFields: [],
  isLoading: false,
  isEditing: false,
  isUpdating: false,
  estadoSelecionado: '',
  cidadeSelecionada: '',
  notification: { message: '', severity: 'info' },
  activeComponent: null
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
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
    addPedido: (state, action) => {
      const newPedido = action.payload;
      if (!state.selectedPedidos.some(p => p.id === newPedido.id)) {
        state.selectedPedidos.push(newPedido);
        state.formData.pedido = state.selectedPedidos.map(item => ({
          idPedido: item.idPedido || null,
          idTipoPedido: item.id,
        }));
      }
    },
    removePedido: (state, action) => {
      const pedidoId = action.payload;
      state.selectedPedidos = state.selectedPedidos.filter(p => p.id !== pedidoId);
      state.formData.pedido = state.selectedPedidos.map(item => ({
        idPedido: item.idPedido || null,
        idTipoPedido: item.id,
        descricao: item.name,
      }));
    },
    setSelectedPedidos: (state, action) => {
      state.selectedPedidos = action.payload;
      state.formData.pedido = action.payload.map(item => ({
        tipoPedido: item.idTipoPedido,
        descricao: item.descricao,
      }));
    },
    setOptions: (state, action) => {
      const { route, options } = action.payload;
      state.options[route] = options;
    },
    setInvalidFields: (state, action) => {
      state.invalidFields = action.payload;
    },
    setErrorMessage: (state, action) => {
      state.errorMessage = action.payload;
    },
    resetForm: (state) => {
      Object.assign(state, initialState);
    },
    setIsValidResponse: (state, action) => {
      state.isValidResponse = action.payload;
    },
    setEditing: (state) => {
      state.isEditing = !state.isEditing;
    },
    setEstadoSelecionado: (state, action) => {
      state.estadoSelecionado = action.payload;
      state.formData.estado = action.payload;
    },
    setCidadeSelecionada: (state, action) => {
      state.cidadeSelecionada = action.payload;
      state.formData.cidade = action.payload;
    },
    setActiveComponent: (state, action) => {
      state.activeComponent = action.payload;
    },
  },
});

export const {
  setLoading,
  setFormData,
  setOptions,
  setSelectedPedidos,
  addPedido,
  removePedido,
  setInvalidFields,
  setErrorMessage,
  resetForm,
  setIsValidResponse,
  setEditing,
  setUpdating,
  setEstadoSelecionado,
  setCidadeSelecionada,
  setNotification,
  clearNotification,
  setActiveComponent 
} = formSlice.actions;
export default formSlice.reducer;
