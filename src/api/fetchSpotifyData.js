import 'dotenv/config';

export default async function fetchSpotifyData(query) {
    // Get access token
    const authResponse = await fetch(
      "https://accounts.spotify.com/api/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${window.btoa(process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET)}`
        },
        body: "grant_type=client_credentials"
      }
    );
    const authData = await authResponse.json();
    const accessToken = authData.access_token;
  
    // Search for artists
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${query}&type=artist&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
    const data = await response.json();
    return data.artists.items;
  }