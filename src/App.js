import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import store from './redux/store';
import SignIn from './pages/SingIn.js';
import Home from './components/Home.js';
import CreateCollect from './pages/createCollect.js';
import NovoUsuario from './pages/NovoUsuario.js';
import SearchUser from './pages/SearchUser.js';
import EditUser from './pages/EditUser.js'; 
import AprovarColetas from './pages/AprovarColetas.js';
import PrivateRoute from './routes/PrivateRoute.js';
import UnauthorizedScreen from './pages/UnauthorizedScreen.js';
import CreateEdress from './pages/CreateEdress.js';
import SearchAddress from './pages/SearchAddress.js';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<SignIn />} />
          
          {/* Rotas privadas (qualquer usuário autenticado) */}
          <Route element={<PrivateRoute />}>
            <Route path="/unauthorized" element={<UnauthorizedScreen />} />
          </Route>

          {/* Rotas privadas com controle de acesso por role */}
          <Route element={<PrivateRoute allowedRoles={['ADMIN', 'LEADER']} />}>
            <Route path="/home" element={<Home />} />
            <Route path="/coletas/nova" element={<CreateCollect />} />
            <Route path="/usuarios/novo" element={<NovoUsuario />} />
            <Route path="/usuarios/editar/:id" element={<EditUser />} /> 
            <Route path="/usuarios/editar" element={<SearchUser />} /> 
            <Route path="/enderecos/novo" element={<CreateEdress />} /> 
            <Route path="/enderecos/editar" element={<SearchAddress />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles={['ADMIN']} />}>
            <Route path="/coletas/aprovar" element={<AprovarColetas />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;