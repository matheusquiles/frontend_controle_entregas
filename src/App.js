import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import store from './redux/store';
import SignIn from './pages/SingIn.js';
import Home from './components/Home.js';
import CreateCollect from './pages/createCollect.js';
import NovoUsuario from './pages/NovoUsuario.js';
import Deliveries from './pages/Deliveries.js';
import PrivateRoute from './routes/PrivateRoute.js';
import UnauthorizedScreen from './pages/UnauthorizedScreen.js';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<SignIn />} />
          
          {/* Rotas privadas (qualquer usuário autenticado) */}
          <Route element={<PrivateRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/coletas" element={<CreateCollect />} />
            <Route path="/unauthorized" element={<UnauthorizedScreen />} />

          </Route>

          {/* Rotas privadas com controle de acesso por role */}
          <Route element={<PrivateRoute allowedRoles={['ADMIN', 'LEADER']} />}>
            <Route path="/usuarios/novo" element={<NovoUsuario />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles={['ADMIN']} />}>
            <Route path="/entregas/aprovar" element={<Deliveries />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
