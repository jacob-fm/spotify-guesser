import { Link } from "react-router-dom";
import Header from '/src/components/Header/Header';

export default function NotFoundPage() {
	return (
		<>
            <Header />
			<div className="not-found">
				404 Not Found
				<Link to="/">Home</Link>
			</div>
		</>
	);
}
