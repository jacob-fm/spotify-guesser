import { useEffect, useState } from "react";
import { UserAuth } from "./lib/AuthContext";
import "./App.css";
import Header from "./components/Header";
import Instructions from "./components/Instructions";
import Game from "./components/Game";
import Scoreboard from "./components/Scoreboard";
// import submitScoreToSupabase from "./lib/submitScoreToSupabase";
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

	const { session } = UserAuth();
	const loggedIn = session != null && session != undefined;

	function startGame() {
		setRoundCount(1);
		setRoundResults([]);
		setGameState(GAME_STATES.GAME);
	}

	function handleGameOver() {
		setGameState(GAME_STATES.ENDED);
		if (loggedIn) {
			submitScoreToSupabase();
		}
		// submitScoreToSupabase(roundResults, session.user.id)
		// 	.then((result) => {
		// 		if (result === null) {
		// 			console.error("Failed to submit score.");
		// 		} else {
		// 			console.log("Score submitted successfully:", result);
		// 		}
		// 	})
		// 	.catch((err) => {
		// 		console.error("Unexpected error in handleGameOver:", err);
		// 	});
	}

	async function submitScoreToSupabase() {
		await supabase.functions.invoke('submit-score', {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				user_id: session.user.id,
				rounds: roundResults,
			})
		})
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
