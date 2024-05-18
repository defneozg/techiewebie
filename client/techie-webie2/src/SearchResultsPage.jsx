import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "./axiosConfig.js";

function SearchResultsPage() {
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get("q");

  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDiscussions = async () => {
      setIsLoading(true);
      try {
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
      setResults([]);
    }
  }, [searchQuery]);

  return (
    <div>
      <h2 className="rePage">Search Results</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {results.map((result, index) => (
            <li className="listItem " key={index}>
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
