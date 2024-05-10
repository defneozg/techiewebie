import { Link } from "react-router-dom";

function DiscussionList({ discussions }) {
  function formatDate(date) {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    };
    return new Date(date).toLocaleString("en-US", options);
  }
  return (
    <div>
      <h2>Discussions</h2>
      <ul>
        {discussions.map((discussion, index) => (
          <li className="listItem" key={discussion._id || index}>
            <h3>{discussion.title}</h3>
            <p>{discussion.content}</p>
            <p>{discussion.createdAt && formatDate(discussion.createdAt)}</p>
            <Link
              className="linkUsername"
              to={`/user?username=${discussion.username}`}
            >
              {discussion.username}
            </Link>
            <Link
              className="linkView"
              to={`/discussions/discussionId/${discussion._id}`}
            >
              View Discussion
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DiscussionList;
