import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import styles from './ConnectionForm.module.scss';

interface ConnectionFormProps {
    databaseId: string;
    onSubmit: (data: any) => void;
}

type FormValues = {
    host?: string;
    port?: string;
    database?: string;
    username?: string;
    password?: string;
    connectionString?: string;
};

const ConnectionForm: React.FC<ConnectionFormProps> = ({ databaseId, onSubmit }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

    const onFormSubmit: SubmitHandler<FormValues> = (data) => {
        // Add databaseId to the submitted data
        onSubmit({ ...data, type: databaseId });
    };

    // Render fields based on database type
    const renderFields = () => {
        if (databaseId === 'mongodb') {
            return (
                <div className={styles.formGroup}>
                    <label htmlFor="connectionString">Connection String (URI)</label>
                    <input
                        id="connectionString"
                        type="text"
                        placeholder="mongodb://username:password@host:port/database"
                        {...register('connectionString', { required: 'Connection string is required' })}
                    />
                    {errors.connectionString && <span className={styles.error}>{errors.connectionString.message}</span>}
                </div>
            );
        }

        // Default fields for Relational DBs (Postgres, MySQL, Oracle, etc.)
        return (
            <>
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

                <div className={styles.formGroup}>
                    <label htmlFor="port">Port</label>
                    <input
                        id="port"
                        type="text"
                        placeholder={getDefaultPort(databaseId)}
                        {...register('port', { required: 'Port is required' })}
                    />
                    {errors.port && <span className={styles.error}>{errors.port.message}</span>}
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
            </>
        );
    };

    return (
        <form className={styles.formContainer} onSubmit={handleSubmit(onFormSubmit)}>
            {renderFields()}
            <button type="submit" className={styles.submitButton}>Connect</button>
        </form>
    );
};

const getDefaultPort = (dbId: string) => {
    switch (dbId) {
        case 'postgres': return '5432';
        case 'mysql': return '3306';
        case 'oracle': return '1521';
        case 'mariadb': return '3306';
        case 'scylladb': return '9042';
        default: return '';
    }
};

export default ConnectionForm;
