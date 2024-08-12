import React, { useEffect, useState } from 'react';
import { fetchEnglandLeagues, fetchTeamsByLeague, fetchStandings } from '../Services/api';
import './LeaguesCarousel.css';

interface League {
    idLeague: string;
    strSport: string;
    strLeague: string;
    strBadge: string;
    strCountry: string;
    strCurrentSeason: string;
    intFormedYear: string;
    strDescriptionEN: string;
    strWebsite: string;
}

interface Team {
    idTeam: string;
    strTeam: string;
    strBadge: string;
}

interface Standing {
    idStanding: string;
    strTeam: string;
    strBadge: string;
    intPlayed: number;
    intWin: number;
    intDraw: number;
    intLoss: number;
    intPoints: number;
}

interface Match {
    idEvent: string;
    strEvent: string;
    strHomeTeam: string;
    strAwayTeam: string;
    strHomeTeamBadge: string;
    strAwayTeamBadge: string;
    strTime: string;
    dateEvent: string;
}

const LeaguesCarousel: React.FC = () => {
    const [leagues, setLeagues] = useState<League[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [standings, setStandings] = useState<Standing[]>([]);
    const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
    const [season, setSeason] = useState<string>('2024-2025'); // Temporada actualizada

    useEffect(() => {
        const getLeaguesData = async () => {
            try {
                const data = await fetchEnglandLeagues();
                if (data && Array.isArray(data)) {
                    const filteredLeagues = data
                        .filter((league: any) => league.strSport === 'Soccer' && league.strCurrentSeason === season)
                        .map((league: any) => ({
                            idLeague: league.idLeague,
                            strSport: league.strSport,
                            strLeague: league.strLeague,
                            strBadge: league.strBadge,
                            strCountry: league.strCountry,
                            strCurrentSeason: league.strCurrentSeason,
                            intFormedYear: league.intFormedYear,
                            strDescriptionEN: league.strDescriptionEN,
                            strWebsite: league.strWebsite,
                        }));
                    setLeagues(filteredLeagues);
                    setError(null);
                } else {
                    setError("No leagues data found or unexpected data structure");
                }
            } catch (error) {
                console.error("Error fetching leagues data:", error);
                setError("Failed to fetch leagues data");
            }
            setLoading(false);
        };

        getLeaguesData();
    }, [season]);

    const fetchUpcomingMatches = async (idLeague: string) => {
        try {
            const response = await fetch(`/api/v1/json/3/eventsseason.php?id=${idLeague}&s=${season}`);
            const data = await response.json();
            if (data && Array.isArray(data.events)) {
                const upcoming = data.events
                    .filter((event: any) => event.strResult === '') // Filtro para partidos sin resultado
                    .slice(0, 10)
                    .map((event: any) => ({
                        idEvent: event.idEvent,
                        strEvent: event.strEvent,
                        strHomeTeam: event.strHomeTeam,
                        strAwayTeam: event.strAwayTeam,
                        strHomeTeamBadge: event.strHomeTeamBadge,
                        strAwayTeamBadge: event.strAwayTeamBadge,
                        strTime: event.strTime,
                        dateEvent: event.dateEvent,
                    }));
                setUpcomingMatches(upcoming);
            } else {
                setUpcomingMatches([]);
            }
        } catch (error) {
            console.error("Error fetching upcoming matches:", error);
            setUpcomingMatches([]);
        }
    };

    const handleLeagueClick = async (league: League) => {
        setSelectedLeague(league);
        try {
            const teamsData = await fetchTeamsByLeague(league.strLeague);
            if (Array.isArray(teamsData)) {
                const teamsList = teamsData.map((team: any) => ({
                    idTeam: team.idTeam,
                    strTeam: team.strTeam,
                    strBadge: team.strBadge,
                }));
                setTeams(teamsList);
            } else {
                setTeams([]);
            }

            const standingsData = await fetchStandings(league.idLeague, season);
            if (Array.isArray(standingsData)) {
                const standingsList = standingsData.map((standing: any) => ({
                    idStanding: standing.idStanding,
                    strTeam: standing.strTeam,
                    strBadge: standing.strBadge,
                    intPlayed: standing.intPlayed,
                    intWin: standing.intWin,
                    intDraw: standing.intDraw,
                    intLoss: standing.intLoss,
                    intPoints: standing.intPoints,
                }));
                setStandings(standingsList);
            } else {
                setStandings([]);
            }

            await fetchUpcomingMatches(league.idLeague); // Fetch upcoming matches
        } catch (error) {
            console.error("Error fetching teams or standings data:", error);
            setTeams([]);
            setStandings([]);
            setUpcomingMatches([]);
        }
    };

    const handleBackToList = () => {
        setSelectedLeague(null);
        setTeams([]);
        setStandings([]);
        setUpcomingMatches([]);
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
                    <p><strong>Description:</strong> {selectedLeague.strDescriptionEN}</p>
                    {selectedLeague.strWebsite && (
                        <p><strong>Website:</strong> <a href={`http://${selectedLeague.strWebsite}`} target="_blank" rel="noopener noreferrer">{selectedLeague.strWebsite}</a></p>
                    )}

                    <h2>Teams</h2>
                    <div className="teams-carousel">
                        {teams.length > 0 ? (
                            teams.map((team) => (
                                <div key={team.idTeam} className="team-item">
                                    {team.strBadge ? (
                                        <img src={team.strBadge} alt={`${team.strTeam} badge`} className="team-badge" />
                                    ) : (
                                        <p>No badge available</p>
                                    )}
                                    <p>{team.strTeam}</p>
                                </div>
                            ))
                        ) : (
                            <p>No teams available</p>
                        )}
                    </div>

                    <h2>Standings</h2>
                    <div className="standings-container">
                        <table className="standings-table">
                            <thead>
                                <tr>
                                    <th>Logo</th>
                                    <th>Equipo</th>
                                    <th>Jugados</th>
                                    <th>Ganados</th>
                                    <th>Empatados</th>
                                    <th>Perdidos</th>
                                    <th>Puntos</th>
                                </tr>
                            </thead>
                            <tbody>
                                {standings.map((team) => (
                                    <tr key={team.idStanding}>
                                        <td><img src={team.strBadge} alt={team.strTeam} className="team-badge-small" /></td>
                                        <td>{team.strTeam}</td>
                                        <td>{team.intPlayed}</td>
                                        <td>{team.intWin}</td>
                                        <td>{team.intDraw}</td>
                                        <td>{team.intLoss}</td>
                                        <td>{team.intPoints}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <h2>Upcoming Matches</h2>
                    <div className="upcoming-matches">
                        {upcomingMatches.length > 0 ? (
                            upcomingMatches.map((match) => (
                                <div key={match.idEvent} className="match-item">
                                    <div className="match-details">
                                        <img src={match.strHomeTeamBadge} alt={`${match.strHomeTeam} badge`} className="team-badge-small" />  
                                    </div>
                                    <p>{match.strEvent}</p>
                                    <div className="match-details">  
                                        <img src={match.strAwayTeamBadge} alt={`${match.strAwayTeam} badge`} className="team-badge-small" />
                                    </div>
                                    <p><strong>Fecha:</strong> {match.dateEvent} <strong>- Hora:</strong> {match.strTime} </p>
                                    
                                </div>
                            ))
                        ) : (
                            <p>No upcoming matches</p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="leagues-carousel">
                    {leagues.map((league) => (
                        <div key={league.idLeague} className="league-item" onClick={() => handleLeagueClick(league)}>
                            {league.strBadge && (
                                <img src={league.strBadge} alt={`${league.strLeague} badge`} className="league-badge" />
                            )}
                            <p>{league.strLeague}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LeaguesCarousel;
