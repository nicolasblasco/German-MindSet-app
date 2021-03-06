import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPostulants, deletePostulant } from 'redux/Postulants/thunks';
import { getProfiles } from 'redux/Profiles/thunks';
import { closeErrorModal } from 'redux/Postulants/actions';
import styles from './postulants.module.css';
import ButtonCreate from 'Components/Shared/Buttons/ButtonCreate';
import ButtonDelete from 'Components/Shared/Buttons/ButtonDelete';
import ButtonUpdate from 'Components/Shared/Buttons/ButtonUpdate';
import ModalDelete from 'Components/Shared/Modals/ModalDelete';
import ModalError from 'Components/Shared/Modals/ModalError';
import Loader from 'Components/Shared/Loader';

const PostulantsForm = () => {
  const dispatch = useDispatch();

  const history = useHistory();

  const [selectedPostulant, setSelectedPostulant] = useState(undefined);
  const [showDelete, setShowDelete] = useState(false);

  const postulants = useSelector((store) => store.postulants.list);
  const profiles = useSelector((store) => store.profiles.list);
  const error = useSelector((store) => store.postulants.error);
  const isLoading = useSelector((store) => store.postulants.isLoading);

  useEffect(() => {
    if (!postulants.length) {
      dispatch(getPostulants());
    }
    if (!profiles.length) {
      dispatch(getProfiles());
    }
  }, [postulants, profiles]);

  const handleDelete = (event, postulant) => {
    event.stopPropagation();
    setSelectedPostulant(postulant._id);
    setShowDelete(true);
  };

  return (
    <section className={styles.section}>
      <ModalDelete
        show={showDelete}
        title="Delete a Postulant"
        message="Are you sure you want to delete this postulant?"
        onConfirm={() => {
          dispatch(deletePostulant(selectedPostulant)).then(() => {
            setSelectedPostulant(undefined);
            setShowDelete(false);
          });
        }}
        onCancel={() => setShowDelete(false)}
      />
      <ModalError error={error} onConfirm={() => dispatch(closeErrorModal())} />
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Postulants</h2>
          <ButtonCreate
            disabled={isLoading}
            onClick={() => history.push('/admin/postulants/form')}
          />
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Available</th>
              <th>Profile</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {postulants.map((postulant) => {
              return (
                <tr key={postulant._id}>
                  <td>{`${postulant.firstName} ${postulant.lastName}`}</td>
                  <td>{postulant.email}</td>
                  <td>{postulant.phone}</td>
                  <td>{postulant.available ? 'Yes' : 'No'}</td>
                  <td>
                    {profiles.map((profile) => {
                      if (profile._id === postulant.profiles) {
                        return profile.name;
                      }
                    })}
                  </td>
                  <td>
                    <ButtonUpdate
                      disabled={isLoading}
                      onClick={() => history.push(`/admin/postulants/form?_id=${postulant._id}`)}
                    />
                    <ButtonDelete
                      disabled={isLoading}
                      onClick={(event) => handleDelete(event, postulant)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isLoading && <Loader />}
    </section>
  );
};

export default PostulantsForm;
