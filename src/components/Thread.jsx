import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import database from '../util/firestore';
import Reply from './Reply';
import Post from './Post';

async function loadBoard(id) {
  // get the board info from firebase
  const boardRef = doc(database, 'boards', id);
  const boardSnap = await getDoc(boardRef);
  return boardSnap.data();
}

async function loadPosts(board, op) {
  // get all the posts for this thread
  const { posts } = await loadBoard(board);
  const postKeys = Object.keys(posts);
  const threadPosts = [];
  postKeys.forEach((key) => {
    if (posts[key].thread === op) {
      posts[key].number = +key;
      threadPosts.push(posts[key]);
    }
  });
  return threadPosts;
}

export default function Thread({
  board, boards, name, op, setUser, user,
}) {
  const [postContent, setPostContent] = useState('');
  const [posts, setPosts] = useState([]);
  const [replyEnabled, setReplyEnabled] = useState(false);

  const readDatabase = async () => {
    setPosts(await loadPosts(board, op));
  };

  useEffect(() => {
    readDatabase();
  }, [boards]);

  if (posts.length > 0) {
    return (
      <div aria-label="thread" className="thread">
        <h1>{name}</h1>
        <Reply
          board={board}
          enabled={replyEnabled}
          postContent={postContent}
          readDatabase={readDatabase}
          setEnabled={setReplyEnabled}
          setPostContent={setPostContent}
          thread={op}
          user={user}
        />
        {posts.map((post) => (
          <Post
            author={post.author}
            authorID={post.authorID}
            board={board}
            content={post.content}
            image={post.image}
            inThread
            isSticky={post.isSticky}
            key={post.number}
            number={post.number}
            postContent={postContent}
            replies={post.replies}
            setPostContent={setPostContent}
            setReplyEnabled={setReplyEnabled}
            setUser={setUser}
            subject={post.subject}
            thread={op}
            thumb={post.thumb}
            time={post.time}
            user={user}
          />
        ))}
      </div>
    );
  }
  return (
    <div aria-label="thread" className="thread">
      <span>Loading...</span>
    </div>
  );
}
