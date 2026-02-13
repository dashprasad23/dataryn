import React from 'react';
import styles from './Sidebar.module.scss';
import ConnectionDropdown from './ConnectionDropdown';

const Sidebar: React.FC = () => {
    return (
        <aside className={styles.sidebar}>
            <div className="slds-p-around_medium">
                <ConnectionDropdown />
                <p>Sidebar content goes here.</p>
            </div>
        </aside>
    );
};

export default Sidebar;
