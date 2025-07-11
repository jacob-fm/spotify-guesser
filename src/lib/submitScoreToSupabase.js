export default async function submitScoreToSupabase(rounds, userId) {
	try {
		const response = await fetch(
			"https://jyskxullnyuwlnsfcxoc.supabase.co/functions/v1/submit-score",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					user_id: userId,
					rounds,
				}),
			}
		);

		const result = await response.json();

		if (!response.ok) {
			console.error("Error submitting score:", result.error || result.message);
			return null;
		}

		console.log("Score submitted successfully:", result);
		return result;
	} catch (err) {
		console.error("Unexpected error submitting score:", err);
		return null;
	}
}
