export default function ArtistCard({artist}) {
    return (
        <div className='artist-card'>
            <h2>Target Artist:</h2>
            <div className='artist-info'>
                <span className="artist-name">{artist.name}</span>
                <img src='/src/assets/drake.webp' alt='drake' />
                <span className="monthly-listeners">Monthly Listeners: {artist.listeners} </span>
            </div>
        </div>
    );
}
