import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

function SearchResultsPage() {
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get("q");

  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDiscussions = async () => {
      setIsLoading(true);
      try {
        // Make an API request to fetch discussions filtered by the search query
        const response = await axios.get(
          `http://localhost:4000/api/search/discussions?search=${encodeURIComponent(
            searchQuery
          )}`
        );
        if (response.status === 200) {
          setResults(response.data);
        } else {
          throw new Error("Failed to fetch discussions");
        }
      } catch (error) {
        console.error("Error fetching discussions:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };
    if (searchQuery) {
      fetchDiscussions();
    } else {
      // If searchQuery is empty, clear the results
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
              {/* Display the discussion details */}
              <p>Title: {result.title}</p>
              <p>Content: {result.content}</p>
              <p>Username: {result.username}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchResultsPage;
