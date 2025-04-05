export default function ArtistCard({artist}) {
    return (
        <div className='artist-card'>
            <div className='artist-info'>
                <span className="artist-name">{artist.name}</span>
                <img src='/src/assets/drake.webp' alt='drake' />
                <span className="monthly-listeners">Monthly Listeners:</span>
                <span className="monthly-listeners">{artist.listeners} </span>
            </div>
        </div>
    );
}
