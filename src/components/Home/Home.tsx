
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.scss';
import logo from '../../assets/logo.png';

const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className={`slds-scope ${styles.homeContainer}`}>
            <div className="slds-grid slds-wrap slds-grid_align-center slds-p-around_large">
                <div className="slds-col slds-size_1-of-1 slds-text-align_center slds-m-bottom_large">
                    <img src={logo} alt="Dataryn Logo" className={styles.logo} />
                    <h1 className="slds-text-heading_large slds-text-color_default slds-m-top_small">
                        Welcome to <span className={styles.appName}>Dataryn</span>
                    </h1>
                    <div className="slds-m-top_large">
                        <button
                            className="slds-button slds-button_brand"
                            onClick={() => navigate('/main')}
                        >
                            Get Started
                        </button>
                    </div>
                </div>

                <div className="slds-col slds-size_1-of-1 slds-medium-size_8-of-12 slds-large-size_6-of-12">
                    <div className="slds-card">
                        <div className="slds-card__header slds-grid">
                            <header className="slds-media slds-media_center slds-has-flexi-truncate">
                                <div className="slds-media__body">
                                    <h2 className="slds-card__header-title">
                                        <span className="slds-text-heading_small">About the Application</span>
                                    </h2>
                                </div>
                            </header>
                        </div>
                        <div className="slds-card__body slds-card__body_inner">
                            <p className="slds-text-body_regular">
                                Dataryn is a powerful tool designed to streamline your data management workflows.
                                Experience seamless integration and intuitive interfaces built for efficiency.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="slds-col slds-size_1-of-1 slds-medium-size_8-of-12 slds-large-size_6-of-12 slds-m-top_medium">
                    <div className="slds-card">
                        <div className="slds-card__header slds-grid">
                            <header className="slds-media slds-media_center slds-has-flexi-truncate">
                                <div className="slds-media__body">
                                    <h2 className="slds-card__header-title">
                                        <span className="slds-text-heading_small">Database Support</span>
                                    </h2>
                                </div>
                            </header>
                        </div>
                        <div className="slds-card__body slds-card__body_inner">
                            <p className="slds-text-body_regular">
                                We support connections to <strong>all kinds of databases</strong>.
                                Whether you are using SQL, NoSQL, or cloud-based storage, Dataryn has you covered.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
