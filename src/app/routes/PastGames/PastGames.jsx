import "./PastGames.css";
import { useEffect, useState } from "react";
import Header from "/src/components/Header/Header";
import Accordion from "/src/components/Accordion/Accordion.jsx";
import { supabase } from "../../../lib/supabaseClient";
import { UserAuth } from "/src/lib/AuthContext";

function ScoresTable({ games }) {
  const accordionItems = games.map((g) => ({
    id: g.id,
    label: new Date(g.game_date).toLocaleDateString("en-US"),
    renderContent: () => (
      <table className="past-scores-table">
        <thead>
          <tr>
            <th>Target</th>
            <th>Guess</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {g.details.map((round, index) => (
            <tr key={index}>
              <td>
                {round.targetName} ({round.targetPopularity})
              </td>
              <td>
                {round.guessName} ({round.guessPopularity})
              </td>
              <td>{round.points}</td>
            </tr>
          ))}
          <tr className="total-score-line">
            <td>
              <b>Total</b>
            </td>
            <td colSpan="1"></td>
            <td>
              <b>{g.score}</b>
            </td>
          </tr>
        </tbody>
      </table>
    ),
  }));

  return <Accordion items={accordionItems} keepOthersOpen={false} />;
}

export default function PastScores() {
  const [games, setGames] = useState(null);
  const [loading, setLoading] = useState(false);
  const { session } = UserAuth();

  useEffect(() => {
    getUserScores();
  }, []);

  async function getUserScores() {
    setLoading(true);
    const { data, error } = await supabase
      .from("user_scores")
      .select()
      .eq("user_id", session.user.id)
      .order("game_date", { ascending: false });
    if (error) {
      console.error("Error fetching user scores:", error);
      setGames([]);
      setLoading(false);
      return;
    } else {
      setGames(data);
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <div className="past-scores">
        <h1>Past Games</h1>
        {loading
          ? <span>Loading...</span>
          : (games === null ? <p>no scores</p> : <ScoresTable games={games} />)}
      </div>
    </>
  );
}
