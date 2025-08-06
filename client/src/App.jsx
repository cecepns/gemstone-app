// ANCHOR: Main App Component with Router Configuration and Authentication
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Components
import HomePage from './components/HomePage'
import VerificationPage from './components/VerificationPage'

// Pages
import LoginPage from './pages/LoginPage'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          
          {/* Home Page Route */}
          <Route 
            path="/" 
            element={<HomePage />} 
          />
          
          {/* Verification Page Route with dynamic ID parameter */}
          <Route 
            path="/verify/:id" 
            element={<VerificationPage />} 
          />
          
          {/* Admin Login Page */}
          <Route 
            path="/login" 
            element={<LoginPage />} 
          />
          
          {/* Protected Admin Routes */}
          
          {/* Admin Dashboard - Protected Route */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch-all route for 404 pages */}
          <Route 
            path="*" 
            element={
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                  <p className="text-gray-600 mb-6">Halaman tidak ditemukan</p>
                  <a 
                    href="/" 
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                  >
                    Kembali ke Beranda
                  </a>
                </div>
              </div>
            } 
          />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
