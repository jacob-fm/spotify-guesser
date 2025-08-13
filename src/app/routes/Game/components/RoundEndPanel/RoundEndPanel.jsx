import { useState, useEffect } from "react";
import { useMotionValue, useAnimate } from "motion/react";
import "./RoundEndPanel.css";

export default function RoundEndPanel({
  guessArtist,
  targetArtist,
  nextRound,
}) {
  const [scope, animate] = useAnimate();

  const motionGuessPopularity = useMotionValue(0);
  const motionTargetPopularity = useMotionValue(0);

  const [displayGuessPopularity, setDisplayGuessPopularity] = useState(0);
  const [displayTargetPopularity, setDisplayTargetPopularity] = useState(0);

  const diff = Math.abs(targetArtist.popularity - guessArtist.popularity);
  const score = Math.max(0, 100 - diff * 5);

  // Animate progress bars
  useEffect(() => {
    const animationSequence = async () => {
      await animate(motionGuessPopularity, guessArtist.popularity, {
        duration: 2.0,
        onUpdate: (latest) => {
          setDisplayGuessPopularity(Math.round(latest));
        },
      });
      await animate(motionTargetPopularity, targetArtist.popularity, {
        duration: 2.0,
        onUpdate: (latest) => {
          setDisplayTargetPopularity(Math.round(latest));
        },
      });
    };
    animationSequence();
  }, []);

  return (
    <div className="overlay">
      <div className="round-end-panel">
        <div className="guess-section">
          <h2>Your Guess</h2>
          <div className="artist-info-container">
            <span className="artist-name">{guessArtist.name}</span>
            <span>Popularity: {displayGuessPopularity}/100</span>
            <progress value={displayGuessPopularity} max={100} />
          </div>
        </div>
        <div className="target-section">
          <h2>Your Target</h2>
          <div className="artist-info-container">
            <span className="artist-name">{targetArtist.name}</span>
            <span>Popularity: {displayTargetPopularity}/100</span>
            <progress value={displayTargetPopularity} max={100} />
          </div>
        </div>
        <span>Difference = {diff}</span>
        <span>
          Round score:
          <br />
          100 - (5x Difference) =
        </span>
        <span className="final-round-score">{score}</span>
        <button className="filled" onClick={nextRound}>
          Next Round
        </button>
      </div>
    </div>
  );
}
