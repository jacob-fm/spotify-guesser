let accessToken = null;
let tokenExpiry = 0;

async function getAccessToken() {
	const now = Date.now();

	if (accessToken && now < tokenExpiry) {
		return accessToken; // Reuse valid token
	}

	// Request new token
	const authResponse = await fetch("https://accounts.spotify.com/api/token", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			Authorization:
				"Basic " +
				window.btoa(
					import.meta.env.VITE_SPOTIFY_CLIENT_ID +
						":" +
						import.meta.env.VITE_SPOTIFY_CLIENT_SECRET
				),
		},
		body: "grant_type=client_credentials",
	});

	const authData = await authResponse.json();
	accessToken = authData.access_token;
	tokenExpiry = now + authData.expires_in * 1000; // expires_in is in seconds

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
