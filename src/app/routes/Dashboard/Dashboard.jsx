import "./Dashboard.css";
import { UserAuth } from "/src/lib/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "/src/components/Header/Header";
import Accordion from "/src/components/Accordion/Accordion.jsx";
import { supabase } from "../../../lib/supabaseClient";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ScoresTable({ games }) {
  const accordionItems = games.map((g) => ({
    id: g.id,
    label: new Date(g.game_date).toLocaleDateString("en-US"),
    renderContent: () => (
      <table className="past-scores-table">
        <thead>
          <tr>
            <th>Guess</th>
            <th>Target</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {g.details.map((round, index) => (
            <tr key={index}>
              <td>
                {round.guessName} ({round.guessPopularity})
              </td>
              <td>
                {round.targetName} ({round.targetPopularity})
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

const Dashboard = () => {
  const [scores, setScores] = useState(null);
  const [loading, setLoading] = useState(false);

  const { session, signOut } = UserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getUserScores();
  }, []);

  async function getUserScores() {
    const { data, error } = await supabase
      .from("user_scores")
      .select()
      .eq("user_id", session.user.id);
    if (error) {
      console.error("Error fetching user scores:", error);
      setScores([]);
      return;
    } else {
      setScores(data);
    }
  }

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      await signOut();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  async function handleDeleteAccount() {
    try {
      setLoading(true);
      await supabase.functions.invoke("delete-account");
      alert("Account deleted successfully!");
    } catch (error) {
      alert("Error deleting the account!");
      console.log(error);
    } finally {
      setLoading(false);
      await supabase.auth.signOut();
      navigate("/");
    }
  }

  return (
    <>
      <Header />
      <div className="dashboard">
        <h1>Your Account</h1>
        <div className="account-options">
          <h2>{session?.user?.email}</h2>
          <Link className="button-link outlined" to="/forgot-password">
            Reset Password
          </Link>
          <button className="outlined" onClick={handleSignOut}>
            Sign out
          </button>
          <button className="outlined" onClick={handleDeleteAccount}>
            Delete Account
          </button>
          {/* TODO: implement deleting account */}
          {/* <Link className="button-link outlined" to="/delete-account"> */}
          {/*   Delete Account */}
          {/* </Link> */}
        </div>
        <div className="past-scores">
          <h2>Past Scores</h2>
          {scores === null ? <p>no scores</p> : <ScoresTable games={scores} />}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
