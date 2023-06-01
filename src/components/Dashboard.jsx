import React, { useEffect, useState } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import Login from './Login';
import UserBoards from './UserBoards';
import UserThreads from './UserThreads';
import UserPosts from './UserPosts';
import hourglass from '../images/loading.gif';

export default function Dashboard({ boards, setUser, user }) {
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [validName, setValidName] = useState(true);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      if (displayName === user.displayName && validName) {
        setValidName(false);
        setError('new name must be different than current');
      }
      if (displayName !== user.displayName && !validName) {
        setValidName(false);
        setError('Name must be between 1-20 characters');
      }
      if (displayName !== user.displayName && validName) {
        setValidName(true);
        setError(null);
      }
    }
  }, [displayName, user]);

  const changeName = (event) => {
    setDisplayName(event.target.value);
    setValidName(event.target.validity.valid);
  };

  const submitNameChange = () => {
    try {
      // change local user state
      setUser({
        ...user,
        displayName,
      });

      // then update the auth info
      const auth = getAuth();
      updateProfile(auth.currentUser, {
        displayName,
      });
    } catch (err) {
      console.error(err);
      const { code } = { ...err };
      setError(code);
    }
  };

  if (user === 'loading') {
    return (
      <div className="dashboard">
        <span className="dashboard-loading">
          Loading...
          <img src={hourglass} alt="" />
        </span>
      </div>
    );
  }
  if (user) {
    return (
      <div className="dashboard">
        <h1>{`Welcome ${user.displayName}`}</h1>
        <div>
          <div>
            Logged in with
            {user.email}
          </div>
          <div>
            using
            {' '}
            {user.authProvider === 'google.com'
              ? 'Google authentication'
              : 'your email and password'}
          </div>
        </div>
        <form className="change-displayname">
          <label htmlFor="displayname">
            Posting as:
            <input
              id="displayname"
              minLength={1}
              maxLength={20}
              onChange={changeName}
              required
              type="text"
              value={displayName || ''}
            />
          </label>
          <button
            disabled={!validName}
            onClick={submitNameChange}
            type="button"
          >
            Change Name
          </button>
          <span className={error ? 'error' : 'error hidden'}>{error}</span>
        </form>
        <UserBoards boards={boards} user={user} setUser={setUser} />
        <UserThreads user={user} />
        <UserPosts boards={boards} user={user} />
      </div>
    );
  }
  return <Login />;
}
