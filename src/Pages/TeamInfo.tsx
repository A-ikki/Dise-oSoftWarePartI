import React, { useState } from 'react';
import { fetchTeamByName } from '../Services/api';
import './TeamInfo.css';  // Asegúrate de que el archivo CSS esté correctamente importado

interface Team {
    idTeam: string;
    strTeam: string;
    strStadium: string;
    strTeamBadge: string;
    strDescriptionES: string;
}

const TeamInfo: React.FC = () => {
    const [team, setTeam] = useState<Team | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [teamName, setTeamName] = useState<string>("");

    const getTeamData = async () => {
        setLoading(true);
        setError(null);
        setTeam(null);

        try {
            if (teamName) {
                const data = await fetchTeamByName(teamName);
                console.log("API Response: ", data);  // Verificar los datos en la consola

                if (data && data.teams && data.teams.length > 0) {
                    console.log("Team Data: ", data.teams[0]);  // Verifica los datos en la consola
                    setTeam(data.teams[0]);
                } else {
                    setError("Team not found");
                }
            }
        } catch (error) {
            console.error("Error fetching team data:", error);
            setError("Failed to fetch team data");
        }
        setLoading(false);
    };

    const handleSearch = () => {
        getTeamData();
    };

    return (
        <div className="team-info">
            <div className="search-form">
                <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="search-input"
                    placeholder="Enter team name"
                />
                <button onClick={handleSearch} className="search-button">Search</button>
            </div>
            {loading && <div className="loading">Loading...</div>}
            {error && (
                <div className="error">
                    Error: {error}
                    <button className="retry-button" onClick={() => setTeamName("")}>Retry</button>
                </div>
            )}
            {team && !loading && !error && (
                <div className="team-details">
                    <div className="team-header">
                        <h1 className="team-name">{team.strTeam}</h1>
                        {team.strTeamBadge ? (
                            <img className="team-badge" src={team.strTeamBadge} alt={`${team.strTeam} badge`} />
                        ) : (
                            <p>No badge available</p>
                        )}
                    </div>
                    <div className="team-info-section">
                        <p><strong>Stadium:</strong> {team.strStadium}</p>
                    </div>
                    <div className="team-description">
                        <p>{team.strDescriptionES}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamInfo;




