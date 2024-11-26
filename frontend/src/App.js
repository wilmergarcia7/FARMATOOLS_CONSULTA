import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Consulta from './components/Consulta';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
    return (
        <Router>
            <Routes>
                {/* Redirigir la raíz (/) a /login */}
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/consulta" element={<Consulta />} />
                {/* Ruta para manejar páginas no encontradas */}
                <Route path="*" element={<h1>Página no encontrada</h1>} />
            </Routes>
        </Router>
    );
}

export default App;
