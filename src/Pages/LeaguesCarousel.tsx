import React, { useEffect, useState } from 'react';
import { fetchAllLeagues, fetchLeagueBadge, fetchLeagueDetails, fetchRecentMatches, fetchUpcomingMatches, fetchTeamsByLeague, fetchStandings } from '../Services/api';
import './LeaguesCarousel.css';

interface League {
    idLeague: string;
    strLeague: string;
    strSport: string;
    strBadge: string;
}

interface LeagueDetails extends League {
    strCountry: string;
    strDescriptionES: string;
    intFormedYear: string;
    strWebsite: string;
    strCurrentSeason: string;
}

interface Team {
    idTeam: string;
    strTeam: string;
    strBadge: string;
}

const LeaguesCarousel: React.FC = () => {
    const [leagues, setLeagues] = useState<League[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedLeague, setSelectedLeague] = useState<LeagueDetails | null>(null);
    const [recentMatches, setRecentMatches] = useState<any[]>([]);
    const [upcomingMatches, setUpcomingMatches] = useState<any[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [standings, setStandings] = useState<any[]>([]); // Define el tipo adecuado para las posiciones

    useEffect(() => {
        const getLeaguesData = async () => {
            try {
                const data = await fetchAllLeagues();
                if (data && data.leagues) {
                    const footballLeagues = data.leagues.filter((league: League) => league.strSport === "Soccer");

                    const leaguesWithBadge = await Promise.all(
                        footballLeagues.map(async (league: League) => {
                            const badge = await fetchLeagueBadge(league.strLeague);
                            if (badge) {
                                return { ...league, strBadge: badge };
                            }
                            return null;
                        })
                    );

                    const filteredLeagues = leaguesWithBadge.filter((league: League | null) => league !== null) as League[];
                    setLeagues(filteredLeagues);
                    setError(null);
                } else {
                    setError("Leagues not found");
                }
            } catch (error) {
                console.error("Error fetching leagues data:", error);
                setError("Failed to fetch leagues data");
            }
            setLoading(false);
        };

        getLeaguesData();
    }, []);

    const handleLeagueClick = async (league: League) => {
        setLoading(true);
        try {
            const details = await fetchLeagueDetails(league.idLeague);
            if (details) {
                setSelectedLeague({ ...league, ...details });

                const recentMatchesData = await fetchRecentMatches(league.idLeague);
                console.log("Fetched recent matches:", recentMatchesData);

                if (recentMatchesData && recentMatchesData[1]) {
                    setRecentMatches(recentMatchesData[1]);
                } else {
                    setRecentMatches([]);
                }

                const upcomingMatchesData = await fetchUpcomingMatches(league.idLeague);
                console.log("Fetched upcoming matches:", upcomingMatchesData);

                if (upcomingMatchesData && upcomingMatchesData[1]) {
                    setUpcomingMatches(upcomingMatchesData[1]);
                } else {
                    setUpcomingMatches([]);
                }

                const teamsData = await fetchTeamsByLeague(league.strLeague);
                console.log("Fetched teams data:", teamsData);

                if (teamsData) {
                    setTeams(teamsData);
                } else {
                    setTeams([]);
                }

                // Obtiene la tabla de posiciones si se tiene una temporada actual
                if (details.strCurrentSeason) {
                    const standingsData = await fetchStandings(league.idLeague, details.strCurrentSeason);
                    console.log("Fetched standings data:", standingsData);
                    setStandings(standingsData || []);
                } else {
                    setStandings([]);
                }
            } else {
                setError("Failed to fetch league details");
            }
        } catch (error) {
            console.error("Error fetching league details:", error);
            setError("Failed to fetch league details");
        }
        setLoading(false);
    };

    const handleBackToList = () => {
        setSelectedLeague(null);
        setRecentMatches([]);
        setUpcomingMatches([]);
        setTeams([]);
        setStandings([]);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container">
            {selectedLeague ? (
                <div className="league-details">
                    <button onClick={handleBackToList} className="back-button">Back to List</button>
                    <h1>{selectedLeague.strLeague}</h1>
                    {selectedLeague.strBadge && (
                        <img src={selectedLeague.strBadge} alt={`${selectedLeague.strLeague} badge`} className="league-badge" />
                    )}
                    <p><strong>Pais:</strong> {selectedLeague.strCountry}</p>
                    <p><strong>Año de Creacion:</strong> {selectedLeague.intFormedYear}</p>
                    <p><strong>Temporada Actual:</strong> {selectedLeague.strCurrentSeason}</p>
                    <p><strong>Description:</strong> {selectedLeague.strDescriptionES}</p>
                    {selectedLeague.strWebsite && (
                        <p><strong>Website:</strong> <a href={`http://${selectedLeague.strWebsite}`} target="_blank" rel="noopener noreferrer">{selectedLeague.strWebsite}</a></p>
                    )}

                    <h2>Últimos Partidos</h2>
                    <div className="recent-matches">
                        {recentMatches.length > 0 ? (
                            <ul className="matches-list">
                                {recentMatches.map((match) => (
                                    <li key={match.idEvent} className="match-item">
                                        <div className="team-badge-container">
                                            <img src={match.strHomeTeamBadge} alt="Home team badge" className="team-badge" />
                                            <span className="score">{match.intHomeScore}</span>
                                            <span className="event">{match.strEvent}</span>
                                            <span className="score">{match.intAwayScore}</span> 
                                            <img src={match.strAwayTeamBadge} alt="Away team badge" className="team-badge" />
                                        </div>
                                        <span className="date">{match.dateEvent}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No recent matches available</p>
                        )}
                    </div>

                    <h2>Próximos Partidos</h2>
                    <div className="upcoming-matches">
                        {upcomingMatches.length > 0 ? (
                            <ul className="matches-list">
                                {upcomingMatches.map((match) => (
                                    <li key={match.idEvent} className="match-item">
                                        <div className="team-badge-container">
                                            <img src={match.strHomeTeamBadge} alt="Home team badge" className="team-badge" />
                                            <span className="event">{match.strEvent}</span>
                                            <img src={match.strAwayTeamBadge} alt="Away team badge" className="team-badge" />
                                        </div>
                                        <span className="date">{match.dateEvent}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No upcoming matches available</p>
                        )}
                    </div>

                    <h2>Equipos</h2>
                    <div className="teams-grid">
                        {teams.map((team) => (
                            <div key={team.idTeam} className="team-item">
                                <h3>{team.strTeam}</h3>
                                {team.strBadge ? (
                                    <img src={team.strBadge} alt={`${team.strTeam} badge`} className="team-badge" />
                                ) : (
                                    <p>No badge available</p>
                                )}
                            </div>
                        ))}
                    </div>

                    <h2>Tabla de Posiciones</h2>
                    <div className="standings-table">
                        {standings.length > 0 ? (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Logo</th>
                                        <th>Equipo</th>
                                        <th>Jugados</th>
                                        <th>Ganados</th>
                                        <th>Perdidos</th>
                                        <th>Empatados</th>
                                        <th>Puntos</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {standings.map((team, index) => (
                                        <tr key={index}>
                                            <td><img src={team.strBadge} alt={team.strTeam} /></td>
                                            <td>{team.strTeam}</td>
                                            <td>{team.intPlayed}</td>
                                            <td>{team.intWin}</td>
                                            <td>{team.intLoss}</td>
                                            <td>{team.intDraw}</td>
                                            <td>{team.intPoints}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No standings data available</p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="leagues-grid">
                    {leagues.map((league) => (
                        <div key={league.idLeague} className="league-item" onClick={() => handleLeagueClick(league)}>
                            <h3>{league.strLeague}</h3>
                            {league.strBadge ? (
                                <img src={league.strBadge} alt={`${league.strLeague} badge`} className="league-badge" />
                            ) : (
                                <p>No badge available</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LeaguesCarousel;
