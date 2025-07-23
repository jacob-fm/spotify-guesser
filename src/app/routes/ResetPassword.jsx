import { useState } from "react";
import { UserAuth } from "/src/lib/AuthContext";
import Header from "/src/components/Header";
import { useNavigate } from "react-router-dom";

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
			<div>
				<form onSubmit={handleResetPassword}>
					<h2>Reset Password</h2>
					<div>
						<input
							onChange={(e) => setPassword(e.target.value)}
							placeholder="New password"
							type="password"
						/>
						<button type="submit">Set new password</button>
					</div>
				</form>
				{error && <p>{error}</p>}
			</div>
		</>
	);
}
