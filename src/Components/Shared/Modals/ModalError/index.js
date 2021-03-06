import styles from './modalError.module.css';

const ModalError = ({ error: { show, title, message }, onConfirm }) => {
  if (!show) {
    return null;
  }
  return (
    <div className={styles.modal}>
      <div className={styles.modalHeader}>
        <h3 className={styles.title}>{title}</h3>
      </div>
      <div className={styles.modalContent}>
        <p className={styles.message}>{message}</p>
        <div className={styles.btnContainer}>
          <button className={styles.btn} onClick={onConfirm}>
            Ok
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalError;
