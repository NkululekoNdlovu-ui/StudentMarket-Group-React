import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import RoleBasedRoute from "./components/RoleBasedRoute";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Sell from "./pages/Sell";
import Pending from "./pages/Pending";
import Buy from "./pages/Buy";
import Transaction from "./pages/Transaction";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import ForgotPassword from "./pages/ForgotPassword";
import About from "./pages/About";
import SuccessPage from "./pages/Success";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ToastContainer />
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Student routes - require authentication */}
          <Route 
            path="/home" 
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/sell" 
            element={
              <PrivateRoute>
                <Sell />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/pending" 
            element={
              <PrivateRoute>
                <Pending />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/buy" 
            element={
              <PrivateRoute>
                <Buy />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/transaction/:id" 
            element={
              <PrivateRoute>
                <Transaction />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } 
          />

          {/* Admin routes - require ADMIN or SUPER_ADMIN role */}
          <Route 
            path="/admin-dashboard" 
            element={
              <RoleBasedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
                <AdminDashboard />
              </RoleBasedRoute>
            } 
          />

          {/* Super Admin routes - require SUPER_ADMIN role only */}
          <Route 
            path="/superadmin-dashboard" 
            element={
              <RoleBasedRoute allowedRoles={['SUPER_ADMIN']}>
                <SuperAdminDashboard />
              </RoleBasedRoute>
            } 
          />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;