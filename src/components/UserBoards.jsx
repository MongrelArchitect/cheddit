import React, { useEffect, useState } from 'react';
import { deleteDoc, doc } from 'firebase/firestore';
import {
  deleteObject, getStorage, listAll, ref,
} from 'firebase/storage';
import database from '../util/firestore';
import UserBoard from './UserBoard';
import NewBoard from './NewBoard';
import hourglass from '../images/loading.gif';

export default function UserBoards({ boards, setUser, user }) {
  const [enabled, setEnabled] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userBoards, setUserBoards] = useState([]);

  useEffect(() => {
    setUserBoards(user.boards);
  }, [user.boards]);

  const enableForm = () => {
    setEnabled(!enabled);
  };

  const deleteBoard = async (event) => {
    try {
      setLoading(true);
      const { board } = event.target.dataset;

      // remove the files from storage
      const storage = getStorage();
      const boardRef = ref(storage, board);
      const boardImages = await listAll(boardRef);
      const deleteImagePromises = boardImages.items.map(async (image) => {
        const imageRef = ref(storage, image);
        await deleteObject(imageRef);
      });

      // Wait for all images to delete before removing board
      await Promise.all(deleteImagePromises);

      // remove the board from firestore
      await deleteDoc(doc(database, 'boards', board));

      // remove board from local state
      const userBoardsCopy = [...userBoards];
      const index = userBoardsCopy.findIndex((element) => element.id === board);
      userBoardsCopy.splice(index, 1);
      setUserBoards(userBoardsCopy);
      setUser({
        ...user,
        boards: userBoardsCopy,
      });
      setError(null);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError({ ...err }.code);
    }
  };

  return (
    <div>
      <h1>Your Boards</h1>
      <NewBoard
        boards={boards}
        enabled={enabled}
        enableForm={enableForm}
        setUser={setUser}
        user={user}
      />
      <div className="user-boards">
        <button
          className={enabled ? 'button hidden' : 'button visible'}
          onClick={enableForm}
          type="button"
        >
          Add new board
        </button>
        <span className="error" hidden={!error}>
          Error
        </span>
        {userBoards.map((board) => (
          <UserBoard
            board={board}
            deleteBoard={deleteBoard}
            loading={loading}
            key={`ub-${board.id}`}
          />
        ))}
        {loading ? (
          <span className="loading">
            Loading...
            <img alt="" src={hourglass} />
          </span>
        ) : null}
      </div>
    </div>
  );
}
