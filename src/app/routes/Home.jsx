import Header from "../../components/Header/Header";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserAuth } from "../../lib/AuthContext";

export default function Home() {
  const lastDateCompleted = localStorage.getItem("lastDateCompleted");
  const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format
  const [playedLocal, setPlayedLocal] = useState(false);
  const { todaysGameExistsInSupabase } = UserAuth();

  useEffect(() => {
    if (lastDateCompleted === today) {
      setPlayedLocal(true);
    }
  }, [lastDateCompleted, today]);

  useEffect(() => {
    if (todaysGameExistsInSupabase) {
      setPlayedLocal(true);
    }
  }, [todaysGameExistsInSupabase]);

  return (
    <>
      <title>Daily Music Trivia Game - BopMatch</title>
      <Header />
      <div className="home-layout">
        <p className="short-description">
          Choose an artist, and score points based on how closely their
          popularity matches the target.
        </p>
        <Link to="/instructions" className="button-link outlined">
          Instructions
        </Link>
        {playedLocal || todaysGameExistsInSupabase
          ? (
            <>
              <Link to="/past-games" className="button-link filled">
                Past Games
              </Link>
              <p>5 new rounds every day at 8PM EST!</p>
            </>
          )
          : (
            <Link to="/game" className="button-link filled">
              Play
            </Link>
          )}
      </div>
    </>
  );
}
