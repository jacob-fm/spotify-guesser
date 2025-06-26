import fetch from "node-fetch";

export async function handler(event, context) {
	const clientId = process.env.SPOTIFY_CLIENT_ID;
	const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

	// Ensure the environment variables are loaded
	if (!clientId || !clientSecret) {
		return {
			statusCode: 500,
			body: JSON.stringify({
				message: "Spotify client credentials are missing.",
			}),
		};
	}

	// Encoding the client ID and secret
	const authHeader =
		"Basic " + Buffer.from(clientId + ":" + clientSecret).toString("base64");

	try {
		// Make the request to get the access token
		const response = await fetch("https://accounts.spotify.com/api/token", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Authorization: authHeader,
			},
			body: "grant_type=client_credentials",
		});

		// Check for successful response
		if (!response.ok) {
			return {
				statusCode: response.status,
				body: JSON.stringify({ message: "Failed to fetch access token" }),
			};
		}

		// Parse the response data
		const data = await response.json();

		return {
			statusCode: 200,
			body: JSON.stringify({
				access_token: data.access_token,
				expires_in: data.expires_in,
			}),
		};
	} catch (error) {
		console.error("Error fetching token:", error);
		return {
			statusCode: 500,
			body: JSON.stringify({ message: "Internal Server Error" }),
		};
	}
}
