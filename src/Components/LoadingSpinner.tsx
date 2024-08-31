import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner: React.FC = () => {
    return (
        <div className="loading-container">
            <div className="loading-message">
                <div className="soccer-ball"></div>
                <p>Cargando la magia del fútbol...</p>
            </div>
        </div>
    );
};

export default LoadingSpinner;
