import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Applications from './pages/Applications'
import Companies from './pages/Companies'
import Jobs from './pages/Jobs'
import Interviews from './pages/Interviews'

const queryClient = new QueryClient()

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token')
  return token ? <>{children}</> : <Navigate to="/login" />
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/applications" element={
            <PrivateRoute>
              <Applications />
            </PrivateRoute>
          } />
          <Route path="/companies" element={
            <PrivateRoute>
              <Companies />
            </PrivateRoute>
          } />          
          <Route path="/jobs" element={
            <PrivateRoute>
              <Jobs />
            </PrivateRoute>
          } />
          <Route path="/interviews" element={
            <PrivateRoute>
              <Interviews />
            </PrivateRoute>
          } />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
