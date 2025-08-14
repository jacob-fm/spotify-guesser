import "./AccountForms.css";
import { useState } from "react";
import { UserAuth } from "../../../lib/AuthContext";
import Header from "/src/components/Header/Header";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [requestSent, setRequestSent] = useState(false);

  const { sendPasswordReset } = UserAuth();

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    try {
      const result = await sendPasswordReset(email);

      if (result.success) {
        setRequestSent(true);
        setError("");
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
        {!requestSent && (
          <form onSubmit={handlePasswordReset}>
            <section>
              <div>
                <div className="input-group">
                  <span className="label">Email Address</span>
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                    type="email"
                  />
                </div>
                <button type="submit" className="filled-alt">
                  Send link to reset password
                </button>
                <div className="links-line">
                  <Link to="/login" style={{ marginTop: "40px" }}>
                    Back to Login
                  </Link>
                </div>
              </div>
            </section>
          </form>
        )}
        {error && <p>{error}</p>}
        {requestSent && (
          <p>
            Request sent! If a user with this email exists, a link has been sent
            to reset your password.
          </p>
        )}
      </div>
    </>
  );
}
