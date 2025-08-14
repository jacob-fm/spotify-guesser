import "./LoginAndSignUp.css";
import { useState } from "react";
import { UserAuth } from "/src/lib/AuthContext";
import Header from "/src/components/Header/Header";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { session, signUpNewUser } = UserAuth();
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signUpNewUser(email, password); // Call context function

      if (result.success) {
        navigate("/"); // navigate to home on success
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
        <h2>Sign up to track your scores!</h2>
        <form onSubmit={handleSignUp}>
          <section>
            <div className="input-group">
              <span className="label">Email Address</span>
              <input
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                type="email"
              />
            </div>
            <div className="input-group">
              <span className="label">Password</span>
              <input
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                type="password"
              />
            </div>
            <p>
              Already have an account? <Link to="/login">Log in</Link>
            </p>
            <button type="submit" className="filled-alt" disabled={loading}>
              Sign up
            </button>
            {error && <p>{error}</p>}
          </section>
        </form>
      </div>
    </>
  );
}
