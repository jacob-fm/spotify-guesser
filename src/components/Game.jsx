export default function Game({ roundCount, score }) {
  return (
    <section className="game-content">
      <h1>Round {roundCount}</h1>
      <span className="score">Score: {score}</span>
      <hr />
    </section>
  );
}
