
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/dashboard/Home";
import Products from "./pages/dashboard/product/Products";
import CreateProduct from "./pages/dashboard/product/CreateProduct";
import EditProduct from "./pages/dashboard/product/EditProduct";
import BulkEditProducts from "./pages/dashboard/product/BulkEditProducts";
import Orders from "./pages/dashboard/orders/Orders";
import Inventory from "./pages/dashboard/inventory/Inventory";
import ProductDetail from "./pages/dashboard/inventory/ProductDetail";
import OrderDetailPage from "./pages/dashboard/orders/OrderDetailPage";
import Discounts from "./pages/dashboard/discount/Discounts";
import CreateDiscount from "./pages/dashboard/discount/CreateDiscount";
import AnalyticsDashboard from "./pages/dashboard/analytics/AnalyticsDashboard";
import EditDiscount from "./pages/dashboard/discount/EditDiscount";

import Settings from './pages/dashboard/settings/Settings'
// import ChatSupportPage from './pages/dashboard/ChatBot'
import SupportTickets from './pages/dashboard/Support/SupportTickets'
import SupportTicketDetail from './pages/dashboard/Support/SupportTicketDetail'
import CreateSupportTicket from './pages/dashboard/Support/CreateSupportTicket'
import RFQPage from './pages/dashboard/rfqs/RFQPage'
import RFQDetailPage from './pages/dashboard/rfqs/RFQDetailPage'



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
            <Route path="inventory" element={<Inventory />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:id" element={<OrderDetailPage />} />

            
            <Route path="discounts" element={<Discounts />} />
            <Route path="discounts/new" element={<CreateDiscount />} />
            <Route path="discounts/:id/edit" element={<EditDiscount />} />
            <Route path="analytics" element={<AnalyticsDashboard />} />
            

            <Route path="rfqs" element={<RFQPage />} />
            <Route path="rfqs/:id" element={<RFQDetailPage />} />
            
            {/* <Route path="support" element={<ChatSupportPage />} /> */}
            <Route path="support" element={<SupportTickets />} />
            <Route path="support/create" element={<CreateSupportTicket />} />
            <Route path="support/:id" element={<SupportTicketDetail />} />
            <Route path="settings" element={<Settings />} />

          </Route>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
