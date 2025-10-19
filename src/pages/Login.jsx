import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authenticateUser } from "../service/StudentService";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [credentials, setCredentials] = useState({
    identifier: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("🔑 Attempting login with:", {
        email: credentials.identifier,
        passwordLength: credentials.password.length,
      });

      const response = await authenticateUser({
        email: credentials.identifier,
        password: credentials.password,
      });

      console.log("📨 Full login response:", response);
      console.log("📊 Response status:", response.status);
      console.log("📊 Response data:", response.data);

      const result = response.data;
      console.log("Login response:", result);
      console.log("Login response data:", JSON.stringify(result, null, 2));

      if (response.status === 200 && result.success) {
        if (result.data.studentId) {
          localStorage.setItem("studentId", result.data.studentId);
        }
        if (result.data.administratorId) {
          localStorage.setItem("adminId", result.data.administratorId);
        }
        if (result.data.superAdminId) {
          localStorage.setItem("superAdminId", result.data.superAdminId);
        }

        try {
          console.log("About to call login with:", {
            token: result.token
              ? `${result.token.substring(0, 20)}...`
              : "No token",
            role: result.role,
            data: result.data,
          });

          login(result.token, result.role, result.data);

          console.log("Login called successfully, checking localStorage:");
          console.log(
            "Token:",
            localStorage.getItem("token")
              ? `${localStorage.getItem("token").substring(0, 20)}...`
              : "No token"
          );
          console.log("Role:", localStorage.getItem("role"));
          console.log("UserData:", localStorage.getItem("userData"));
        } catch (error) {
          console.error("Error storing authentication data:", error);
          alert("Login failed due to invalid token. Please contact support.");
          return;
        }

        const role = result.role.toUpperCase();
        console.log("Redirecting based on role:", role);

        if (role === "SUPER_ADMIN" || role === "SUPERADMIN") {
          console.log("Navigating to super admin dashboard");
          navigate("/superadmin-dashboard");
          alert(`Welcome back, Super Admin ${result.data.username}!`);
        } else if (role === "ADMIN") {
          console.log("Navigating to admin dashboard");
          navigate("/admin-dashboard");
          alert(
            `Welcome back, Admin ${
              result.data.firstName || result.data.username
            }!`
          );
        } else {
          console.log("Navigating to home");
          navigate("/home");
          alert(`Welcome back, ${result.data.firstName}!`);
        }
      } else {
        console.error("❌ Login failed - Backend response:", result);

        if (result.message) {
          alert(`Login failed: ${result.message}`);
        } else {
          alert("Login failed. Please check your credentials.");
        }
      }
    } catch (error) {
      console.error("💥 Login error (full details):", error);
      console.error("💥 Error response:", error.response);
      console.error("💥 Error response data:", error.response?.data);
      console.error("💥 Error response status:", error.response?.status);

      if (error.response?.status === 401) {
        alert("❌ Invalid email or password. Please check your credentials.");
      } else if (error.response?.status === 403) {
        alert("❌ Access forbidden. Your account may be disabled.");
      } else if (error.response?.status === 500) {
        alert("❌ Server error. Please try again later.");
      } else if (error.response?.data?.message) {
        alert(`❌ Login failed: ${error.response.data.message}`);
      } else {
        alert("❌ Login failed. Please check your credentials and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center p-3">
      <div className="card w-100" style={{ maxWidth: "400px" }}>
        <div className="card-header text-center bg-white border-0">
          <h2 className="card-title text-primary mb-1">Login</h2>
          <p className="text-muted">Login to your Student Market Place</p>
        </div>
        <div className="card-body">
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="identifier" className="form-label">
                Email
              </label>
              <input
                id="identifier"
                type="email"
                className="form-control"
                placeholder="*******@mycput.ac.za"
                value={credentials.identifier}
                onChange={(e) =>
                  setCredentials((prev) => ({
                    ...prev,
                    identifier: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="form-control"
                placeholder="********"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                required
                onKeyPress={(e) => e.key === "Enter" && handleLogin(e)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            <div className="text-center mt-3">
              <Link
                to="/forgot-password"
                className="text-decoration-none text-primary fw-medium"
              >
                Forgot Password?
              </Link>
            </div>
          </form>
          <div className="mt-4 text-center">
            <p className="text-muted">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-primary text-decoration-none fw-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
