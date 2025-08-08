import { LoaderCircle } from "lucide-react";

export default function ArtistCard({ artist, visibleScore, isTarget }) {
  const isLoading = artist == null;
  return (
    <div className={"artist-card" + " " + (isTarget ? "target" : "guess")}>
      <h2>{isTarget ? "Your Target" : "Your Guess"}</h2>
      <hr />
      <div className="artist-info">
        <span className="artist-name">
          {isLoading ? "Loading..." : artist.name}
        </span>
        {isLoading ? (
          <div className="artist-img-loading">
            <LoaderCircle size={40} />
          </div>
        ) : (
          <img src={artist.images[0].url} />
        )}
      </div>
    </div>
  );
}
