import { useState } from "react";
import Header from "./components/Header";
import Instructions from "./components/Instructions";
import Game from "./components/Game";
import Scoreboard from "./components/Scoreboard";
import "./App.css";

function App() {
	// State values
	const GAME_STATES = {
		INSTRUCTIONS: "instructions",
		GAME: "game",
		ENDED: "end",
	};
	const [gameState, setGameState] = useState(GAME_STATES.INSTRUCTIONS);
	const [roundCount, setRoundCount] = useState(1);
	// const [score, setScore] = useState(0);
    const [roundResults, setRoundResults] = useState([]);

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
			{gameState === GAME_STATES.ENDED && <Scoreboard roundResults={roundResults} onNewGame={startGame} />}
		</>
	);
}

export default App;
