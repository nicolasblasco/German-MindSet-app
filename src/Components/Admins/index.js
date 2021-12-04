import React, { useEffect, useState } from 'react';
import styles from './admins.module.css';
import Modal from './Modal';

function Admins() {
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(undefined);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API}/admins`)
      .then((response) => response.json())
      .then((response) => {
        setAdmins(response.data);
      })
      .catch((error) => setError(error.toString()));
  }, []);

  const handleDelete = (event, admin) => {
    event.stopPropagation();
    setSelectedAdmin(admin._id);
    setShowModal(true);
  };

  const deleteAdmin = () => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_API}/admins/${selectedAdmin}`, { method: 'DELETE' })
      .then((response) => {
        if (response.status !== 204) {
          return response.json().then(({ message }) => {
            throw new Error(message);
          });
        }
        return fetch(`${process.env.REACT_APP_API}/admins`)
          .then((response) => {
            if (response.status !== 200) {
              return response.json().then(({ message }) => {
                throw new Error(message);
              });
            }
            return response.json();
          })
          .then((response) => {
            setAdmins(response.data);
            setShowModal(false);
          });
      })
      .catch((error) => setError(error.toString()))
      .finally(() => setLoading(false));
  };

  const showForm = (admin) => {
    if (admin) {
      window.location.href = `admins/form?id=${admin._id}`;
    } else {
      window.location.href = `admins/form`;
    }
  };

  return (
    <section className={styles.container}>
      <Modal
        show={showModal}
        isLoading={isLoading}
        onCancel={() => setShowModal(false)}
        onConfirm={deleteAdmin}
      />
      <h2 className={styles.title}>Administrators</h2>
      <table className={styles.title}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin._id}>
              <td>{admin.name}</td>
              <td>{admin.username}</td>
              <td>
                <button onClick={() => showForm(admin)} className={styles.button}>
                  Edit
                </button>
              </td>
              <td>
                <button onClick={(event) => handleDelete(event, admin)} className={styles.button}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.error}>{error}</div>
      <button onClick={() => showForm()} className={styles.button}>
        Add
      </button>
    </section>
  );
}

export default Admins;
