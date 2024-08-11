import React from 'react';
import { useParams } from 'react-router-dom';

const LeagueDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <div>
            <h1>League Details for ID: {id}</h1>
            {/* Aquí puedes añadir más detalles sobre la liga */}
        </div>
    );
};

export default LeagueDetails;

