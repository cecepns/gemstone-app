// ANCHOR: Main App Component with Router Configuration and Authentication
import { Toaster } from 'react-hot-toast';
import { Routes, Route } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext.jsx';
import AdminLayout from './layouts/AdminLayout';
import PublicLayout from './layouts/PublicLayout';
import AddGemstone from './pages/AddGemstone';
import AdminDashboard from './pages/AdminDashboard';
import AdminSettings from './pages/AdminSettings';
import EditGemstone from './pages/EditGemstone';
import GemstoneDetail from './pages/GemstoneDetail';
import GemstoneList from './pages/GemstoneList';
import Home from './pages/Home';
import Login from './pages/Login';
import Verification from './pages/Verification';
import VerificationManagement from './pages/VerificationManagement';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="verify/:id" element={<Verification />} />
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
            <Route path="gemstones/:id" element={<GemstoneDetail />} />
            <Route path="gemstones/:id/edit" element={<EditGemstone />} />
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
    </AuthProvider>
  );
}

export default App;
