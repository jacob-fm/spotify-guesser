import "./RoundEndPanel.css";

export default function RoundEndPanel({
  guessArtist,
  targetArtist,
  nextRound,
}) {
  const diff = Math.abs(targetArtist.popularity - guessArtist.popularity);
  const score = Math.max(0, 100 - diff * 5);
  return (
    <div className="overlay">
      <div className="round-end-panel">
        <div className="guess-section">
          <h2>Your Guess</h2>
          <div className="artist-info-container">
            <span className="artist-name">{guessArtist.name}</span>
            <span>Popularity: {guessArtist.popularity}/100</span>
            <progress value={guessArtist.popularity} max={100} />
          </div>
        </div>
        <div className="target-section">
          <h2>Your Target</h2>
          <div className="artist-info-container">
            <span className="artist-name">{targetArtist.name}</span>
            <span>Popularity: {targetArtist.popularity}/100</span>
            <progress value={targetArtist.popularity} max={100} />
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
