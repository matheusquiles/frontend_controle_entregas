import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import Frame from './components/frame.js';

function App() {
  return (

      <Provider store={store}>
        <Frame />
      </Provider>
  );
}

export default App;
