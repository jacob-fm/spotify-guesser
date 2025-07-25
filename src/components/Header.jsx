import { UserAuth } from "../lib/AuthContext";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Header() {
	const [loggedIn, setLoggedIn] = useState(false);

	const { session } = UserAuth();

	useEffect(() => {
		if (session === undefined || session === null) {
			setLoggedIn(false);
		} else {
			setLoggedIn(true);
		}
		console.log("Logged In:", loggedIn);
	}, [session]);

	return (
		<header>
			<a href="/">
				<img
					className="header-logo"
					src="/assets/logo.png"
					alt="spotify guesser logo"
				/>
			</a>
			{loggedIn ? (
				<>
					<Link to="/dashboard">{session?.user?.email}</Link>
				</>
			) : (
				<div className="user-pages">
					<Link to="/signup">Sign Up</Link>
					<Link to="/login">Login</Link>
				</div>
			)}
		</header>
	);
}
