import React from 'react';
import styles from './modal.module.css';
import ButtonCancel from '../../Shared/ButtonCancel';
import ButtonConfirm from '../../Shared/ButtonConfirm';

const Modal = (props) => {
  if (!props.show) {
    return null;
  }
  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3 className={styles.title}>{props.title}</h3>
        </div>
        <div className={styles.message}>{props.message}</div>
        <div className={styles.button}>
          <ButtonCancel onClick={props.onCancel} />
          {props.hideButton ? '' : <ButtonConfirm onClick={props.onConfirm} />}
        </div>
      </div>
    </div>
  );
};

export default Modal;
