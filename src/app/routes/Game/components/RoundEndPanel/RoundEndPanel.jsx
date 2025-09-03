import { useEffect, useState } from "react";
import { useAnimate, useMotionValue } from "motion/react";
import "./RoundEndPanel.css";

export default function RoundEndPanel({
  guessArtist,
  targetArtist,
  nextRound,
  showScoreboard,
  roundCount,
  totalRounds,
}) {
  const [scope, animate] = useAnimate();

  const motionGuessPopularity = useMotionValue(0);
  const motionTargetPopularity = useMotionValue(0);

  const [roundedGuessPop, setRoundedGuessPop] = useState(0);
  const [roundedTargetPop, setRoundedTaretPop] = useState(0);
  const [fullGuessPop, setFullGuessPop] = useState(0);
  const [fullTargetPop, setFullTargetPop] = useState(0);

  const diff = Math.abs(targetArtist.popularity - guessArtist.popularity);
  const score = Math.max(0, 100 - diff * 5);

  // Animate progress bars
  useEffect(() => {
    const animationSequence = async () => {
      await animate(motionGuessPopularity, guessArtist.popularity, {
        duration: 1.6,
        ease: "easeOut",
        onUpdate: (latest) => {
          setRoundedGuessPop(Math.round(latest));
          setFullGuessPop(latest);
        },
      });
      await animate(motionTargetPopularity, targetArtist.popularity, {
        duration: 1.6,
        ease: "easeOut",
        onUpdate: (latest) => {
          setRoundedTaretPop(Math.round(latest));
          setFullTargetPop(latest);
        },
      });
      await animate(".difference", { opacity: 1 }, { delay: 0.2 });
      await animate(".pre-round-score", { opacity: 1 }, { delay: 0.2 });
      await animate(".final-round-score", { opacity: 1 }, { delay: 0.2 });
    };
    animationSequence();
  }, []);

  return (
    <div className="overlay">
      <div className="round-end-panel" ref={scope}>
        <div className="guess-section">
          <h2>Your Guess</h2>
          <div className="artist-info-container">
            <span className="artist-name">{guessArtist.name}</span>
            <span>Popularity: {roundedGuessPop}/100</span>
            <progress value={fullGuessPop} max={100} />
          </div>
        </div>

        <div className="target-section">
          <h2>Your Target</h2>
          <div className="artist-info-container">
            <span className="artist-name">{targetArtist.name}</span>
            <span>Popularity: {roundedTargetPop}/100</span>
            <progress value={fullTargetPop} max={100} />
          </div>
        </div>

        <span className="difference">Difference = {diff}</span>
        <span className="pre-round-score">
          Round score:
          <br />
          100 - (5x Difference) =
        </span>
        <span className="final-round-score">{score}</span>
        {roundCount < totalRounds
          ? (
            <button className="filled" onClick={nextRound}>
              Next Round
            </button>
          )
          : (
            <button className="filled" onClick={showScoreboard}>
              View Score
            </button>
          )}
      </div>
    </div>
  );
}
