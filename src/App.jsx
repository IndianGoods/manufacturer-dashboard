import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './components/layout/DashboardLayout'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Home from './pages/dashboard/Home'
import Products from './pages/dashboard/Products'
import ProductsDemo from './pages/dashboard/ProductsDemo'
import CreateProduct from './pages/dashboard/CreateProduct'
import EditProduct from './pages/dashboard/EditProduct'
import BulkEditProducts from './pages/dashboard/BulkEditProducts'
import Orders from './pages/dashboard/Orders'
import Inventory from './pages/dashboard/Inventory'
import ProductDetail from './pages/dashboard/ProductDetail'
import OrderDetailPage from './pages/dashboard/orders/OrderDetailPage'
import Settings from './pages/dashboard/settings/Settings'
// import ChatSupportPage from './pages/dashboard/ChatBot'
import SupportTicketSystem from './pages/dashboard/SupportTicket'


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
            <Route path="products/new" element={<CreateProduct />} />
            <Route path="products/:id/edit" element={<EditProduct />} />
            <Route path="products/bulk-edit" element={<BulkEditProducts />} />
            <Route path="products/:id" element={<ProductDetail />} />
            <Route path="products/inventory" element={<Inventory />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:id" element={<OrderDetailPage />} />
            <Route path="rfqs" element={<div>RFQs Page</div>} />
            <Route path="discounts" element={<div>Discounts Page</div>} />
            <Route path="analytics" element={<div>Analytics Page</div>} />
            {/* <Route path="support" element={<ChatSupportPage />} /> */}
            <Route path="support" element={<SupportTicketSystem />} />
            <Route path="settings" element={<Settings />} />

          </Route>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </Provider>
  )
}

export default App
