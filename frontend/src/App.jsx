import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { UsuarioProvider } from './context/UsuarioContext'
import MapaPage from './pages/MapaPage'
import DetalleSucesoPage from './pages/DetalleSucesoPage'
import LoginSimple from './components/UI/LoginSimple'

function App() {
  return (
    <UsuarioProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MapaPage />} />
          <Route path="/suceso/:slug" element={<DetalleSucesoPage />} />
        </Routes>

        {/* Modal de login global — se activa desde cualquier componente */}
        <LoginSimple />
      </BrowserRouter>
    </UsuarioProvider>
  )
}

export default App
