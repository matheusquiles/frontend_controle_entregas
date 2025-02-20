import { configureStore } from '@reduxjs/toolkit';
import formSlice from './reducers/FormSlice.js'; 

console.log('formSlice:', formSlice); // <-- Adicione isto

const store = configureStore({
  reducer: {
    form: formSlice,
  },
});


export default store;