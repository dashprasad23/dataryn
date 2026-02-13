import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { FaDatabase, FaPlay, FaVial, FaTerminal, FaTrash } from 'react-icons/fa';
import { SiMongodb, SiPostgresql, SiMysql, SiOracle, SiMariadb } from 'react-icons/si';
import styles from '../Sidebar.module.scss'; // Assuming we reuse Sidebar styles

interface SavedConnection {
    id: string;
    name: string;
    db_type: string;
    details: any;
}

const SavedConnections: React.FC = () => {
    const [savedConnections, setSavedConnections] = useState<SavedConnection[]>([]);

    const fetchConnections = async () => {
        try {
            const connections = await invoke<SavedConnection[]>('get_connections');
            setSavedConnections(connections);
        } catch (error) {
            console.error("Failed to fetch connections:", error);
        }
    };

    useEffect(() => {
        fetchConnections();
    }, []);

    const getIconForType = (type: string) => {
        switch (type) {
            case 'postgres': return <SiPostgresql />;
            case 'mysql': return <SiMysql />;
            case 'mongodb': return <SiMongodb />;
            case 'oracle': return <SiOracle />;
            case 'mariadb': return <SiMariadb />;
            case 'scylladb': return <FaDatabase />;
            default: return <FaDatabase />;
        }
    };

    const getMongoUri = (details: any) => {
        const { host, port, username, password, database, connectionString: uri } = details;
        if (uri) return uri;
        let authPart = '';
        if (username && password) {
            authPart = `${username}:${password}@`;
        }
        return `mongodb://${authPart}${host}:${port}/${database}`;
    };

    const handleConnectSaved = async (conn: SavedConnection) => {
        console.log("Connecting to saved:", conn.name);
        try {
            if (conn.db_type === 'mongodb') {
                const uri = getMongoUri(conn.details);
                const dbName = conn.details.database || 'admin';
                await invoke('connect_to_db', { connectionString: uri, dbName });
                alert(`Connected to ${conn.name}`);
            } else {
                alert(`Connection type ${conn.db_type} not implemented yet.`);
            }
        } catch (error) {
            console.error("Connection failed:", error);
            alert(`Failed to connect: ${error}`);
        }
    };

    const handleTestConnection = async (e: React.MouseEvent, conn: SavedConnection) => {
        e.stopPropagation();
        console.log("Testing saved connection:", conn.name);
        try {
            if (conn.db_type === 'mongodb') {
                const uri = getMongoUri(conn.details);
                const response = await invoke<string>('test_mongodb_connection', { connectionString: uri });
                alert(response);
            } else {
                alert("Test not implemented for this type");
            }
        } catch (error) {
            alert(`Test failed: ${error}`);
        }
    };

    const handleOpenConsole = (e: React.MouseEvent, conn: SavedConnection) => {
        e.stopPropagation();
        alert(`Opening query console for ${conn.name} (Coming Soon)`);
    };

    const handleDeleteConnection = async (e: React.MouseEvent, conn: SavedConnection) => {
        e.stopPropagation();
        if (confirm(`Are you sure you want to delete ${conn.name}?`)) {
            try {
                await invoke('delete_connection', { id: conn.id });
                fetchConnections(); // Refresh list
            } catch (error) {
                alert(`Failed to delete: ${error}`);
            }
        }
    };

    return (
        <div className={styles.savedConnections}>
            {savedConnections.map(conn => (
                <div key={conn.id} className={styles.savedConnectionItem} onClick={() => handleConnectSaved(conn)}>
                    <span className={styles.dbIcon}>{getIconForType(conn.db_type)}</span>
                    <span className={styles.dbName}>{conn.name}</span>

                    <div className={styles.connectionActions}>
                        <button
                            className={styles.actionButton}
                            title="Test Connection"
                            onClick={(e) => handleTestConnection(e, conn)}
                        >
                            <FaVial />
                        </button>
                        <button
                            className={styles.actionButton}
                            title="Connect"
                            onClick={(e) => { e.stopPropagation(); handleConnectSaved(conn); }}
                        >
                            <FaPlay />
                        </button>
                        <button
                            className={styles.actionButton}
                            title="Create Query Console"
                            onClick={(e) => handleOpenConsole(e, conn)}
                        >
                            <FaTerminal />
                        </button>
                        <button
                            className={styles.actionButton}
                            title="Delete"
                            onClick={(e) => handleDeleteConnection(e, conn)}
                        >
                            <FaTrash />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SavedConnections;
