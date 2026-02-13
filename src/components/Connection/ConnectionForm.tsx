import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import styles from './ConnectionForm.module.scss';

interface ConnectionFormProps {
    databaseId: string;
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

type FormValues = {
    host?: string;
    port?: string;
    database?: string;
    username?: string;
    password?: string;
    connectionString?: string;
};

const ConnectionForm: React.FC<ConnectionFormProps> = ({ databaseId, onSubmit, onCancel }) => {
    const [mode, setMode] = useState<'fields' | 'uri'>('fields');
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

    const onFormSubmit: SubmitHandler<FormValues> = (data) => {
        const payload = {
            ...data,
            type: databaseId,
            connectionMode: mode
        };
        onSubmit(payload);
    };

    const handleTestConnection = (e: React.MouseEvent) => {
        e.preventDefault();
        handleSubmit((data) => {
            console.log("Testing connection:", data);
            // Logic to test connection would go here
            alert("Test connection triggered (Check console)");
        })();
    };

    const renderFields = () => {
        if (mode === 'uri') {
            return (
                <div className={styles.formGroup}>
                    <label htmlFor="connectionString">Connection String (URI)</label>
                    <input
                        id="connectionString"
                        type="text"
                        placeholder="e.g., postgres://user:pass@host:5432/db"
                        {...register('connectionString', { required: 'Connection string is required' })}
                    />
                    {errors.connectionString && <span className={styles.error}>{errors.connectionString.message}</span>}
                </div>
            );
        }

        return (
            <>
                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label htmlFor="host">Host</label>
                        <input
                            id="host"
                            type="text"
                            placeholder="localhost"
                            {...register('host', { required: 'Host is required' })}
                        />
                        {errors.host && <span className={styles.error}>{errors.host.message}</span>}
                    </div>

                    <div className={`${styles.formGroup} ${styles.smallInput}`}>
                        <label htmlFor="port">Port</label>
                        <input
                            id="port"
                            type="text"
                            placeholder={getDefaultPort(databaseId)}
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
                            {...register('username', { required: 'Username is required' })}
                        />
                        {errors.username && <span className={styles.error}>{errors.username.message}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            {...register('password', { required: 'Password is required' })}
                        />
                        {errors.password && <span className={styles.error}>{errors.password.message}</span>}
                    </div>
                </div>
            </>
        );
    };

    return (
        <form className={styles.formContainer} onSubmit={handleSubmit(onFormSubmit)}>
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

            {renderFields()}

            <div className={styles.buttonGroup}>
                <button
                    type="button"
                    className={`${styles.btn} ${styles.btnTest}`}
                    onClick={handleTestConnection}
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

const getDefaultPort = (dbId: string) => {
    switch (dbId) {
        case 'postgres': return '5432';
        case 'mysql': return '3306';
        case 'mongodb': return '27017';
        case 'oracle': return '1521';
        case 'mariadb': return '3306';
        case 'scylladb': return '9042';
        default: return '';
    }
};

export default ConnectionForm;
