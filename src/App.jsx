import { useEffect, useState } from "react";
import { UserContext } from "./lib/UserContext";
import Header from "./components/Header";
import Instructions from "./components/Instructions";
import Game from "./components/Game";
import Scoreboard from "./components/Scoreboard";
import "./App.css";
import { supabase } from "./lib/supabaseClient";

function App() {
	// user context things
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		const getUser = async () => {
			const { data, error } = await supabase.auth.getUser();
			if (data?.user) setUser(data.user);
			if (error) console.error(error.message);
			setLoading(false);
		};
		getUser();
	}, []);

	// other state things
	const GAME_STATES = {
		INSTRUCTIONS: "instructions",
		GAME: "game",
		ENDED: "end",
	};
	const [gameState, setGameState] = useState(GAME_STATES.INSTRUCTIONS);
	const [roundCount, setRoundCount] = useState(1);
	const [roundResults, setRoundResults] = useState([]);

	if (loading) return <p>Loading...</p>;

	function startGame() {
		setRoundCount(1);
		setRoundResults([]);
		setGameState(GAME_STATES.GAME);
	}

	function handleGameOver() {
		setGameState(GAME_STATES.ENDED);
	}

	return (
		<UserContext.Provider value={user}>
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
		</UserContext.Provider>
	);
}

export default App;
