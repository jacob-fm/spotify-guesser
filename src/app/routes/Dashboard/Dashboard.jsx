import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import Header from "/src/components/Header/Header";
import { Link } from "react-router-dom";
import { supabase } from "../../../lib/supabaseClient";
import { UserAuth } from "/src/lib/AuthContext";

const Dashboard = () => {
  const { session, signOut } = UserAuth();
  const navigate = useNavigate();
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
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete your account? This action cannot be undone.",
    );
    if (!confirmed) return; // user clicked cancel
    try {
      await supabase.functions.invoke("delete-account");
      alert("Account deleted successfully!");
    } catch (error) {
      alert("Error deleting the account!");
      console.log(error);
    } finally {
      await supabase.auth.signOut();
      navigate("/");
    }
  }

  return (
    <>
      <Header />
      <div className="dashboard">
        <h1>Your Account</h1>
        <h2>{session?.user?.email}</h2>
        <div className="account-options">
          <Link className="button-link outlined" to="/forgot-password">
            Reset Password
          </Link>
          <button className="outlined" onClick={handleSignOut}>
            Sign Out
          </button>
          <button className="outlined" onClick={handleDeleteAccount}>
            Delete Account
          </button>
          {/* TODO: implement deleting account */}
          {/* <Link className="button-link outlined" to="/delete-account"> */}
          {/*   Delete Account */}
          {/* </Link> */}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
