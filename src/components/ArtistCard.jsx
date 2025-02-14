export default function ArtistCard() {
    return (
        <div className='artist-card'>
            <h2>Target Artist:</h2>
            <div className='artist-info'>
                <span className="artist-name">Drake</span>
                <img src='/src/assets/drake.webp' alt='drake' />
                <span className="monthly-listeners">Monthly Listeners: ???</span>
            </div>
        </div>
    );
}
