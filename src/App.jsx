import { useState } from "react";
import { UserAuth } from "./lib/AuthContext";
import "./App.css";
import Header from "./components/Header";
import Instructions from "./components/Instructions";
import Game from "./components/Game";
import Scoreboard from "./components/Scoreboard";
import { supabase } from "./lib/supabaseClient";
import {
	FunctionsHttpError,
	FunctionsRelayError,
	FunctionsFetchError,
} from "@supabase/supabase-js";

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
	}

	async function submitScoreToSupabase() {
		console.log(
			JSON.stringify({
				user_id: session.user.id,
				rounds: roundResults,
			})
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
