import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
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
      <Routes>

      
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/" element={<Login />} />

        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} /> 
        <Route path="/about" element={<About />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/pending" element={<Pending />} />
        <Route path="/buy" element={<Buy />} />
        <Route path="/transaction/:id" element={<Transaction />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/superadmin-dashboard" element={<SuperAdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;