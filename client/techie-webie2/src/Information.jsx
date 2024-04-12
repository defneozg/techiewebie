import { useState, useEffect } from 'react';

function Information() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    // Fetch news data from the API
    // Update the news state with the fetched data
  }, []);

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