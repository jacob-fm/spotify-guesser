import { UserAuth } from "/src/lib/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "/src/components/Header/Header";
import Accordion from "/src/components/Accordion/Accordion";
import { supabase } from "../../lib/supabaseClient";
import { useEffect, useState } from "react";

function ScoresTable({ games }) {
	const accordionItems = games.map((g) => ({
		id: g.id,
		label: new Date(g.game_date).toLocaleDateString("en-US"),
		renderContent: () => (
			<table>
				<thead>
					<tr>
						<th>Round</th>
						<th>Target Artist</th>
						<th>Target Artist Popularity</th>
						<th>Guessed Artist</th>
						<th>Guessed Artist Popularity</th>
						<th>Points</th>
					</tr>
				</thead>
				<tbody>
					{g.details.map((round, index) => (
						<tr key={index}>
							<td>{index + 1}</td>
							<td>{round.targetName}</td>
							<td>{round.targetPopularity}</td>
							<td>{round.guessName}</td>
							<td>{round.guessPopularity}</td>
							<td>{round.points}</td>
						</tr>
					))}
				</tbody>
			</table>
		),
	}));

	return <Accordion items={accordionItems} keepOthersOpen={false} />;
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
