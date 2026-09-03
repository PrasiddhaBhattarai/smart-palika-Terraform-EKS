import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ComplaintProvider } from './context/ComplaintContext'
import ComplaintRatings from './pages/ComplaintRating'

// Layout Components
import MainLayout from './components/Layout/MainLayout'
import AuthLayout from './components/Layout/AuthLayout'

// Page Components
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import Complaints from './pages/Complaints'
import SubmitComplaint from './pages/SubmitComplaint'
import AdminDashboard from './pages/AdminDashboard'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import ComplaintDetails from './pages/ComplaintDetails'
import AdminComplaints from './pages/AdminComplaints';
import ComplaintsSearch from './pages/ComplaintsSearch';

// Protected Route Component
import ProtectedRoute from './components/common/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <ComplaintProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<MainLayout><Home /></MainLayout>} />
              <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
              <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />
              <Route path="/forgot-password" element={<AuthLayout><ForgotPassword /></AuthLayout>} />
              <Route path="/reset-password" element={<AuthLayout><ResetPassword /></AuthLayout>} />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <MainLayout><Dashboard /></MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/complaints" element={
                <ProtectedRoute>
                  <MainLayout><Complaints /></MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/complaints/:id" element={
                <ProtectedRoute>
                  <MainLayout><ComplaintDetails /></MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/submit-complaint" element={
                <ProtectedRoute>
                  <MainLayout><SubmitComplaint /></MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <MainLayout><Profile /></MainLayout>
                </ProtectedRoute>
              } /> 
              {/* Protected User Routes
               */}
               <Route path="/search-complaints" element={
  <ProtectedRoute>
    <MainLayout><ComplaintsSearch /></MainLayout>
  </ProtectedRoute>
} />
              
              <Route path="/admin" element={
                <ProtectedRoute adminOnly>
                  <MainLayout><AdminDashboard /></MainLayout>
                </ProtectedRoute>
              } /> 
              {/* Admin Routes
               */}
               <Route path="/admin/complaints" element={
  <ProtectedRoute adminOnly>
    <MainLayout><AdminComplaints /></MainLayout>
  </ProtectedRoute>
} />



<Route path="/complaints/:id/ratings" element={
  <ProtectedRoute>
    <MainLayout><ComplaintRatings /></MainLayout>
  </ProtectedRoute>
} />

              
              {/* 404 Page */}
              <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
            </Routes>
            
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </Router>
      </ComplaintProvider>
    </AuthProvider>
  )
}

export default App