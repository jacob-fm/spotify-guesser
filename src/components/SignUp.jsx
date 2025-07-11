import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { UserAuth } from "../lib/AuthContext";
import Header from "./Header";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const { session, signUpNewUser } = UserAuth();
	const navigate = useNavigate();
	console.log(session);

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
			setError("An unexpected error occurred."); // catch unexpected errors
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Header />
			<div>
				<form onSubmit={handleSignUp}>
					<h2>Sign up to track your scores!</h2>
					<p>
						Already have an account? <Link to="/login">Log in!</Link>
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
							Sign up
						</button>
            {error && <p>{error}</p>}
					</div>
				</form>
			</div>
		</>
	);
}
