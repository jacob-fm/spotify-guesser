import { useEffect, useState } from "react";
import { supabase } from "/src/lib/supabaseClient";
import { getArtistById } from "/src/api/fetchSpotifyData";
import ArtistCard from "/src/app/routes/Game/components/ArtistCard";
import AnimatedScore from "/src/app/routes/Game/components/AnimatedScore";
import ScoreIncrement from "/src/app/routes/Game/components/ScoreIncrement";
import SearchScreen from "./components/SearchScreen/SearchScreen";
import { SearchIcon } from "lucide-react";
import "./Game.css";
import RoundEndPanel from "./components/RoundEndPanel/RoundEndPanel";
import { useViewportSize } from "@mantine/hooks";

export default function Game({
  roundCount,
  updateRoundCount,
  roundResults,
  updateRoundResults,
  onGameOver,
  today,
}) {
  const [targetArtistList, setTargetArtistList] = useState([]);
  const [targetArtist, setTargetArtist] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [guessSubmitted, setGuessSubmitted] = useState(false);
  const [previousScore, setPreviousScore] = useState(0);
  const [combinedScore, setCombinedScore] = useState(0);
  const [thisRoundScore, setThisRoundScore] = useState(0);
  const totalRounds = 5;

  const { width } = useViewportSize();
  const isMobile = width < 768;

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
  // also store in localStorage
  useEffect(() => {
    let totalScore = 0;
    roundResults.forEach((element) => {
      totalScore += element.score;
    });
    setPreviousScore(combinedScore);
    setCombinedScore(totalScore);

    // localStorage
    if (roundResults.length !== 0) {
      localStorage.setItem("currentGame", JSON.stringify(roundResults));
    }
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
    setIsSearching(false);
  }

  function handleSubmitGuess() {
    setGuessSubmitted(true);
    const points = calculateRoundScore(
      targetArtist.popularity,
      selectedArtist.popularity,
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

  function handleStartSearch() {
    setIsSearching(true);
  }

  return (
    <section className="game-content">
      <div className="round-info">
        <h2>Round {roundCount}</h2>
        <hr />
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
      <div className="artist-cards-container">
        {
          <ArtistCard
            artist={targetArtist}
            visibleScore={guessSubmitted}
            isTarget={true}
          />
        }
        {selectedArtist != null
          ? (
            <>
              <ArtistCard
                artist={selectedArtist}
                visibleScore={guessSubmitted}
                isTarget={false}
              />
            </>
          )
          : (isMobile &&
            (
              <div
                className="artist-input-placeholder"
                onClick={handleStartSearch}
              >
                <SearchIcon size={35} />
                <span>Type to search...</span>
              </div>
            ))}
      </div>
      {selectedArtist != null &&
        (guessSubmitted ? null : (
          <div className="post-guess-buttons">
            <button
              className="outlined"
              onClick={() => setSelectedArtist(null)}
              disabled={guessSubmitted}
            >
              Reset Selection
            </button>
            <button
              className="filled"
              onClick={() => {
                handleSubmitGuess();
              }}
              disabled={guessSubmitted}
            >
              Submit Guess
            </button>
          </div>
        ))}
      {guessSubmitted && (
        <RoundEndPanel
          guessArtist={selectedArtist}
          targetArtist={targetArtist}
          nextRound={handleNextRound}
          gameOver={onGameOver}
          roundCount={roundCount}
          totalRounds={totalRounds}
        />
      )}
      {(isSearching || (!isMobile && selectedArtist === null)) && (
        <SearchScreen
          onArtistSelect={handleArtistSelect}
          targetArtist={targetArtist}
          setIsSearching={setIsSearching}
        />
      )}
    </section>
  );
}
