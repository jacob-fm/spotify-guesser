import { useEffect, useState } from "react";
import { UserAuth } from "./lib/AuthContext";
import Header from "./components/Header";
import Instructions from "./components/Instructions";
import Game from "./components/Game";
import Scoreboard from "./components/Scoreboard";
import "./App.css";
import { supabase } from "./lib/supabaseClient";

function App() {
	// other state things
	const GAME_STATES = {
		INSTRUCTIONS: "instructions",
		GAME: "game",
		ENDED: "end",
	};
	const [gameState, setGameState] = useState(GAME_STATES.INSTRUCTIONS);
	const [roundCount, setRoundCount] = useState(1);
	const [roundResults, setRoundResults] = useState([]);

	// if (loading) return <p>Loading...</p>;

	function startGame() {
		setRoundCount(1);
		setRoundResults([]);
		setGameState(GAME_STATES.GAME);
	}

	function handleGameOver() {
		setGameState(GAME_STATES.ENDED);
	}

	return (
		<>
			<Header />
			{gameState === GAME_STATES.INSTRUCTIONS && (
				<Instructions startGame={startGame} />
			)}
			{gameState === GAME_STATES.GAME && (
				<Game
					roundCount={roundCount}
					updateRoundCount={setRoundCount}
					roundResults={roundResults}
					updateRoundResults={setRoundResults}
					onGameOver={handleGameOver}
				/>
			)}
			{gameState === GAME_STATES.ENDED && (
				<Scoreboard roundResults={roundResults} onNewGame={startGame} />
			)}
		</>
	);
}

export default App;
