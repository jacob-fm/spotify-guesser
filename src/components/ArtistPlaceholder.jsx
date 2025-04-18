import { useState } from "react";
import artistsData from "../data/artists.json";
import SearchResult from "./SearchResult";

export default function ArtistPlaceholder() {
	const [searchInput, setSearchInput] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	// for selecting search results with keyboard
	const [selectedItemIndex, setSelectedItemIndex] = useState(-1);

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
	// This version uses placeholder user data
	// const fetchData = (value) => {
	// 	fetch("https://jsonplaceholder.typicode.com/users")
	// 		.then((response) => response.json())
	// 		.then((json) => {
	//             const results = json.filter((user) => {
	//                 return user  && user.name && user.name.toLowerCase().includes(value.toLowerCase());
	//             })
	//             console.log("Search Results:", results);
	// 		});
	// };

	// This version uses dummy artist data from data/artists.json
	const fetchData = (value) => {
		const results = artistsData.filter((artist) => {
			return artist && artist.name.toLowerCase().includes(value.toLowerCase());
		});
		setSearchResults(results);
	};

	const handleChange = (value) => {
		setSearchInput(value);
		fetchData(value);
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
			handleChange(searchResults[selectedItemIndex].name);
			console.log("Selected Artist:", searchResults[selectedItemIndex]);
		}
	};

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
