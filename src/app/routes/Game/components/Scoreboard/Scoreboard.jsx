import { Link } from "react-router-dom";
import "./Scoreboard.css";
import { UserAuth } from "../../../../../lib/AuthContext";
import { ToastContainer, toast } from "react-toastify";

export default function Scoreboard({ roundResults }) {
  const { session } = UserAuth();
  const loggedIn = session?.user;
  const totalScore = roundResults.reduce(
    (total, result) => total + result.score, 0)
  function roundsText() {
    let message = ""
    roundResults.forEach((result) => {
      message += `${result.target.name}: ${result.score}\n`;
    });
    return message
  }

  const shareText = `My BopMatch score today:\n${roundsText()}\nTotal: ${totalScore}\nThink you can do better? Try for yourself: https://bopmatch.com`

  function copyToClipboard() {
    navigator.clipboard.writeText(shareText)
    toast.success("Score copied to clipboard")
  }

  return (
    <section className="scoreboard">
      <h2>Scoreboard</h2>
      <table className="scoreboard-table">
        <thead>
          <tr>
            <th>Target</th>
            <th>Guess</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {roundResults.map((result, index) => (
            <tr key={index}>
              <td>{result.target.name} ({result.target.popularity})</td>
              <td>{result.guessed.name} ({result.guessed.popularity})</td>
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
      <h3>See you tomorrow!</h3>
      <button className="share-score outlined" onClick={copyToClipboard}>Share my score</button>
      {loggedIn
        ? (
          <Link className="button-link outlined" to="/past-games">
            View past games
          </Link>
        )
        : (
          <Link className="button-link outlined" to="/login">
            Log in to save your scores!
          </Link>
        )}
      <ToastContainer position="bottom-center" autoClose={3000} closeButton={false} draggable newestOnTop hideProgressBar closeOnClick />
    </section>
  );
}
