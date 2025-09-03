import { useEffect, useRef, useState } from "react";
import { searchSpotifyArtists } from "/src/api/fetchSpotifyData";
import useDebounce from "/src/hooks/useDebounce";
import SearchResult from "./SearchResult";
import { SearchIcon, XIcon } from "lucide-react";
import "./SearchScreen.css";

export default function SearchScreen({
  onArtistSelect,
  targetArtist,
  setIsSearching,
}) {
  const [searchInput, setSearchInput] = useState("");
  const debouncedInput = useDebounce(searchInput, 300);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  // for selecting search results with keyboard
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1);

  // Simple cache object stored in a ref
  const cacheRef = useRef({});

  // for leaving search when escape is pressed
  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        setIsSearching(false);
      }
    });
  }, []);

  // for getting search results
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
      setLoading(true);
      // Fetch from Spotify API and cache it
      searchSpotifyArtists(debouncedInput)
        .then((results) => {
          const filteredResults = results.filter(
            (artist) => artist.id !== targetArtist.id,
          );
          cacheRef.current[debouncedInput] = filteredResults;
          setSearchResults(filteredResults);
        })
        .catch((err) => {
          console.error("Error fetching from Spotify:", err);
        })
        .finally(() => setLoading(false));
    }
  }, [debouncedInput]);

  const handleChange = (value) => {
    setSearchInput(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (selectedItemIndex > 0) {
        setSelectedItemIndex((prevIndex) => Math.max(prevIndex - 1, 0));
      }
    } else if (
      e.key === "ArrowDown"
    ) {
      e.preventDefault();
      if (selectedItemIndex < searchResults.length - 1) {
        setSelectedItemIndex((prevIndex) =>
          Math.min(prevIndex + 1, searchResults.length - 1)
        );
      }
    } else if (e.key === "Enter" && selectedItemIndex >= 0) {
      const selected = searchResults[selectedItemIndex];
      onArtistSelect(selected);
    }
  };

  function SearchResultsList({ results }) {
    return (
      <div className={`search-results-list ${loading ? "loading" : ""}`}>
        {results.map((artist, index) => (
          <SearchResult
            key={index}
            artistName={artist.name}
            isActive={index === selectedItemIndex}
            onClick={loading ? null : () => onArtistSelect(artist)}
          />
        ))}
      </div>
    );
  }

  function handleCloseSearch() {
    setIsSearching(false);
  }

  return (
    <section className="search-screen">
      <div className="top-row">
        <div className="search-input-container">
          <SearchIcon size={35} />
          <input
            autoFocus
            id="artist-search-input"
            type="text"
            placeholder="Type to search..."
            value={searchInput}
            onChange={(e) => handleChange(e.target.value)}
            className="artist-search-input"
            autoComplete="off"
            onKeyDown={handleKeyDown}
          />
        </div>
        <XIcon size={50} onClick={handleCloseSearch} />
      </div>
      {searchInput.length > 0 && <SearchResultsList results={searchResults} />}
    </section>
  );
}
