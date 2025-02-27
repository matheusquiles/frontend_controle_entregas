import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import store from './redux/store';
import SignIn from './pages/SingIn.js';
import Home from './components/Home.js';
import CreateCollect from './pages/createCollect.js';
import NovoUsuario from './pages/NovoUsuario.js';

function App() {
  return (

    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/home" element={<Home />} />
          <Route path="/coletas" element={<CreateCollect />} />
          <Route path="/usuarios/novo" element={<NovoUsuario />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
