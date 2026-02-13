import React, { useState } from 'react';
import styles from './Sidebar.module.scss';
import { SiPostgresql, SiMysql, SiMongodb, SiOracle, SiFirebase, SiMariadb, SiScylladb } from 'react-icons/si';
import { FaPlus } from 'react-icons/fa';
import ConnectionModal from '../Connection/ConnectionModal';
import ConnectionForm from '../Connection/ConnectionForm';

interface DatabaseOption {
    name: string;
    id: string;
    icon: React.ReactNode;
}

const databases: DatabaseOption[] = [
    { name: 'Postgres', id: 'postgres', icon: <SiPostgresql /> },
    { name: 'MySQL', id: 'mysql', icon: <SiMysql /> },
    { name: 'MongoDB', id: 'mongodb', icon: <SiMongodb /> },
    { name: 'Oracle', id: 'oracle', icon: <SiOracle /> },
    { name: 'Firebase', id: 'firebase', icon: <SiFirebase /> },
    { name: 'MariaDB', id: 'mariadb', icon: <SiMariadb /> },
    { name: 'ScyllaDB', id: 'scylladb', icon: <SiScylladb /> },
];

const ConnectionDropdown: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDatabase, setSelectedDatabase] = useState<DatabaseOption | null>(null);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleSelect = (db: DatabaseOption) => {
        console.log(`Selected database: ${db.id}`);
        setSelectedDatabase(db);
        setIsModalOpen(true);
        setIsOpen(false);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedDatabase(null);
    };

    const handleConnect = (data: any) => {
        console.log('Connection Data:', data);
        // TODO: Implement actual connection logic here
        handleCloseModal();
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
                    <ConnectionForm
                        databaseId={selectedDatabase.id}
                        onSubmit={handleConnect}
                    />
                )}
            </ConnectionModal>
        </div>
    );
};

export default ConnectionDropdown;
