import React from 'react';
import styles from './Sidebar.module.scss';
import ConnectionDropdown from './ConnectionDropdown';
import SavedConnections from './connections/SavedConnections';

const Sidebar: React.FC = () => {
    return (
        <aside className={styles.sidebar}>
            <div className="slds-p-around_medium">
                <ConnectionDropdown />
                <SavedConnections />
            </div>
        </aside>
    );
};

export default Sidebar;
