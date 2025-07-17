import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.js";

serve(async (req) => {
	// Only allow POST requests
	if (req.method !== "POST") {
		return new Response(JSON.stringify({ error: "Method not allowed" }), {
			status: 405,
			headers: { ...corsHeaders, "Content-Type": "application/json" },
		});
	}

	// Get Spotify credentials from env
	const clientId = Deno.env.get("SPOTIFY_CLIENT_ID");
	const clientSecret = Deno.env.get("SPOTIFY_CLIENT_SECRET");

	if (!clientId || !clientSecret) {
		return new Response(
			JSON.stringify({ message: "Spotify client credentials are missing." }),
			{
				status: 500,
				headers: { ...corsHeaders, "Content-Type": "application/json" },
			}
		);
	}

	// Step 1: Fetch access token
	const authHeader = "Basic " + btoa(`${clientId}:${clientSecret}`);

	const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
		method: "POST",
		headers: {
			...corsHeaders,
			"Content-Type": "application/x-www-form-urlencoded",
			Authorization: authHeader,
		},
		body: "grant_type=client_credentials",
	});

	if (!tokenRes.ok) {
		return new Response(
			JSON.stringify({ error: "Failed to get access token from Spotify" }),
			{
				status: tokenRes.status,
				headers: { ...corsHeaders, "Content-Type": "application/json" },
			}
		);
	}

	const { access_token } = await tokenRes.json();

	// Step 2: Parse artistIds from request
	let artistIds = [];
	try {
		const body = await req.json();
		artistIds = body.artistIds;

		if (!Array.isArray(artistIds) || artistIds.length === 0) {
			return new Response(
				JSON.stringify({ error: "artistIds must be a non-empty array" }),
				{
					status: 400,
					headers: { ...corsHeaders, "Content-Type": "application/json" },
				}
			);
		}
	} catch (err) {
		return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
			status: 400,
			headers: { ...corsHeaders, "Content-Type": "application/json" },
		});
	}

	// Step 3: Fetch each artist by ID
	const artistData = [];

	for (const id of artistIds) {
		const artistRes = await fetch(`https://api.spotify.com/v1/artists/${id}`, {
			headers: {
				Authorization: `Bearer ${access_token}`,
			},
		});

		if (!artistRes.ok) {
			return new Response(
				JSON.stringify({ error: `Failed to fetch artist: ${id}` }),
				{
					status: 500,
					headers: { ...corsHeaders, "Content-Type": "application/json" },
				}
			);
		}

		const data = await artistRes.json();
		artistData.push({
			id: data.id,
			name: data.name,
			popularity: data.popularity,
		});
	}

	return new Response(JSON.stringify({ artists: artistData }), {
		status: 200,
		headers: { ...corsHeaders, "Content-Type": "application/json" },
	});
});
