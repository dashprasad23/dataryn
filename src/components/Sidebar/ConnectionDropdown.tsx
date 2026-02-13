import React, { useState } from 'react';
import { FaPlus, FaDatabase } from 'react-icons/fa';
import { SiMongodb, SiPostgresql, SiMysql, SiOracle, SiMariadb } from 'react-icons/si';
import styles from './Sidebar.module.scss';
import ConnectionModal from '../Connection/ConnectionModal';
import ConnectionForm from '../Connection/ConnectionForm';
import MongoConnectionForm from '../Connection/MongoConnectionForm';

interface DatabaseOption {
    id: string;
    name: string;
    icon: React.ReactNode;
}

const databases: DatabaseOption[] = [
    { id: 'postgres', name: 'PostgreSQL', icon: <SiPostgresql /> },
    { id: 'mysql', name: 'MySQL', icon: <SiMysql /> },
    { id: 'mongodb', name: 'MongoDB', icon: <SiMongodb /> },
    { id: 'oracle', name: 'Oracle', icon: <SiOracle /> },
    { id: 'mariadb', name: 'MariaDB', icon: <SiMariadb /> },
    { id: 'scylladb', name: 'ScyllaDB', icon: <FaDatabase /> },
];

const ConnectionDropdown: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDatabase, setSelectedDatabase] = useState<DatabaseOption | null>(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleSelect = (db: DatabaseOption) => {
        setSelectedDatabase(db);
        setIsModalOpen(true);
        setIsOpen(false);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedDatabase(null);
    };

    return (
        <div className={styles.connectionSection}>
            <div className={styles.headerRow}>
                <span className={styles.sectionTitle}>MY CONNECTIONS</span>
                <button className={styles.iconButton} onClick={toggleDropdown} title="Create Connection">
                    <FaPlus />
                </button>
            </div>
            <div className={styles.separator}></div>

            {isOpen && (
                <div className={styles.dropdownMenu}>
                    <ul className={styles.dropdownList}>
                        {databases.map((db) => (
                            <li key={db.id} className={styles.dropdownItem} onClick={() => handleSelect(db)}>
                                <span className={styles.dbIcon}>{db.icon}</span>
                                <span className={styles.dbName}>{db.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <ConnectionModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={`Connect to ${selectedDatabase?.name}`}
            >
                {selectedDatabase && (
                    selectedDatabase.id === 'mongodb' ? (
                        <MongoConnectionForm
                            onSuccess={handleCloseModal}
                            onCancel={handleCloseModal}
                        />
                    ) : (
                        <ConnectionForm
                            databaseId={selectedDatabase.id}
                            onSubmit={(data) => {
                                console.log("Generic submit:", data);
                                handleCloseModal();
                            }}
                            onCancel={handleCloseModal}
                        />
                    )
                )}
            </ConnectionModal>
        </div>
    );
};

export default ConnectionDropdown;
