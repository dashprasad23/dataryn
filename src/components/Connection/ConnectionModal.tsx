import React, { ReactNode } from 'react';
import styles from './ConnectionModal.module.scss';
import { IoClose } from 'react-icons/io5';

interface ConnectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

const ConnectionModal: React.FC<ConnectionModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>
                    <IoClose />
                </button>
                <div className={styles.modalHeader}>
                    <h2>{title}</h2>
                </div>
                <div className={styles.modalBody}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default ConnectionModal;
