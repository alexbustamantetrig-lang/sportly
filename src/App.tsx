import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom'
import { AppProvider } from './state/AppContext'
import { Layout } from './components/Layout'
import { FeedScreen } from './screens/FeedScreen'
import { ExploreScreen } from './screens/ExploreScreen'
import { MonitorScreen } from './screens/MonitorScreen'
import { BookingFlowScreen } from './screens/BookingFlowScreen'
import { BookingsScreen, BookingDetailScreen } from './screens/BookingsScreen'
import { FavoritesScreen } from './screens/FavoritesScreen'
import { ProfileScreen } from './screens/ProfileScreen'
import { EmptyState } from './components/ui'

// En entornos sin URLs propias (p. ej. una página incrustada) se usa un router en memoria.
const Router = import.meta.env.VITE_ROUTER === 'memory' ? MemoryRouter : BrowserRouter

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<FeedScreen />} />
            <Route path="explorar" element={<ExploreScreen />} />
            <Route path="monitor/:id" element={<MonitorScreen />} />
            <Route path="reservar/:id" element={<BookingFlowScreen />} />
            <Route path="reservas" element={<BookingsScreen />} />
            <Route path="reservas/:id" element={<BookingDetailScreen />} />
            <Route path="favoritos" element={<FavoritesScreen />} />
            <Route path="perfil" element={<ProfileScreen />} />
            <Route path="*" element={<EmptyState emoji="🧭" title="Página no encontrada" text="Vuelve al inicio para seguir descubriendo monitores." />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  )
}
