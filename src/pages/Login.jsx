import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authenticateUser } from "../service/StudentService";

const Login = () => {
  const [credentials, setCredentials] = useState({
    identifier: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authenticateUser({
        email: credentials.identifier,
        password: credentials.password,
      });

      const result = response.data;
      console.log("Login response:", result);

      if (response.status === 200 && result.success) {
        const userData = { ...result.data, role: result.role };
        localStorage.setItem("user", JSON.stringify(userData));

        if (result.data.studentId) {
          localStorage.setItem("studentId", result.data.studentId);
        }

        if (result.role === "superadmin") {
          navigate("/superadmin-dashboard");
          alert(`Welcome back, Super Admin ${result.data.username}!`);
        } else if (result.role === "admin") {
          navigate("/admin-dashboard");
          alert(
            `Welcome back, Admin ${
              result.data.firstName || result.data.username
            }!`
          );
        } else {
          navigate("/home");
          alert(`Welcome back, ${result.data.firstName}!`);
        }
      } else {
        alert(result.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check your credentials.");
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
