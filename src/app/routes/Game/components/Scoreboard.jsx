export default function Scoreboard({ roundResults, onNewGame }) {
    return (
        <section className="scoreboard">
            <h2>Score</h2>
            <table className="scoreboard-table">
                <thead>
                    <tr>
                        <th>Round</th>
                        <th>Your Pick</th>
                        <th>Target Artist</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {roundResults.map((result, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{result.target.name}</td>
                            <td>{result.guessed.name}</td>
                            <td>{result.score}</td>
                        </tr>
                    ))}
                    <tr className="dashed-line"></tr>
                    <tr className="total-score-row">
                        <td>Total</td>
                        <td colSpan="2"></td>
                        <td>{roundResults.reduce((total, result) => total + result.score, 0)}</td>
                    </tr>
                </tbody>
            </table>
            {/* <button className="play-again" onClick={onNewGame}>
                Play Again
            </button> */}
            <h3>See you tomorrow!</h3>
        </section>
    );
}
