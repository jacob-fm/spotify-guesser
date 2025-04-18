export default function SearchResult({artistName, isActive}) {
    return (
        <span className={ `search-result ${isActive ? "active" : ""}` }>
            { artistName ? artistName : "placeholder" }
        </span>
    )
}