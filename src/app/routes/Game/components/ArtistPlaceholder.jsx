import useDebounce from "/src/hooks/useDebounce";
import { searchSpotifyArtists } from "/src/api/fetchSpotifyData";
import { useState, useEffect, useRef } from "react";
import SearchResult from "./SearchScreen/SearchResult";

export default function ArtistPlaceholder({ onArtistSelect, targetArtist }) {
  const [searchInput, setSearchInput] = useState("");
  const debouncedInput = useDebounce(searchInput);
  const [searchResults, setSearchResults] = useState([]);
  // for selecting search results with keyboard
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1);

  // Simple cache object stored in a ref
  const cacheRef = useRef({});

  useEffect(() => {
    // if the input is empty, clear the results
    if (debouncedInput.length === 0) {
      setSearchResults([]);
      return;
    }

    // Check cache
    if (cacheRef.current[debouncedInput]) {
      setSearchResults(cacheRef.current[debouncedInput]);
      // console.log("Loaded from cache");
    } else {
      // Fetch from Spotify API and cache it
      searchSpotifyArtists(debouncedInput)
        .then((results) => {
          const filteredResults = results.filter(
            (artist) => artist.id !== targetArtist.id,
          );
          cacheRef.current[debouncedInput] = filteredResults;
          setSearchResults(filteredResults);
          // console.log("Fetched from API");
        })
        .catch((err) => {
          console.error("Error fetching from Spotify:", err);
        });
    }

    // console.log("Search Results:", searchResults.length);
    // console.log("Cache Size:", Object.keys(cacheRef.current).length);
  }, [debouncedInput]);

  const handleChange = (value) => {
    setSearchInput(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp" && selectedItemIndex > 0) {
      setSelectedItemIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    } else if (
      e.key === "ArrowDown" &&
      selectedItemIndex < searchResults.length - 1
    ) {
      setSelectedItemIndex((prevIndex) =>
        Math.min(prevIndex + 1, searchResults.length - 1),
      );
    } else if (e.key === "Enter" && selectedItemIndex >= 0) {
      const selected = searchResults[selectedItemIndex];
      onArtistSelect(selected);
    }
  };

  function SearchResultsList({ results }) {
    return (
      <div className="search-results-list">
        {results.map((artist, index) => (
          <SearchResult
            key={index}
            artistName={artist.name}
            isActive={index === selectedItemIndex}
            onClick={() => onArtistSelect(artist)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="artist-card guess">
      <div className="artist-info">
        <input
          type="text"
          placeholder="Search for an artist..."
          value={searchInput}
          onChange={(e) => handleChange(e.target.value)}
          className="artist-search-input"
          autoComplete="off"
          onKeyDown={handleKeyDown}
        />
        {searchInput.length > 0 && (
          <SearchResultsList results={searchResults} />
        )}
      </div>
    </div>
  );
}
