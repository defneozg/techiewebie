import { Link } from 'react-router-dom';

function DiscussionList({ discussions }) {
  return (
    <div>
      <h2>Discussions</h2>
      <ul>
        {discussions.map((discussion) => (
          <li key={discussion.id}>
            <h3>{discussion.title}</h3>
            <p>{discussion.content}</p>
            <Link to={`/discussion/${discussion.id}`}>View Discussion</Link> {/* Link to DiscussionPage */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DiscussionList;