import { useState } from "react";

function Discussion() {
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !selectedDiscussion) {
    return <div>Error fetching discussion data.</div>;
  }

  return (
    <article className="discussion">
      <h2>{selectedDiscussion.title}</h2>
      <p>By </p>
      <small>
        {selectedDiscussion.date.toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
        })}
      </small>
      <hr />
      <p>{selectedDiscussion.text}</p>
    </article>
  );
}

export default Discussion;
