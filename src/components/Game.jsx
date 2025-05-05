import { useState, useEffect } from "react";
import targetPool from "../data/target_pool.json";
import { getArtistById } from "../api/fetchSpotifyData";
import ArtistCard from "./ArtistCard";
import ArtistPlaceholder from "./ArtistPlaceholder";
// import artists from "/src/data/artists.json";

function getRandomTargetArtistId() {
	const randomIndex = Math.floor(Math.random() * targetPool.length);
	return targetPool[randomIndex].id;
}

export default function Game({ roundCount, score }) {
	const [targetArtist, setTargetArtist] = useState(null);
	const [selectedArtist, setSelectedArtist] = useState(null);

	useEffect(() => {
		const randomId = getRandomTargetArtistId();
		getArtistById(randomId)
			.then((artist) => {
				setTargetArtist(artist);
				console.log("Fetched Target Artist:", artist);
			})
			.catch((error) => {
				console.error("Error fetching artist data:", error);
				setTargetArtist(null);
			});
	}, []);

	console.log("Target Artist:", targetArtist);

	function handleArtistSelect(artist) {
		getArtistById(artist.id)
			.then((artist) => {
				setSelectedArtist(artist);
				console.log("Fetched Selected Artist:", artist);
			})
			.catch((error) => {
				console.error("Error fetching artist data:", error);
				setSelectedArtist(null);
			});
	}

	return (
		<section className="game-content">
			<h1>Round {roundCount}</h1>
			<span className="score">Score: {score}</span>
			<hr />
			<div className="artist-cards-container">
				<div>
					<h2>Target Artist:</h2>
					{targetArtist ? (
						<ArtistCard artist={targetArtist} />
					) : (
						<p>Loading target artist...</p>
					)}
				</div>
				<div>
					<h2>Your Pick:</h2>
					{selectedArtist != null ? (
						<>
							<ArtistCard artist={selectedArtist} />
						</>
					) : (
						<ArtistPlaceholder onArtistSelect={handleArtistSelect} />
					)}
				</div>
			</div>
			{selectedArtist != null ? (
				<div className="post-guess-buttons">
					<button
						className="reset-button"
						onClick={() => setSelectedArtist(null)}
					>
						Reset Selection
					</button>
					<button
						className="submit-guess-button"
						onClick={() => {
							console.log("Submit Guess");
							// Handle guess submission logic here
						}}
					>
						Submit Guess
					</button>
				</div>
			) : null}
		</section>
	);
}
