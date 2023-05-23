import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import database from '../util/firestore';
import PostControl from './PostControl';
import modBadge from '../images/mod.png';
import stickyIcon from '../images/sticky.png';

export default function Post({
  author,
  authorID,
  board,
  content,
  image,
  inThread,
  isSticky,
  number,
  postContent,
  replies,
  setPostContent,
  setReplyEnabled,
  setUser,
  subject,
  thread,
  thumb,
  time,
  user,
}) {
  const [boardOwner, setBoardOwner] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const setOwnerFromDatabase = async () => {
      const boardRef = doc(database, 'boards', board);
      const boardSnap = await getDoc(boardRef);
      setBoardOwner(boardSnap.data().owner);
    };
    setOwnerFromDatabase();
  }, []);

  const toggleExpandedImage = () => {
    setExpanded(!expanded);
  };

  const formatText = (string) => {
    // turn any proper ">>" reply into a link to the post
    const reply = /^>>\d+$/;
    if (string.match(reply)) {
      return (
        <span>
          <a href={`#${string.slice(2)}`}>{string}</a>
        </span>
      );
    }
    // handle quotes / greentext ">"
    const greentext = /^>[^>\n]*$/;
    if (string.match(greentext)) {
      return <span className="greentext">{string}</span>;
    }
    return <span>{string}</span>;
  };

  const replyToPost = () => {
    // add >> link to post reply
    setReplyEnabled(true);
    const newContent = `${postContent}${
      postContent === '' ? '' : '\n'
    }>>${number}`;
    setPostContent(newContent);
  };

  const stylePost = () => {
    if (number !== thread) {
      return 'post reply';
    }
    if (number === thread && isSticky) {
      return 'post sticky';
    }
    return 'post';
  };

  return (
    <article className={stylePost()} id={number}>
      <span className="post-info">
        {subject ? <span aria-label="subject">{subject}</span> : null}
        <span aria-label="author">{author || 'Anonymous'}</span>
        {authorID === boardOwner ? (
          <img alt="mod badge" className="mod-badge" src={modBadge} />
        ) : null}
        <span aria-label="timestamp">{new Date(time).toLocaleString()}</span>
        {inThread ? (
          <button onClick={replyToPost} type="button">{`#${number}`}</button>
        ) : (
          <span aria-label="post number">{`#${number}`}</span>
        )}
        {replies.length === 0 ? null : (
          <span className="linked-posts">
            [
            {replies.map((reply) => (
              <span key={`/${board}_${number}-${reply}`}>
                <Link
                  key={`${number}-${reply}`}
                  to={`/${board}_t${thread}#${reply}`}
                >
                  {`>>${reply}`}
                </Link>
              </span>
            ))}
            ]
          </span>
        )}
      </span>
      {user ? (
        <span>
          {user.uid === boardOwner ? (
            <PostControl
              board={board}
              isSticky={isSticky}
              number={number}
              setUser={setUser}
              thread={thread}
              user={user}
            />
          ) : null}
        </span>
      ) : null}
      <span className="post-content">
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
      {isSticky ? (
        <span className="sticky-info">
          <img src={stickyIcon} alt="" />
          Sticky
        </span>
      ) : null}
    </article>
  );
}
