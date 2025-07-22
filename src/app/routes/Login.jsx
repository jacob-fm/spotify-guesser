import { useState } from "react";
import { UserAuth } from "/src/lib/AuthContext";
import Header from '/src/components/Header';
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
			setError("An unexpected error occurred."); // catch unexpected errors
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Header />
			<div>
				<form onSubmit={handleLogin}>
					<h2>Sign in</h2>
					<p>
						Don't have an account? <Link to="/signup">Log in!</Link>
					</p>
					<div>
						<input
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Email"
							type="email"
						/>
						<input
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Password"
							type="password"
						/>
						<button type="submit" disabled={loading}>
							Log in
						</button>
						{error && <p>{error}</p>}
					</div>
				</form>
			</div>
		</>
	);
}
