import { useState } from "react";
import { UserAuth } from "/src/lib/AuthContext";
import Header from "/src/components/Header/Header";
import { useNavigate } from "react-router-dom";
import "./AccountForms.css";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { session, updatePassword } = UserAuth();
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      const result = await updatePassword(password);
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error.message);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Header />
      <div className="account-forms">
        <h2>Reset Password</h2>
        <form onSubmit={handleResetPassword}>
          <section>
            <div className="input-group">
              <span className="label">New Password</span>
              <input
                id="new-password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                type="password"
              />
            </div>
            <button type="submit" className="filled-alt">
              Set new password
            </button>
          </section>
        </form>
        {error && <p>{error}</p>}
      </div>
    </>
  );
}
