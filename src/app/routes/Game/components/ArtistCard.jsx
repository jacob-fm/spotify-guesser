export default function ArtistCard({ artist, visibleScore }) {
    return (
        <div className='artist-card'>
            <div className='artist-info'>
                <span className="artist-name">{artist.name}</span>
                <img src={artist.images[0].url} />
                <span className="popularity-score">Popularity Score: {visibleScore ? artist.popularity : "???" }</span>
            </div>
        </div>
    );
}
