import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.js";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const FETCH_SPOTIFY_URL =
	"https://jyskxullnyuwlnsfcxoc.supabase.co/functions/v1/fetch-from-spotify";

serve(async (req) => {
	console.log(`[${req.method}] Request received`);
	// const rawBody = await req.text()
	// console.log("Raw request body:", rawBody)

	if (req.method === "OPTIONS") {
		console.log(`[${req.method}] Handling preflight OPTIONS request`);
		return new Response("ok", { headers: corsHeaders });
	}

	try {
		if (req.method !== "POST") {
			console.log(`[${req.method}] Method not allowed`);
			return new Response(JSON.stringify({ error: "Method not allowed" }), {
				status: 405,
				headers: { ...corsHeaders, "Content-Type": "application/json" },
			});
		}

		const { rounds, user_id } = await req.json();

		if (!Array.isArray(rounds) || rounds.length === 0) {
			console.log(`[${req.method}] Missing or invalid rounds`);
			return new Response(
				JSON.stringify({ error: "Missing or invalid rounds" }),
				{
					status: 400,
					headers: { ...corsHeaders, "Content-Type": "application/json" },
				}
			);
		}

		if (!user_id) {
			console.log(`[${req.method}] Missing user_id`);
			return new Response(JSON.stringify({ error: "Missing user_id" }), {
				status: 400,
				headers: { ...corsHeaders, "Content-Type": "application/json" },
			});
		}

		const artistIds = Array.from(
			new Set(rounds.flatMap(({ targetId, guessId }) => [targetId, guessId]))
		);

		const res = await fetch(FETCH_SPOTIFY_URL, {
			method: "POST",
			headers: {
				...corsHeaders,
				"Content-Type": "application/json",
				Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
			},
			body: JSON.stringify({ artistIds }),
		});

		if (!res.ok) {
			console.log(`[${req.method}] failed to fetch artist data`);
			return new Response(
				JSON.stringify({ error: "Failed to fetch artist data" }),
				{
					status: 500,
					headers: { ...corsHeaders, "Content-Type": "application/json" },
				}
			);
		}

		const { artists } = await res.json();
		const artistMap = new Map(artists.map((a: any) => [a.id, a]));

		let totalScore = 0;
		const detailedRounds = [];

		for (const round of rounds) {
			const target = artistMap.get(round.targetId);
			const guess = artistMap.get(round.guessId);

			if (!target || !guess) {
				console.log(`[${req.method}] missing artist info`);
				return new Response(JSON.stringify({ error: "Missing artist info" }), {
					status: 400,
					headers: { ...corsHeaders, "Content-Type": "application/json" },
				});
			}

			const targetPopularity = target.popularity;
			const guessPopularity = guess.popularity;
			const diff = Math.abs(targetPopularity - guessPopularity);
			const points = Math.max(0, 100 - diff * 5);
			totalScore += points;

			detailedRounds.push({
				targetId: target.id,
				targetName: target.name,
				guessId: guess.id,
				guessName: guess.name,
				targetPopularity,
				guessPopularity,
				points,
			});
		}

		const { data, error } = await supabase.from("user_scores").insert({
			user_id,
			score: totalScore,
			details: detailedRounds,
		});

		console.log("Insert result:", { data, error });

		if (error) {
			console.error("Failed to insert score:", error.message || error);
			return new Response(JSON.stringify({ error: "Failed to save score" }), {
				status: 500,
				headers: { ...corsHeaders, "Content-Type": "application/json" },
			});
		}

		console.log(`[${req.method}] Success`);
		return new Response(
			JSON.stringify({
				success: true,
				totalScore,
				detailedRounds,
			}),
			{
				status: 200,
				headers: { ...corsHeaders, "Content-Type": "application/json" },
			}
		);
	} catch (err) {
		console.error("submit-score error:", err);
		return new Response(JSON.stringify({ error: "Internal server error" }), {
			status: 500,
			headers: { ...corsHeaders, "Content-Type": "application/json" },
		});
	}
});
