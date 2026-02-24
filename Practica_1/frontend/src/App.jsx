
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Login from './pages/Login/Login.jsx';
import Registrar_Usuario from './pages/RegistroUsuario/RegistrarUsuario';
import Cartelera from './pages/Cartelera/Cartelera';
import Editar_Usuario from './pages/EditarUsuario/EditarUsuario.jsx';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/registrar-usuario" element={<Registrar_Usuario />} />
            <Route path="/cartelera" element={<Cartelera />} />
            <Route path="/editar-informacion" element={<Editar_Usuario />} />
            <Route path="*" element={<center><h1>404 Not Found</h1></center>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
