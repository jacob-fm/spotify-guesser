import ArtistCard from "./ArtistCard";
import artists from "/src/data/artists.json"
export default function Game({ roundCount, score }) {
    return (
        <section className='game-content'>
            <h1>Round {roundCount}</h1>
            <span className='score'>Score: {score}</span>
            <hr />
            <div className='artist-cards-container'>
                <ArtistCard artist={artists[0]}/>
                <ArtistCard artist={artists[0]} />
            </div>
        </section>
    );
}
