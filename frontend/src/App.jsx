import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { UsuarioProvider } from './context/UsuarioContext'
import MapaPage from './pages/MapaPage'
import DetalleSucesoPage from './pages/DetalleSucesoPage'
import DestinoPage from './pages/DestinoPage'
import LoginSimple from './components/UI/LoginSimple'

function App() {
  return (
    <UsuarioProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MapaPage />} />
          <Route path="/suceso/:slug" element={<DetalleSucesoPage />} />
          <Route path="/destino" element={<DestinoPage />} />
        </Routes>

        {/* Modal de login global — se activa desde cualquier componente */}
        <LoginSimple />
      </BrowserRouter>
    </UsuarioProvider>
  )
}

export default App
