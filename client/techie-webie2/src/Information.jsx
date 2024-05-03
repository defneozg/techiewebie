import { useState, useEffect } from 'react';

function Information() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    // TODO get les nouvelles informations de API
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