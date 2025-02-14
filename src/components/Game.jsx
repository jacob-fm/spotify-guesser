import ArtistCard from "./ArtistCard";
export default function Game({ roundCount, score }) {
    return (
        <section className='game-content'>
            <h1>Round {roundCount}</h1>
            <span className='score'>Score: {score}</span>
            <hr />
            <div className='artist-cards-container'>
                <ArtistCard />
                <ArtistCard />
            </div>
        </section>
    );
}
