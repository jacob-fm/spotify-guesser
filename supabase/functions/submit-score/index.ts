import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.js";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const FETCH_SPOTIFY_URL =
	"https://jyskxullnyuwlnsfcxoc.functions.supabase.co/fetch-from-spotify";

serve(async (req) => {
	if (req.method === "OPTIONS") {
		return new Response("ok", { headers: corsHeaders });
	}

	try {
		if (req.method !== "POST") {
			return new Response(JSON.stringify({ error: "Method not allowed" }), {
				status: 405,
				headers: { "Content-Type": "application/json" },
			});
		}

		const { rounds, user_id } = await req.json();

		if (!Array.isArray(rounds) || rounds.length === 0) {
			return new Response(
				JSON.stringify({ error: "Missing or invalid rounds" }),
				{
					status: 400,
					headers: { ...corsHeaders, "Content-Type": "application/json" },
				}
			);
		}

		if (!user_id) {
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
				"Content-Type": "application/json",
				Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
			},
			body: JSON.stringify({ artistIds }),
		});

		if (!res.ok) {
			return new Response(
				JSON.stringify({ error: "Failed to fetch artist data" }),
				{ status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
