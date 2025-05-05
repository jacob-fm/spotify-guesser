export default function ArtistCard({artist}) {
    return (
        <div className='artist-card'>
            <div className='artist-info'>
                <span className="artist-name">{artist.name}</span>
                <img src={artist.images[0].url} />
                <span className="monthly-listeners">Monthly Listeners:</span>
                <span className="monthly-listeners">IDK YET</span>
            </div>
        </div>
    );
}
