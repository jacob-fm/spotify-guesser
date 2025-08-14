import { Link } from "react-router-dom";
import "./Scoreboard.css";

export default function Scoreboard({ roundResults }) {
  return (
    <section className="scoreboard">
      <h2>Scoreboard</h2>
      <table className="scoreboard-table">
        <thead>
          <tr>
            <th>Guess</th>
            <th>Target</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {roundResults.map((result, index) => (
            <tr key={index}>
              <td>{result.target.name}</td>
              <td>{result.guessed.name}</td>
              <td>{result.score}</td>
            </tr>
          ))}
          <tr className="dashed-line"></tr>
          <tr className="total-score-row">
            <td>
              <b>Total</b>
            </td>
            <td colSpan="1"></td>
            <td>
              <b>
                {roundResults.reduce(
                  (total, result) => total + result.score,
                  0,
                )}
              </b>
            </td>
          </tr>
        </tbody>
      </table>
      {/* TODO: implement sharing score */}
      {/* <button className="share-score" onClick={onShareScore}>
          Share my score
            </button> */}
      <h3>See you tomorrow!</h3>
      <Link className="button-link outlined" to="/dashboard">
        View past scores
      </Link>
    </section>
  );
}
