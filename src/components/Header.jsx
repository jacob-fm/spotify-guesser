import { Link } from "react-router-dom";

export default function Header() {
	return (
		<header>
			<a href="/">
				<img
					className="header-logo"
					src="/assets/logo.png"
					alt="spotify guesser logo"
				/>
			</a>
			<div className="user-pages">
				<Link to="/signup">
					Sign Up
				</Link>
                <Link to="/login">
                    Login
                </Link>
			</div>
		</header>
	);
}
