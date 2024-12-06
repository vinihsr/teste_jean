import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './User.css';

interface User {
  id: number;
  name: string;
  email: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://35.168.197.167:3008/api/user');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const postUser = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://35.168.197.167:3008/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.user) {
        setUsers((prevUsers) => [...prevUsers, data.user]);
      } else {
        throw new Error('API did not return a user object');
      }
      setName('');
      setEmail('');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (_id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`http://35.168.197.167:3008/api/user/${_id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== _id));
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container">
      <h1>User Management System</h1>
      <form onSubmit={postUser}>
        <label className="label">
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input"
          />
        </label>
        <br />
        <label className="label">
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input"
          />
        </label>
        <br />
        <button
          type="submit"
          disabled={loading || !name || !email}
          className={`submit-button ${loading || !name || !email ? 'disabled' : ''}`}
        >
          {loading ? 'Processing...' : 'Add User'}
        </button>
        {error && <p className="error">Error: {error}</p>}
      </form>
      <h2>Users:</h2>
      {loading && <p>Loading...</p>}
      {!loading && users.length === 0 && <p>No users found.</p>}
      <ul className="list">
  {users.map((user) => (
    <li key={user._id || uuidv4()} className="list-item">
      {user.name} ({user.email})
<button
  className="delete-button"
  onClick={() => deleteUser(user._id)}
>
  Delete
</button>
    </li>
  ))}
</ul>
    </div>
  );
};

export default Users;
