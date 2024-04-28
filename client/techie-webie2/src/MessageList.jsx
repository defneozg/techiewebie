function MessageList({ messages }) {
  return (
    <div>
      <h2>Messages</h2>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>
            <h3>{message.title}</h3>
            <p>{message.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MessageList;
