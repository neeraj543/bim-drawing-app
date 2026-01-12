import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { PrivateRoute } from './components/PrivateRoute'
import { AdminRoute } from './components/AdminRoute'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import ProjectDetails from './pages/ProjectDetails'
import Login from './pages/Login'
import UserManagement from './pages/UserManagement'
import './App.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/projects/:id"
              element={
                <PrivateRoute>
                  <ProjectDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/users"
              element={
                <AdminRoute>
                  <UserManagement />
                </AdminRoute>
              }
            />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  )
}

export default App
