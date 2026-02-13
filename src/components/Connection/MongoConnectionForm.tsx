import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { invoke } from '@tauri-apps/api/core';
import styles from './ConnectionForm.module.scss'; // Reusing styles for now

interface MongoConnectionFormProps {
    onCancel: () => void;
    onSuccess: () => void;
}

type MongoFormValues = {
    name: string;
    host?: string;
    port?: string;
    database?: string;
    username?: string;
    password?: string;
    connectionString?: string;
};

const MongoConnectionForm: React.FC<MongoConnectionFormProps> = ({ onCancel, onSuccess }) => {
    const [mode, setMode] = useState<'fields' | 'uri'>('fields');
    const { register, handleSubmit, formState: { errors } } = useForm<MongoFormValues>();
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const getConnectionString = (data: MongoFormValues) => {
        if (mode === 'uri') {
            return data.connectionString || '';
        }
        const { host, port, username, password, database } = data;
        let authPart = '';
        if (username && password) {
            authPart = `${username}:${password}@`;
        }
        return `mongodb://${authPart}${host}:${port}/${database}`;
    };

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        if (type === 'success') {
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const handleTestConnection = async (data: MongoFormValues) => {
        setNotification(null);
        try {
            const connectionString = getConnectionString(data);
            if (!connectionString) {
                showNotification('error', "Please provide valid connection details.");
                return;
            }
            console.log("Testing connection:", connectionString);
            const response = await invoke<string>('test_mongodb_connection', { connectionString });
            showNotification('success', response);
        } catch (error) {
            console.error("Test connection failed:", error);
            showNotification('error', `Test connection failed: ${error}`);
        }
    };

    const handleConnect = async (data: MongoFormValues) => {
        setNotification(null);
        try {
            const connectionString = getConnectionString(data);
            let dbName = data.database || 'admin';

            if (!connectionString) {
                showNotification('error', "Please provide valid connection details.");
                return;
            }

            // Save Connection
            const savedConnection = {
                id: crypto.randomUUID(),
                name: data.name,
                db_type: 'mongodb',
                details: data
            };

            await invoke('save_connection', { connection: savedConnection });

            console.log("Connecting:", connectionString, dbName);
            await invoke<string>('connect_to_db', { connectionString, dbName });

            showNotification('success', "Connection saved and connected successfully!");
            setTimeout(() => {
                onSuccess();
            }, 1000);
        } catch (error) {
            console.error("Connection failed:", error);
            showNotification('error', `Connection failed: ${error}`);
        }
    };

    const onSubmit: SubmitHandler<MongoFormValues> = (data) => {
        handleConnect(data);
    };

    const onTestClick = (e: React.MouseEvent) => {
        e.preventDefault();
        handleSubmit((data) => handleTestConnection(data))();
    };

    return (
        <form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>
            {notification && (
                <div className={`slds-notify slds-notify_alert slds-theme_alert-texture ${notification.type === 'error' ? 'slds-theme_error' : 'slds-theme_success'}`} role="alert" style={{ marginBottom: '1rem', borderRadius: '0.25rem' }}>
                    <span className="slds-assistive-text">{notification.type}</span>
                    <span className="slds-icon_container slds-m-right_x-small" title={notification.type}>
                        {notification.type === 'error' ? '⚠️ ' : '✅ '}
                    </span>
                    <h2>{notification.message}</h2>
                    <div className="slds-notify__close">
                        <button type="button" className="slds-button slds-button_icon slds-button_icon-small slds-button_icon-inverse" title="Close" onClick={() => setNotification(null)}>
                            <span style={{ color: 'white', cursor: 'pointer' }}>✕</span>
                            <span className="slds-assistive-text">Close</span>
                        </button>
                    </div>
                </div>
            )}

            <div className={styles.formGroup}>
                <label htmlFor="name">Connection Name</label>
                <input
                    id="name"
                    type="text"
                    placeholder="My Production DB"
                    {...register('name', { required: 'Connection name is required' })}
                />
                {errors.name && <span className={styles.error}>{errors.name.message}</span>}
            </div>

            <div className={styles.modeSwitch}>
                <label>
                    <input
                        type="radio"
                        value="fields"
                        checked={mode === 'fields'}
                        onChange={() => setMode('fields')}
                    />
                    Fill Fields
                </label>
                <label>
                    <input
                        type="radio"
                        value="uri"
                        checked={mode === 'uri'}
                        onChange={() => setMode('uri')}
                    />
                    Connection String
                </label>
            </div>

            {mode === 'uri' ? (
                <div className={styles.formGroup}>
                    <label htmlFor="connectionString">Connection String (URI)</label>
                    <input
                        id="connectionString"
                        type="text"
                        placeholder="mongodb://user:pass@host:27017/db"
                        {...register('connectionString', { required: 'Connection string is required' })}
                    />
                    {errors.connectionString && <span className={styles.error}>{errors.connectionString.message}</span>}
                    <div className={styles.formGroup}>
                        <label htmlFor="database">Database Name (Optional Override)</label>
                        <input
                            id="database"
                            type="text"
                            placeholder="my_db"
                            {...register('database')}
                        />
                    </div>
                </div>
            ) : (
                <>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label htmlFor="host">Host</label>
                            <input
                                id="host"
                                type="text"
                                defaultValue="localhost"
                                {...register('host', { required: 'Host is required' })}
                            />
                            {errors.host && <span className={styles.error}>{errors.host.message}</span>}
                        </div>

                        <div className={`${styles.formGroup} ${styles.smallInput}`}>
                            <label htmlFor="port">Port</label>
                            <input
                                id="port"
                                type="text"
                                defaultValue="27017"
                                {...register('port', { required: 'Port is required' })}
                            />
                            {errors.port && <span className={styles.error}>{errors.port.message}</span>}
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="database">Database Name</label>
                        <input
                            id="database"
                            type="text"
                            {...register('database', { required: 'Database name is required' })}
                        />
                        {errors.database && <span className={styles.error}>{errors.database.message}</span>}
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label htmlFor="username">Username</label>
                            <input
                                id="username"
                                type="text"
                                {...register('username')}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                {...register('password')}
                            />
                        </div>
                    </div>
                </>
            )}

            <div className={styles.buttonGroup}>
                <button
                    type="button"
                    className={`${styles.btn} ${styles.btnTest}`}
                    onClick={onTestClick}
                >
                    Test Connection
                </button>
                <button
                    type="submit"
                    className={`${styles.btn} ${styles.btnSave}`}
                >
                    Save & Connect
                </button>
                <button
                    type="button"
                    className={`${styles.btn} ${styles.btnCancel}`}
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default MongoConnectionForm;
