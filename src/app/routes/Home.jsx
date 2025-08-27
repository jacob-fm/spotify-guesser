import Header from "../../components/Header/Header";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <title>Daily Music Trivia Game - bopmatch</title>
      <Header />
      <div className="home-layout">
        <p className="short-description">
          Guess the artist and score points based on how closely their
          popularity matches the target.
        </p>
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
