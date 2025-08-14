import Header from "../../components/Header/Header";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <Header />
      <div className="home-layout">
        <Link to="/instructions" className="button-link outlined">
          Instructions
        </Link>
        <Link to="/game" className="button-link filled">
          Play
        </Link>
      </div>
    </>
  );
}
