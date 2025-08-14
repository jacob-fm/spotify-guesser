import { Link } from "react-router-dom";
import Header from "/src/components/Header/Header";

export default function NotFoundPage() {
  return (
    <>
      <Header />
      <div className="not-found">
        <h2>404 Error</h2>
        <p>Sorry, that page doesn't seem to exist.</p>
        <Link to="/">Back to Home</Link>
      </div>
    </>
  );
}
