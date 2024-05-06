import { useState, useEffect } from "react";

function SearchResultsPage({ searchQuery }) {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchQuery) {
      setIsLoading(true);
      // Filtrer les données basées sur le searchQuery
      /*const filteredResults = data.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setResults(filteredResults);
      setIsLoading(false);*/
    } else {
      setResults([]);
    }
  }, [searchQuery]);

  return (
    <div>
      <h2>Search Results</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {results.map((result) => (
            <li key={result.id}>
              {result.name} ({result.category})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchResultsPage;
