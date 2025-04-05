import ArtistCard from "./ArtistCard";
import ArtistPlaceholder from "./ArtistPlaceholder";
import artists from "/src/data/artists.json";
export default function Game({ roundCount, score }) {
	return (
		<section className="game-content">
			<h1>Round {roundCount}</h1>
			<span className="score">Score: {score}</span>
			<hr />
			<div className="artist-cards-container">
				<div>
					<h2>Target Artist:</h2>
					<ArtistCard artist={artists[0]} />
				</div>
				<div>
					<h2>Your Pick:</h2>
					<ArtistPlaceholder />
				</div>
			</div>
		</section>
	);
}
