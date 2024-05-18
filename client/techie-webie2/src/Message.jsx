function Message({ title, author, text, date }) {
  return (
    <article className="message">
      <h3>{title}</h3>
      <small>By {author}</small>
      <br />
      <small>{date.toLocaleDateString()}</small>
      <hr />
      <p> {text} </p>
    </article>
  );
}

export default Message;
