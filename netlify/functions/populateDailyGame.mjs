import { createClient } from "@supabase/supabase-js";
import targetPool from "../../src/data/target_pool.json";

const supabase = createClient(
	process.env.VITE_SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async (req) => {
	const today = new Date().toISOString().slice(0, 10);
	const shuffled = [...targetPool].sort(() => 0.5 - Math.random());
	const selectedTargets = shuffled.slice(0, 5).map((artist) => artist.id);

	const { error } = await supabase
		.from("daily_games")
		.insert([{ date: today, targets: selectedTargets }]);

	if (error) {
		console.error("Insert failed:", error);
		return new Response("Failed to insert", { status: 500 });
	}

	console.log("Inserted daily game for", today);
	return new Response("Success", { status: 200 });
};

export const config = {
	schedule: "@daily"
};