
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Login from './pages/Login/Login';
import Registrar_Usuario from './pages/RegistroUsuario/RegistrarUsuario';
import Cartelera from './pages/Cartelera/Cartelera';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/registrar-usuario" element={<Registrar_Usuario />} />
            <Route path="/cartelera" element={<Cartelera />} />
            <Route path="*" element={<center><h1>404 Not Found</h1></center>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
