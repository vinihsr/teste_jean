import React, { useState, useEffect } from 'react';
import './User.css'; // Importando o arquivo CSS

const Users = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3008/api/user');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const postUser = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3008/api/user', {
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
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3008/api/user/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (error) {
      setError(error.message);
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
          <li key={user.id} className="list-item">
            {user.name} ({user.email})
            <button
              className="delete-button"
              onClick={() => deleteUser(user.id)}
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
