import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useUser } from "../lib/UserContext";
import { getArtistById } from "../api/fetchSpotifyData";
import submitScoreToSupabase from "../lib/submitScoreToSupabase";
import ArtistCard from "./ArtistCard";
import ArtistPlaceholder from "./ArtistPlaceholder";
import AnimatedScore from "./AnimatedScore";
import ScoreIncrement from "./ScoreIncrement";

export default function Game({
	roundCount,
	updateRoundCount,
	roundResults,
	updateRoundResults,
	onGameOver,
}) {
	const user = useUser()
	const handleSubmitScore = async () => {
		if (!user) {
			console.warn('No user logged in')
			return
		}
		await submitScoreToSupabase(roundResults, user.id)
	}

	const [targetArtistList, setTargetArtistList] = useState([]);
	const [targetArtist, setTargetArtist] = useState(null);
	// const [isLoading, setIsLoading] = useState(true);
	const [selectedArtist, setSelectedArtist] = useState(null);
	const [guessSubmitted, setGuessSubmitted] = useState(false);
	const [previousScore, setPreviousScore] = useState(0);
	const [combinedScore, setCombinedScore] = useState(0);
	const [thisRoundScore, setThisRoundScore] = useState(0);
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
		getArtistById(targetArtistList[roundCount - 1])
			.then((artist) => {
				setTargetArtist(artist);
			})
			.catch((error) => {
				console.error("Error fetching artist data:", error);
				setTargetArtist(null);
			});
	}

	// fetch target artist when round count or list changes
	useEffect(() => {
		if (targetArtistList.length > 0) {
			// Only call if we have data
			handleGetTargetArtist();
		}
	}, [targetArtistList, roundCount]);

	// Update the combined score whenever new score is added to roundResults
	useEffect(() => {
		let totalScore = 0;
		roundResults.forEach((element) => {
			totalScore += element.score;
		});
		setPreviousScore(combinedScore);
		setCombinedScore(totalScore);
	}, [roundResults]);

	function handleArtistSelect(artist) {
		getArtistById(artist.id)
			.then((artist) => {
				setSelectedArtist(artist);
			})
			.catch((error) => {
				console.error("Error fetching artist data:", error);
				setSelectedArtist(null);
			});
	}

	function handleSubmitGuess() {
		setGuessSubmitted(true);
		const points = calculateRoundScore(
			targetArtist.popularity,
			selectedArtist.popularity
		);
		setThisRoundScore(points);
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

	function calculateRoundScore(targetPopularity, guessPopularity) {
		const diff = Math.abs(targetPopularity - guessPopularity);
		return Math.max(0, 100 - diff * 5);
	}

	function handleNextRound() {
		setGuessSubmitted(false);
		setSelectedArtist(null);
		updateRoundCount((prevRound) => prevRound + 1);
	}

	return (
		<section className="game-content">
			<div className="round-info">
				<h1>Round {roundCount}</h1>
				<div className="score-display-line">
					<AnimatedScore
						previousScore={previousScore}
						newScore={combinedScore}
						duration={1.4}
					/>
					{guessSubmitted && (
						<ScoreIncrement
							startValue={thisRoundScore}
							endValue={0}
							duration={1.4}
						/>
					)}
				</div>
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
