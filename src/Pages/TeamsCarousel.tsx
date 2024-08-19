import React, { useState, useEffect } from 'react';
import { fetchTeamsByLeague, fetchLastFiveMatches } from '../Services/api';
import './TeamsCarousel.css';

interface Team {
  idTeam: string;
  strTeam: string;
  strBadge: string;
  intFormedYear: string;
  strLeague: string;
  strStadium: string;
  strKeywords: string;
  intStadiumCapacity: string;
  strWebsite: string;
  strDescriptionEN: string;
  strEquipment: string;
  idLeague: string;
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
  intHomeScore: string;
  intAwayScore: string;
  strStatus: string; // Añadido para el estado del partido
}

const TeamsCarousel: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [lastMatches, setLastMatches] = useState<Match[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const leagues = ['English Premier League', 'Spanish La Liga', 'Serie A', 'English League Championship', 'Spanish La Liga 2'];
        const teamsData = await Promise.all(leagues.map(league => fetchTeamsByLeague(league)));
        const allTeams = teamsData.flat();
        setTeams(allTeams.slice(0, 60));
        setFilteredTeams(allTeams.slice(0, 60));
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    const results = teams.filter((team) =>
      team.strTeam.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTeams(results);
  }, [searchTerm, teams]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const fetchUpcomingMatches = async (idLeague: string, teamName: string) => {
    try {
      const season = '2024-2025'; // La temporada deseada
      const response = await fetch(`https://www.thesportsdb.com/api/v1/json/3/eventsseason.php?id=${idLeague}&s=${season}`);
      const data = await response.json();
      if (data && Array.isArray(data.events)) {
        // Filtrar partidos que contengan el nombre del equipo en el evento y que no estén terminados
        const upcoming = data.events
          .filter((event: any) => event.strStatus !== 'Match Finished' && 
                                  (event.strHomeTeam.toLowerCase().includes(teamName.toLowerCase()) || 
                                   event.strAwayTeam.toLowerCase().includes(teamName.toLowerCase())))
          .slice(0, 5) // Limitar a los próximos 5 partidos
          .map((event: any) => ({
            idEvent: event.idEvent,
            strEvent: event.strEvent,
            strHomeTeam: event.strHomeTeam,
            strAwayTeam: event.strAwayTeam,
            strHomeTeamBadge: event.strHomeTeamBadge,
            strAwayTeamBadge: event.strAwayTeamBadge,
            strTime: event.strTime,
            dateEvent: event.dateEvent,
            strStatus: event.strStatus,
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

  const handleTeamClick = async (team: Team) => {
    setSelectedTeam(team);

    try {
      const urlLastMatches = `https://www.thesportsdb.com/api/v1/json/3/eventslast.php?id=${team.idTeam}`;
      const matches = await fetchLastFiveMatches(team.idTeam);
      console.log("Fetched last matches:", matches);  // Verificar los datos
      setLastMatches(matches);

      // Obtener los próximos partidos filtrados por el nombre del equipo
      await fetchUpcomingMatches(team.idLeague, team.strTeam);
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  const handleBackToCarousel = () => {
    setSelectedTeam(null);
    setLastMatches([]);
    setUpcomingMatches([]);
  };

  return (
    <div className="teams-container">
      <h2>Teams Carousel</h2>
      {selectedTeam ? (
        <div className="league-details">
          <button onClick={handleBackToCarousel} className="back-button">Back to Teams</button>
          <h2>{selectedTeam.strTeam}</h2>
          {selectedTeam.strBadge && (
            <img src={selectedTeam.strBadge} alt={`${selectedTeam.strTeam} badge`} className="selected-team-badge" />
          )}
          <p><strong>Formed Year:</strong> {selectedTeam.intFormedYear}</p>
          <p><strong>ID League:</strong> {selectedTeam.idLeague}</p>
          <p><strong>Stadium:</strong> {selectedTeam.strStadium}</p>
          <p><strong>Capacity:</strong> {selectedTeam.intStadiumCapacity}</p>
          <p><strong>Description:</strong> {selectedTeam.strDescriptionEN}</p>
          {selectedTeam.strWebsite && (
            <p><strong>Website:</strong> <a href={`http://${selectedTeam.strWebsite}`} target="_blank" rel="noopener noreferrer">{selectedTeam.strWebsite}</a></p>
          )}

          {/* Mostrar los últimos partidos */}
          <h3>Last 5 Matches</h3>
          {lastMatches.length > 0 ? (
            <ul>
              {lastMatches.map(match => (
                <li key={match.idEvent}>
                  <div className="match-item">
                    <div>
                      <strong>{match.strEvent}</strong>
                      <p>{match.dateEvent} - {match.strTime}</p>
                      <p>{match.strHomeTeam} {match.intHomeScore} - {match.intAwayScore} {match.strAwayTeam}</p>
                    </div>
                    <div className="badges">
                      <img src={match.strHomeTeamBadge} alt={`${match.strHomeTeam} badge`} className="team-badge" />
                      <img src={match.strAwayTeamBadge} alt={`${match.strAwayTeam} badge`} className="team-badge" />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No matches available</p>
          )}

          {/* Mostrar los próximos partidos */}
          <h3>Upcoming 5 Matches</h3>
          {upcomingMatches.length > 0 ? (
            <ul>
              {upcomingMatches.map(match => (
                <li key={match.idEvent}>
                  <div className="match-item">
                    <div>
                      <strong>{match.strEvent}</strong>
                      <p>{match.dateEvent} - {match.strTime}</p>
                      <p>{match.strHomeTeam} vs {match.strAwayTeam}</p>
                    </div>
                    <div className="badges">
                      <img src={match.strHomeTeamBadge} alt={`${match.strHomeTeam} badge`} className="team-badge" />
                      <img src={match.strAwayTeamBadge} alt={`${match.strAwayTeam} badge`} className="team-badge" />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No upcoming matches available</p>
          )}
        </div>
      ) : (
        <>
          <input
            type="text"
            placeholder="Search for a team..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-bar"
          />
          <div className="leagues-grid">
            {filteredTeams.length > 0 ? (
              filteredTeams.map((team) => (
                <div 
                  key={team.idTeam} 
                  className="team-item" 
                  onClick={() => handleTeamClick(team)} 
                >
                  {team.strBadge ? (
                    <img src={team.strBadge} alt={`${team.strTeam} badge`} className="team-badge" />
                  ) : (
                    <p>No badge available</p>
                  )}
                  <p>{team.strTeam}</p>
                </div>
              ))
            ) : (
              <p>No teams found</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TeamsCarousel;








