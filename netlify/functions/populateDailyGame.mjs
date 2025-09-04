import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

async function resetArtistPool() {
  console.log("Resetting artist pool: marking all artists unused");
  const { error } = await supabase
    .from("target_pool")
    .update({ used: false })
    .eq("used", true);
  if (error) {
    console.error("Error resetting artist pool:", error);
    return false;
  }
  console.log("Artist pool successfully reset.");
  return true;
}

export default async (req) => {
  const today = new Date().toISOString().slice(0, 10);

  // 1. Get all unused artists
  let { data: availableArtists, error: fetchError } = await supabase
    .from("target_pool")
    .select("*")
    .eq("used", false);

  if (fetchError) {
    console.error("Error fetching available artists:", fetchError);
    return new Response("Failed to fetch available artists", { status: 500 });
  }

  // Check for reset condition
  if (availableArtists.length <= 10) {
    const resetSuccess = await resetArtistPool();
    if (!resetSuccess) {
      return new Response("Failed to reset artist pool", { status: 500 });
    }
    // Re-fetch all artists after reset
    const { data: allArtists, error: refetchError } = await supabase
      .from("target_pool")
      .select("*");

    if (refetchError) {
      console.error("Error re-fetching artists after reset:", refetchError);
      return new Response("Failed to re-fetch artists after reset", {
        status: 500,
      });
    }
    availableArtists = allArtists;
  }

  // 2. Shuffle and pick 5
  const shuffled = [...availableArtists].sort(() => 0.5 - Math.random());
  const selectedTargets = shuffled.slice(0, 5);
  const selectedIds = selectedTargets.map((artist) => artist.id);

  // 3. Insert new daily game row
  const { error: insertError } = await supabase
    .from("daily_games")
    .insert([{ date: today, targets: selectedIds }]);

  if (insertError) {
    console.error("Insert failed:", insertError);
    return new Response("Failed to insert daily game", { status: 500 });
  }

  // 4. Mark selected artists as used
  const { error: updateError } = await supabase
    .from("target_pool")
    .update({ used: true })
    .in("id", selectedIds); // .in allows bulk update where id is in the selected list

  if (updateError) {
    console.error("Failed to mark artists as used:", updateError);
    return new Response("Failed to update artist usage", { status: 500 });
  }

  console.log(
    `Inserted daily game and marked ${selectedIds.length} artists as used for ${today}`,
  );
  return new Response("Success", { status: 200 });
};

export const config = {
  schedule: "@daily",
};
