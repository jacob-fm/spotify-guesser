import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.js";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variable",
  );
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

Deno.serve(async (req) => {
  console.log(`[${req.method}] Request received`);

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
    console.log("Rounds:", rounds);
    console.log("user_id:", user_id);

    // first, check if a game for today already exists
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    // Check if row already exists for this user today
    const { data: existing, error: existingError } = await supabase
      .from("user_scores")
      .select("id, score, game_date, details")
      .eq("user_id", user_id)
      .gte("game_date", `${today}T00:00:00.000Z`)
      .lte("game_date", `${today}T23:59:59.999Z`)
      .maybeSingle();

    if (existingError) {
      console.error("Error checking existing score:", existingError);
      return new Response(
        JSON.stringify({ error: "Error checking existing score" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }
    if (existing) {
      // already exists for today's local day
      console.log("User already has a score for today:", existing);
      return new Response(
        JSON.stringify({
          success: true,
          alreadyExists: true,
          detailedRounds: existing.details,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // if above code passed, move onto validating game data before uploading
    if (!Array.isArray(rounds) || rounds.length === 0) {
      console.log(`[${req.method}] Missing or invalid rounds`);
      return new Response(
        JSON.stringify({ error: "Missing or invalid rounds" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
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
      new Set(
        rounds.flatMap((r) => [r.target.id, r.guessed.id]),
      ),
    );

    // Get Spotify credentials from env
    const spotifyClientId = Deno.env.get("SPOTIFY_CLIENT_ID");
    const spotifyClientSecret = Deno.env.get("SPOTIFY_CLIENT_SECRET");

    if (!spotifyClientId || !spotifyClientSecret) {
      return new Response(
        JSON.stringify({ message: "Spotify client credentials are missing." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Fetch Spotify access token
    const authHeader = "Basic " +
      btoa(`${spotifyClientId}:${spotifyClientSecret}`);
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
        },
      );
    }
    const { access_token } = await tokenRes.json();

    // Fetch each artist by ID

    const artistData = [];

    for (const id of artistIds) {
      const artistRes = await fetch(
        `https://api.spotify.com/v1/artists/${id}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );

      if (!artistRes.ok) {
        return new Response(
          JSON.stringify({ error: `Failed to fetch artist: ${id}` }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      const data = await artistRes.json();
      artistData.push({
        id: data.id,
        name: data.name,
        popularity: data.popularity,
      });
    }

    const artistMap = new Map(artistData.map((a) => [a.id, a]));

    let totalScore = 0;
    const detailedRounds = [];

    for (const round of rounds) {
      const target = artistMap.get(round.target.id);
      const guess = artistMap.get(round.guessed.id);

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
      },
    );
  } catch (err) {
    console.error("submit-score error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
