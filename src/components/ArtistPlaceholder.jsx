import { useState } from "react";
import artistsData from "../data/artists.json"

export default function ArtistPlaceholder() {
	const [searchInput, setSearchInput] = useState("");

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
			return artist && artist.name.toLowerCase().includes(value.toLowerCase())
		})
		console.log("Search Results: ", results);
	};

	const handleChange = (value) => {
		setSearchInput(value);
		fetchData(value);
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
				/>
				<span className="artist-image-placeholder">?</span>
				<span className="monthly-listeners">Monthly Listeners:</span>
				<span className="monthly-listeners">???</span>
			</div>
		</div>
	);
}
