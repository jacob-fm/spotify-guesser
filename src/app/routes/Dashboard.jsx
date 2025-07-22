import { UserAuth } from "/src/lib/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "/src/components/Header";
import Accordion from "/src/components/Accordion/Accordion";
import { supabase } from "../../lib/supabaseClient";
import { useEffect, useState } from "react";

function ScoresTable({ games }) {
	const accordionItems = games.map((g) => ({
		id: g.id,
		label: new Date(g.game_date).toLocaleDateString("en-US"),
        renderContent: () => (
            <p>hello</p>
        )
	}));

	return (
		// <table>
		// 	<thead>
		// 		<tr>
		// 			<th>Date</th>
		// 			<th>Score</th>
		// 		</tr>
		// 	</thead>
		// 	<tbody>
		// 		{games.map((g) => (
		// 			<tr key={g.id}>
		// 				<td>{new Date(g.game_date).toLocaleDateString("en-US")}</td>
		// 				<td>{g.score}</td>
		// 			</tr>
		// 		))}
		// 	</tbody>
		// </table>
		<Accordion items={accordionItems} keepOthersOpen={false} />
	);
}

const Dashboard = () => {
	const [scores, setScores] = useState(null);

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
		setScores(data);
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

	console.log(scores);

	return (
		<>
			<Header />
			<h1>User Dashboard</h1>
			<h2>Welcome, {session?.user?.email}</h2>
			{scores === null ? <p>no scores</p> : <ScoresTable games={scores} />}
			<button onClick={handleSignOut}>Sign out</button>
		</>
	);
};

export default Dashboard;
