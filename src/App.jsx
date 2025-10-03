import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './components/layout/DashboardLayout'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Home from './pages/dashboard/Home'
import Products from './pages/dashboard/Products'
import Inventory from './pages/dashboard/Inventory'
import ProductDetail from './pages/dashboard/ProductDetail'

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected dashboard routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="products" element={<Products />} />
            <Route path="products/:id" element={<ProductDetail />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="products/inventory" element={<Inventory />} />
            <Route path="orders" element={<div>Orders Page</div>} />
            <Route path="rfqs" element={<div>RFQs Page</div>} />
            <Route path="discounts" element={<div>Discounts Page</div>} />
            <Route path="analytics" element={<div>Analytics Page</div>} />
            <Route path="support" element={<div>Support Page</div>} />
            <Route path="settings" element={<div>Settings Page</div>} />
          </Route>
          
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </Provider>
  )
}

export default App
