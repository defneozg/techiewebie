import { Link } from "react-router-dom";

function MessageList({ messages }) {
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
      <h2>Messages</h2>
      <ul>
        {messages.map((message, index) => (
          <li className="listItem" key={index}>
            <p>{message.msg}</p>
            <Link
              className="linkUsername"
              to={`/user?username=${message.username}`}
            >
              {message.username}
            </Link>
            <p>{message.createdAt && formatDate(message.createdAt)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MessageList;
