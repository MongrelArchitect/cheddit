import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import database from '../util/firestore';
import PostControl from './PostControl';

export default function Post({
  author,
  board,
  content,
  image,
  number,
  replies,
  setUser,
  subject,
  thread,
  thumb,
  time,
  user,
}) {
  const [boardOwner, setBoardOwner] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const toggleExpandedImage = () => {
    setExpanded(!expanded);
  };

  const formatText = (string) => {
    // turn any proper ">>" reply into a link to the post
    const reply = /^>>\d+$/;
    const greentext = /^>[^>\n]*$/;
    if (string.match(reply)) {
      return (
        <span>
          <a href={`#${string.slice(2)}`}>{string}</a>
        </span>
      );
    }
    if (string.match(greentext)) {
      return <span className="greentext">{string}</span>;
    }
    return <span>{string}</span>;
  };

  useEffect(() => {
    const setOwnerFromDatabase = async () => {
      const boardRef = doc(database, 'boards', board);
      const boardSnap = await getDoc(boardRef);
      setBoardOwner(boardSnap.data().owner);
    };
    setOwnerFromDatabase();
  }, []);

  return (
    <article className={number === thread ? 'post' : 'post reply'} id={number}>
      <span className="post-info">
        {subject ? <span aria-label="subject">{subject}</span> : null}
        <span aria-label="author">{author || 'Anonymous'}</span>
        <span aria-label="timestamp">{new Date(time).toLocaleString()}</span>
        <span aria-label="post number">{`#${number}`}</span>
        {replies.length === 0
          ? null
          : replies.map((reply) => (
            <a key={`${number}-${reply}`} href={`#${reply}`}>
              {reply}
            </a>
          ))}
      </span>
      {user ? (
        <span>
          {user.uid === boardOwner ? (
            <PostControl
              board={board}
              number={number}
              setUser={setUser}
              thread={thread}
              user={user}
            />
          ) : null}
        </span>
      ) : null}
      <span>
        {thumb ? (
          <input
            alt=""
            aria-label="post-image"
            onClick={toggleExpandedImage}
            src={expanded ? image : thumb}
            type="image"
          />
        ) : null}
        <span aria-label="post content">
          {content
            ? content.split('\n').map((line, index) => (
              // post content comes from a <textarea> which can contain
              // newline "\n" characters as part of the string stored in
              // the cloud firestore database.

              // seem safe to use the index as part of the key here, since
              // we're also using the unique post number.

                // eslint-disable-next-line
                <p key={`#${number}-line${index}`}>{formatText(line, index)}</p>
            ))
            : null}
        </span>
      </span>
    </article>
  );
}
