import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import styles from './Main.module.scss';

const MainWindow: React.FC = () => {
    return (
        <div className={styles.container}>
            <Sidebar />
            <main className={styles.mainContent}>
                <div className="slds-scope">
                    <div className="slds-grid slds-grid_align-center slds-p-around_large">
                        <h1 className="slds-text-heading_large">Dataryn Workspace</h1>
                    </div>
                    <div className="slds-p-around_large">
                        <p className="slds-text-body_regular">This is the main window where you will perform main tasks.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MainWindow;
