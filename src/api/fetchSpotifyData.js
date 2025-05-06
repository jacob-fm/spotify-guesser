let accessToken = null;
let tokenExpiry = 0;

async function getAccessToken() {
	const now = Date.now();

	if (accessToken && now < tokenExpiry) {
		return accessToken; // Reuse valid token
	}

	// Request a new token from Netlify serverless function
	const tokenResponse = await fetch("/.netlify/functions/getSpotifyToken");

	if (!tokenResponse.ok) {
		throw new Error("Failed to fetch access token from Netlify function");
	}

	const tokenData = await tokenResponse.json();
	accessToken = tokenData.access_token;
	tokenExpiry = now + tokenData.expires_in * 1000; // expires_in is in seconds

	return accessToken;
}

export async function searchSpotifyArtists(query) {
	const token = await getAccessToken();

	const response = await fetch(
		`https://api.spotify.com/v1/search?q=${encodeURIComponent(
			query
		)}&type=artist&limit=5`,
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	);

	const data = await response.json();
	return data.artists.items;
}

export async function getArtistById(artistId) {
	const token = await getAccessToken();
	const response = await fetch(
		`https://api.spotify.com/v1/artists/${artistId}`,
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	);

	const data = await response.json();
	return data;
}
