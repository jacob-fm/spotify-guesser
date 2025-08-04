import { useState } from "react";
import { UserAuth } from "../../lib/AuthContext";
import Header from "/src/components/Header/Header";

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
			<div>
				{!requestSent && (
					<form onSubmit={handlePasswordReset}>
						<h2>Reset Password</h2>
						<div>
							<input
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Email"
								type="email"
							/>
							<button type="submit">Send link to reset password</button>
						</div>
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
