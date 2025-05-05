import useDebounce from "../hooks/useDebounce";
import fetchSpotifyData from "../api/fetchSpotifyData";
import { useState, useEffect, useRef } from "react";
import artistsData from "../data/artists.json";
import SearchResult from "./SearchResult";

export default function ArtistPlaceholder() {
	const [searchInput, setSearchInput] = useState("");
	const debouncedInput = useDebounce(searchInput);
	const [searchResults, setSearchResults] = useState([]);
	// for selecting search results with keyboard
	const [selectedItemIndex, setSelectedItemIndex] = useState(-1);

	// Simple cache object stored in a ref
	const cacheRef = useRef({});

	const fetchData = (value) => {
		const lowerValue = value.toLowerCase();
		// Check if the result is already cached, use it if available
		if (cacheRef.current[lowerValue]) {
			setSearchResults(cacheRef.current[lowerValue]);
			return;
		}

		// Otherwise, filter the data
		const results = artistsData.filter((artist) =>
			artist.name.toLowerCase().includes(lowerValue)
		);
		// Cache the results
		cacheRef.current[lowerValue] = results;
		setSearchResults(results);
	};

	useEffect(() => {
		if (debouncedInput.length > 0) {
			fetchData(debouncedInput);
		} else {
			setSearchResults([]);
		}
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
				Math.min(prevIndex + 1, searchResults.length - 1)
			);
		} else if (e.key === "Enter" && selectedItemIndex >= 0) {
			const selected = searchResults[selectedItemIndex];
			handleChange(selected.name);
			console.log("Selected Artist:", selected.name);
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
					/>
				))}
			</div>
		);
	}
	return (
		<div className="artist-card">
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
				<span className="artist-image-placeholder">?</span>
				<span className="monthly-listeners">Monthly Listeners:</span>
				<span className="monthly-listeners">???</span>
			</div>
		</div>
	);
}
