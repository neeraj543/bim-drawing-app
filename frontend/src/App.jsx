import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { PrivateRoute } from './components/PrivateRoute'
import { AdminRoute } from './components/AdminRoute'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import ProjectDetails from './pages/ProjectDetails'
import Tasks from './pages/Tasks'
import Timesheet from './pages/Timesheet'
import CRM from './pages/CRM'
import Login from './pages/Login'
import UserManagement from './pages/UserManagement'
import Offertes from './pages/Offertes'
import OfferteDetail from './pages/OfferteDetail'
import OfferteForm from './pages/OfferteForm'
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
              path="/tasks"
              element={
                <PrivateRoute>
                  <Tasks />
                </PrivateRoute>
              }
            />
            <Route
              path="/timesheet"
              element={
                <PrivateRoute>
                  <Timesheet />
                </PrivateRoute>
              }
            />
            <Route
              path="/crm"
              element={
                <PrivateRoute>
                  <CRM />
                </PrivateRoute>
              }
            />
            <Route
              path="/offertes"
              element={
                <PrivateRoute>
                  <Offertes />
                </PrivateRoute>
              }
            />
            <Route
              path="/offertes/new"
              element={
                <PrivateRoute>
                  <OfferteForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/offertes/:id/edit"
              element={
                <PrivateRoute>
                  <OfferteForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/offertes/:id"
              element={
                <PrivateRoute>
                  <OfferteDetail />
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
