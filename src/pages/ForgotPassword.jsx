import { useState } from "react";
import { sendOtp, resetPassword } from "../service/StudentService";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await sendOtp(email);
      alert(response.data.message);
      setStep(2);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await resetPassword(email, otp, newPassword);
      alert(response.data.message);
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Password reset failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">
      <div className="card w-100" style={{ maxWidth: "400px" }}>
        <div className="card-header bg-white text-center border-0">
          <h2 className="text-primary">Forgot Password</h2>
          <p className="text-muted">
            {step === 1
              ? "Enter your email to receive an OTP."
              : "Enter the OTP and your new password."}
          </p>
        </div>

        <div className="card-body">
          {step === 1 ? (
            <form onSubmit={handleSendOtp}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="*******@mycput.ac.za"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={isLoading}
              >
                {isLoading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword}>
              <div className="mb-3">
                <label className="form-label">OTP</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter the 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="********"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-success w-100"
                disabled={isLoading}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
