import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import database from '../util/firestore';
import Post from './Post';

async function loadBoard(id) {
  const boardRef = doc(database, 'boards', id);
  const boardSnap = await getDoc(boardRef);
  return boardSnap.data();
}

async function loadPosts(board, op) {
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

export default function Thread({ board, op }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const readDatabase = async () => {
      setPosts(await loadPosts(board, op));
    };
    readDatabase();
  }, []);

  if (posts.length > 0) {
    return (
      <div aria-label="thread" className="thread">
        {posts.map((post) => (
          <Post
            author={post.author}
            content={post.content}
            image={post.image}
            number={post.number}
            key={post.number}
            replies={post.replies}
            subject={post.subject}
            time={post.time}
          />
        ))}
      </div>
    );
  }
  return (<span>Nothing to see here...</span>);
}
