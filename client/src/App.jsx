// ANCHOR: Main App Component with Router Configuration and Authentication
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Layouts
import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'

// Components
import VerificationPage from './components/VerificationPage'
import AddGemstone from './pages/AddGemstone'

// Pages
import Home from './pages/Home'
import GemstoneList from './pages/GemstoneList'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import VerificationManagement from './pages/VerificationManagement'
import AdminSettings from './pages/AdminSettings'

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="verify/:id" element={<VerificationPage />} />
            <Route path="login" element={<Login />} />
          </Route>
          
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="gemstones" element={<GemstoneList />} />
            <Route path="gemstones/add" element={<AddGemstone />} />
            <Route path="verifications" element={<VerificationManagement />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          
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
