import { useState } from "react";
import Header from "./components/Header";
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
	const [score, setScore] = useState(0);

	function startGame() {
		setGameState(GAME_STATES.GAME);
	}

	function handleGameOver() {
        setGameState(GAME_STATES.ENDED);
    }

	return (
		<>
			<Header />
			{/* when gameRunning, Game renders, otherwise instructions section renders */}
			{gameState === GAME_STATES.INSTRUCTIONS && (
				<section className="instructions">
					<h2>How to play:</h2>
					<p>
						Each round, you’ll be given a target artist. You’re job is to search
						for and select an artist who you think has a similar monthly
						listener count. The closer you are, the more points you’ll be
						awarded. See how many points you can accumulate in 5 rounds!
					</p>
					<button onClick={startGame}>Start Game</button>
				</section>
			)}
			{gameState === GAME_STATES.GAME && (
				<Game
					roundCount={roundCount}
					updateRoundCount={setRoundCount}
					score={score}
					updateScore={setScore}
					onGameOver={handleGameOver}
				/>
			)}
            {gameState === GAME_STATES.ENDED && (
                <Scoreboard score={score} />
            )}
		</>
	);
}

export default App;
