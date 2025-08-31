import { useEffect, useState } from "react";
import { UserAuth } from "../lib/AuthContext";
import "./App.css";
import Header from "/src/components/Header/Header";
import Game from "./routes/Game/Game";
import Scoreboard from "./routes/Game/components/Scoreboard/Scoreboard";
import { supabase } from "../lib/supabaseClient";
import {
  FunctionsFetchError,
  FunctionsHttpError,
  FunctionsRelayError,
} from "@supabase/supabase-js";

function App() {
  const GAME_STATES = {
    GAME: "game",
    ENDED: "end",
  };
  const [gameState, setGameState] = useState(GAME_STATES.GAME);
  const [roundCount, setRoundCount] = useState(1);
  const [roundResults, setRoundResults] = useState([]);

  const { session } = UserAuth();
  const loggedIn = session != null && session != undefined;

  const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format

  useEffect(() => {
    const storedGame = localStorage.getItem("currentGame");
    // see if user is in the middle of today's game
    if (storedGame && localStorage.getItem("lastDateStarted") === today) {
      const loadedGame = JSON.parse(localStorage.getItem("currentGame"));
      setRoundResults(loadedGame);
      setRoundCount(loadedGame.length + 1);
    } else { // if hasn't started today's game, clear currentGame from localStorage
      localStorage.setItem("currentGame", "");
    }
    // set lastDateStarted to today in all cases
    localStorage.setItem("lastDateStarted", today);
  }, []);

  function handleGameOver() {
    setGameState(GAME_STATES.ENDED);
    if (loggedIn) {
      submitScoreToSupabase();
    }

    localStorage.setItem("lastDateCompleted", today);
  }

  async function submitScoreToSupabase() {
    console.log(
      JSON.stringify({
        user_id: session.user.id,
        rounds: roundResults,
      }),
    );
    const { error } = await supabase.functions.invoke("submit-score", {
      method: "POST",
      body: {
        user_id: session.user.id,
        rounds: roundResults,
      },
    });

    if (error instanceof FunctionsHttpError) {
      const errorMessage = await error.context.json();
      console.log("Function returned an error", errorMessage);
    } else if (error instanceof FunctionsRelayError) {
      console.log("Relay error:", error.message);
    } else if (error instanceof FunctionsFetchError) {
      console.log("Fetch error:", error.message);
    }
  }

  return (
    <>
      <title>Daily Music Trivia Game - bopmatch</title>
      <Header />
      {gameState === GAME_STATES.GAME && (
        <Game
          roundCount={roundCount}
          updateRoundCount={setRoundCount}
          roundResults={roundResults}
          updateRoundResults={setRoundResults}
          onGameOver={handleGameOver}
          today={today}
        />
      )}
      {gameState === GAME_STATES.ENDED && (
        <Scoreboard roundResults={roundResults} />
      )}
    </>
  );
}

export default App;
