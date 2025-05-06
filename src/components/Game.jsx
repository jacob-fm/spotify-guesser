import { useState, useEffect } from "react";
import targetPool from "../data/target_pool.json";
import { getArtistById } from "../api/fetchSpotifyData";
import ArtistCard from "./ArtistCard";
import ArtistPlaceholder from "./ArtistPlaceholder";

function getRandomTargetArtistId() {
	const randomIndex = Math.floor(Math.random() * targetPool.length);
	return targetPool[randomIndex].id;
}

export default function Game({
	roundCount,
	updateRoundCount,
	roundResults,
	updateRoundResults,
	onGameOver,
}) {
	const [targetArtist, setTargetArtist] = useState(null);
	const [selectedArtist, setSelectedArtist] = useState(null);
	const [guessSubmitted, setGuessSubmitted] = useState(false);
	const [combinedScore, setCombinedScore] = useState(0);
	const totalRounds = 2;

	function handleTargetArtistSelection() {
		const randomId = getRandomTargetArtistId();
		getArtistById(randomId)
			.then((artist) => {
				setTargetArtist(artist);
				// console.log("Fetched Target Artist:", artist);
			})
			.catch((error) => {
				console.error("Error fetching artist data:", error);
				setTargetArtist(null);
			});
	}

	useEffect(() => {
		handleTargetArtistSelection();
	}, []);

	useEffect(() => {
		let totalScore = 0;
		roundResults.forEach((element) => {
			totalScore += element.score;
		});
		setCombinedScore(totalScore);
	}, [roundResults]);

	// console.log("Target Artist:", targetArtist);

	function handleArtistSelect(artist) {
		getArtistById(artist.id)
			.then((artist) => {
				setSelectedArtist(artist);
				// console.log("Fetched Selected Artist:", artist);
			})
			.catch((error) => {
				console.error("Error fetching artist data:", error);
				setSelectedArtist(null);
			});
	}

	function handleSubmitGuess() {
		setGuessSubmitted(true);
		const diff = Math.abs(targetArtist.popularity - selectedArtist.popularity);
		const points = Math.max(0, 100 - diff * 5);
		updateRoundResults((prev) => [
			...prev,
			{
				round: prev.length + 1,
				target: {
					id: targetArtist.id,
					name: targetArtist.name,
					popularity: targetArtist.popularity,
				},
				guessed: {
					id: selectedArtist.id,
					name: selectedArtist.name,
					popularity: selectedArtist.popularity,
				},
				score: points,
			},
		]);
	}

	function handleNextRound() {
		setGuessSubmitted(false);
		setSelectedArtist(null);
		updateRoundCount((prevRound) => prevRound + 1);
		handleTargetArtistSelection();
	}

	return (
		<section className="game-content">
			<h1>Round {roundCount}</h1>
			<span className="score">Score: {combinedScore}</span>
			<hr />
			<div className="artist-cards-container">
				<div>
					<h2>Target Artist:</h2>
					{targetArtist ? (
						<ArtistCard artist={targetArtist} visibleScore={guessSubmitted} />
					) : (
						<p>Loading target artist...</p>
					)}
				</div>
				<div>
					<h2>Your Pick:</h2>
					{selectedArtist != null ? (
						<>
							<ArtistCard
								artist={selectedArtist}
								visibleScore={guessSubmitted}
							/>
						</>
					) : (
						<ArtistPlaceholder
							onArtistSelect={handleArtistSelect}
							targetArtist={targetArtist}
						/>
					)}
				</div>
			</div>
			{selectedArtist != null ? (
				<div className="post-guess-buttons">
					<button
						className="reset-button"
						onClick={() => setSelectedArtist(null)}
						disabled={guessSubmitted}
					>
						Reset Selection
					</button>
					<button
						className="submit-guess-button"
						onClick={() => {
							handleSubmitGuess();
						}}
						disabled={guessSubmitted}
					>
						Submit Guess
					</button>
				</div>
			) : null}
			{guessSubmitted &&
				(roundCount >= totalRounds ? (
					<button className="game-over-button" onClick={onGameOver}>
						See Score
					</button>
				) : (
					<button className="next-round-button" onClick={handleNextRound}>
						Next Round
					</button>
				))}
		</section>
	);
}
