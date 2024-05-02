function MessageList({ messages }) {
  return (
    <div>
      <h2>Messages</h2>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>
            <p>{message.msg}</p>
            <p>{message.username}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MessageList;
