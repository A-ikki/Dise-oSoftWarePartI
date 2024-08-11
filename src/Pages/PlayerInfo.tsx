import React, { useEffect, useState } from 'react';
import { fetchPlayerByName } from '../Services/api';

interface Player {
    idPlayer: string;
    strPlayer: string;
    strTeam: string;
    strCutout: string;
    strDescriptionEN: string;
}

const PlayerInfo: React.FC<{ playerName: string }> = ({ playerName }) => {
    const [player, setPlayer] = useState<Player | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getPlayerData = async () => {
            const data = await fetchPlayerByName(playerName);
            if (data && data.player) {
                setPlayer(data.player[0]);
            } else {
                setError("Player not found");
            }
            setLoading(false);
        };
        getPlayerData();
    }, [playerName]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="player-info">
            {player && (
                <div>
                    <h1>{player.strPlayer}</h1>
                    <p>Team: {player.strTeam}</p>
                    <img src={player.strCutout} alt={`${player.strPlayer} cutout`} />
                    <p>{player.strDescriptionEN}</p>
                </div>
            )}
        </div>
    );
};

export default PlayerInfo;
