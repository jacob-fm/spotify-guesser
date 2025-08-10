export default function SearchResult({ artistName, isActive, onClick }) {
	return (
		<span
			className={`search-result ${isActive ? "active" : ""}`}
			onClick={onClick}
		>
			{artistName ? artistName : "placeholder"}
		</span>
	);
}
