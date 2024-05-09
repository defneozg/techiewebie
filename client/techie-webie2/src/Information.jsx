import { useState, useEffect } from "react";
import axios from "./axiosConfig.js";

function Information() {
  const [news, setNews] = useState([]);

  /*useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/information"
        );
        setNews(response.data);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, []);*/

  return (
    <div className="information">
      <h2>Notices</h2>
      <ul>
        {news.map((item, index) => (
          <li key={index}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default Information;
