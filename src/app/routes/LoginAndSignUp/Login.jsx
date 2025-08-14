import "./LoginAndSignUp.css";
import { useState } from "react";
import { UserAuth } from "/src/lib/AuthContext";
import Header from "/src/components/Header/Header";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { session, loginUser } = UserAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await loginUser(email, password); // Call context function

      if (result.success) {
        navigate("/dashboard"); // navigate to dashboard on success
      } else {
        setError(result.error.message); // show error message on failure
      }
    } catch (err) {
      setError(err.message); // catch unexpected errors
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="login-and-signup">
        <h2>Account Login</h2>
        <form onSubmit={handleLogin}>
          <section>
            <div className="input-group">
              <span className="label">Email Address</span>
              <input
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                type="email"
              />
            </div>
            <div className="input-group">
              <span className="label">Password</span>
              <input
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                type="password"
              />
            </div>
            <p>
              Don&apos;t have an account? <Link to="/signup">Sign up!</Link>
            </p>
            <button type="submit" className="filled-alt" disabled={loading}>
              Log in
            </button>
            {error && <p>{error}</p>}
          </section>
        </form>
        <Link to="/forgot-password">Forgot your password?</Link>
      </div>
    </>
  );
}
