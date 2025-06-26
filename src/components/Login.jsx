import { useState } from "react";
import { supabase } from "../lib/supabaseClient"; // Your initialized Supabase client
import { useNavigate } from "react-router-dom"; // If you're using React Router
import Header from "./Header";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMsg, setErrorMsg] = useState("");
	const [success, setSuccess] = useState(false);

	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();
		setErrorMsg("");
		setSuccess(false);

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			setErrorMsg(error.message);
		} else {
			setSuccess(true);
			navigate("/");
		}
	};

	return (
		<>
			<Header />
			<div style={{ maxWidth: "400px", margin: "2rem auto" }}>
				<h2>Log In</h2>
				<form onSubmit={handleLogin}>
					<div style={{ marginBottom: "1rem" }}>
						<label>Email</label>
						<br />
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							style={{ width: "100%" }}
						/>
					</div>
					<div style={{ marginBottom: "1rem" }}>
						<label>Password</label>
						<br />
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							style={{ width: "100%" }}
						/>
					</div>
					<button type="submit">Log In</button>
				</form>

				{errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
				{success && <p style={{ color: "green" }}>Logged in! Redirecting...</p>}
			</div>
		</>
	);
}
