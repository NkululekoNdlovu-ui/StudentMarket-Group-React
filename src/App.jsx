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
import Cancel from "./pages/Cancel";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ToastContainer />
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/signup" element={<SignUp />} />

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
            path="/cancel"
            element={
              <PrivateRoute>
                <Cancel />
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
            path="/success"
            element={
              <PrivateRoute>
                <SuccessPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/about"
            element={
              <PrivateRoute>
                <About />
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

          <Route
            path="/admin-dashboard"
            element={
              <RoleBasedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
                <AdminDashboard />
              </RoleBasedRoute>
            }
          />

          <Route
            path="/superadmin-dashboard"
            element={
              <RoleBasedRoute allowedRoles={["SUPER_ADMIN"]}>
                <SuperAdminDashboard />
              </RoleBasedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
