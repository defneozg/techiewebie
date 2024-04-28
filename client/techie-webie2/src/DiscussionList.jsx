import { Link } from 'react-router-dom';
import DiscussionPage from './DiscussionPage';

function DiscussionList({ discussions }) {
  return (
    <div>
      <h2>Discussions</h2>
      <ul>
        {discussions.map((discussion, index) => (
          <li key={discussion._id || index}>
            <h3>{discussion.title}</h3>
            <p>{discussion.content}</p>
            <Link to={`/discussion/${DiscussionPage.discussionId}`}>View Discussion</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DiscussionList;
