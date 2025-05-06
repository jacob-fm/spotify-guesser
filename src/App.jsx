import { useState } from "react";
import Header from "./components/Header";
import Game from "./components/Game";
import "./App.css";

function App() {
    // State values
    const [gameRunning, setGameRunning] = useState(false);
    const [roundCount, setRoundCount] = useState(1);
    const [score, setScore] = useState(0);
    const totalRounds = 5;

    function startGame() {
        setGameRunning(true);
    }

    const gameOver = roundCount > totalRounds;

    return (
        <>
            <Header />
            {/* when gameRunning, Game renders, otherwise instructions section renders */}
            {!gameRunning ? (
                <section className='instructions'>
                    <h2>How to play:</h2>
                    <p>
                        Each round, you’ll be given a target artist. You’re job
                        is to search for and select an artist who you think has
                        a similar monthly listener count. The closer you are,
                        the more points you’ll be awarded. See how many points
                        you can accumulate in 5 rounds!
                    </p>
                    <button onClick={startGame}>Start Game</button>
                </section>
            ) : (
                <Game roundCount={roundCount} updateRoundCount={setRoundCount} score={score} updateScore={setScore}  />
            )}
        </>
    );
}

export default App;
