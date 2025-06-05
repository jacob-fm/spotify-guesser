import { useState, useEffect } from "react";
// import targetPool from "../data/target_pool.json";
import { supabase } from "../lib/supabaseClient";
import { getArtistById } from "../api/fetchSpotifyData";
import ArtistCard from "./ArtistCard";
import ArtistPlaceholder from "./ArtistPlaceholder";

// function getRandomTargetArtistId(usedIds) {
// 	const availableArtists = targetPool.filter(
// 		(artist) => !usedIds.includes(artist.id)
// 	);
// 	if (availableArtists.length === 0) {
// 		console.warn("All artists have been used - recycling pool");
// 		return targetPool[Math.floor(Math.random() * targetPool.length)].id;
// 	}
// 	const randomIndex = Math.floor(Math.random() * availableArtists.length);
// 	return availableArtists[randomIndex].id;
// }

export default function Game({
	roundCount,
	updateRoundCount,
	roundResults,
	updateRoundResults,
	onGameOver,
}) {
	const [targetArtistList, setTargetArtistList] = useState([]);
	const [targetArtist, setTargetArtist] = useState(null);
	// const [isLoading, setIsLoading] = useState(true);
	const [selectedArtist, setSelectedArtist] = useState(null);
	const [guessSubmitted, setGuessSubmitted] = useState(false);
	const [combinedScore, setCombinedScore] = useState(0);
	const totalRounds = 5;
	const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format

	// Fetch the game data for today from Supabase
	useEffect(() => {
		const fetchTodaysGame = async () => {
			try {
				// setIsLoading(true);
				const { data, error } = await supabase
					.from("daily_games")
					.select("*")
					.eq("date", today)
					.single();

				if (error) throw error;
				setTargetArtistList(data.targets);
			} catch (error) {
				console.error("Error fetching game data:", error);
			} finally {
				// setIsLoading(false);
			}
		};

		fetchTodaysGame();
	}, []);

	function handleGetTargetArtist() {
		console.log("attempted ID:", targetArtistList[roundCount - 1]);
		getArtistById(targetArtistList[roundCount - 1])
			.then((artist) => {
				setTargetArtist(artist);
				// console.log("Fetched Target Artist:", artist);
			})
			.catch((error) => {
				console.error("Error fetching artist data:", error);
				setTargetArtist(null);
			});
	}

	// function handleTargetArtistSelection() {
	// 	// Get array of previously used target artist IDs
	// 	const usedTargetIds = roundResults.map((result) => result.target.id);

	// 	const randomId = getRandomTargetArtistId(usedTargetIds);
	// 	getArtistById(randomId)
	// 		.then((artist) => {
	// 			setTargetArtist(artist);
	// 		})
	// 		.catch((error) => {
	// 			console.error("Error fetching artist data:", error);
	// 			setTargetArtist(null);
	// 		});
	// }

	useEffect(() => {
		if (targetArtistList.length > 0) {
			// Only call if we have data
			handleGetTargetArtist();
		}
	}, [targetArtistList, roundCount]); 

	// Update the combined score whenever roundResults change
	useEffect(() => {
		let totalScore = 0;
		roundResults.forEach((element) => {
			totalScore += element.score;
		});
		setCombinedScore(totalScore);
	}, [roundResults]);

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
		const points = Math.max(0, (100 - diff) * 10);
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
		// handleTargetArtistSelection();
	}

	return (
		<section className="game-content">
			<div className="round-info">
				<h1>Round {roundCount}</h1>
				<span className="score">Score: {combinedScore}</span>
			</div>
			<hr />
			<div className="artist-cards-container">
				<div>
					<h2>Target Artist:</h2>
					{targetArtist ? (
						<ArtistCard artist={targetArtist} visibleScore={guessSubmitted} />
					) : (
						<div className="loading-placeholder">
							<p>Loading...</p>
						</div>
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
			{selectedArtist != null &&
				(guessSubmitted ? (
					roundCount >= totalRounds ? (
						<button className="game-over-button" onClick={onGameOver}>
							See Score
						</button>
					) : (
						<button className="next-round-button" onClick={handleNextRound}>
							Next Round
						</button>
					)
				) : (
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
				))}
		</section>
	);
}
