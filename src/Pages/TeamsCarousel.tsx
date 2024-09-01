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
  strDescriptionES?: string;
  strEquipment: string;
  idLeague: string;
}

type TranslationKeys = 'teamsCarousel' | 'backToTeams' | 'formedYear' | 'idLeague' | 'stadium' |
  'capacity' | 'description' | 'website' | 'lastMatches' | 'upcomingMatches' | 
  'searchTeams' | 'showFavorites' | 'noMatchesAvailable' | 'noUpcomingMatchesAvailable' |
  'changeToEnglish' | 'changeToSpanish';

const translations: Record<'es' | 'en', Record<TranslationKeys, string>> = {
  es: {
    teamsCarousel: 'Carrusel de Equipos',
    backToTeams: 'Volver a Equipos',
    formedYear: 'Año de Fundación',
    idLeague: 'ID de Liga',
    stadium: 'Estadio',
    capacity: 'Capacidad',
    description: 'Descripción',
    website: 'Sitio Web',
    lastMatches: 'Últimos 5 Partidos',
    upcomingMatches: 'Próximos 5 Partidos',
    searchTeams: 'Buscar equipos...',
    showFavorites: 'Mostrar Favoritos',
    noMatchesAvailable: 'No hay partidos disponibles',
    noUpcomingMatchesAvailable: 'No hay partidos próximos disponibles',
    changeToEnglish: 'Cambiar a Inglés',
    changeToSpanish: 'Cambiar a Español',
  },
  en: {
    teamsCarousel: 'Teams Carousel',
    backToTeams: 'Back to Teams',
    formedYear: 'Formed Year',
    idLeague: 'ID League',
    stadium: 'Stadium',
    capacity: 'Capacity',
    description: 'Description',
    website: 'Website',
    lastMatches: 'Last 5 Matches',
    upcomingMatches: 'Upcoming 5 Matches',
    searchTeams: 'Search teams...',
    showFavorites: 'Show Favorites',
    noMatchesAvailable: 'No matches available',
    noUpcomingMatchesAvailable: 'No upcoming matches available',
    changeToEnglish: 'Change to English',
    changeToSpanish: 'Change to Spanish',
  },
};

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
}


const TeamsCarousel: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [lastMatches, setLastMatches] = useState<Match[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [favorites, setFavorites] = useState<Team[]>([]); // Estado para favoritos
  const [language, setLanguage] = useState<'es' | 'en'>('en'); // Idioma por defecto

  const t = (key: TranslationKeys) => translations[language][key] || key;

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

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favoriteTeams') || '[]');
    setFavorites(storedFavorites);
  }, []);

  useEffect(() => {
    localStorage.setItem('favoriteTeams', JSON.stringify(favorites));
  }, [favorites]);

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

  const toggleFavorite = (team: Team) => {
    const isFavorite = favorites.some(fav => fav.idTeam === team.idTeam);
    if (isFavorite) {
      setFavorites(favorites.filter(fav => fav.idTeam !== team.idTeam));
    } else {
      setFavorites([...favorites, team]);
    }
  };

  const isFavorite = (team: Team) => {
    return favorites.some(fav => fav.idTeam === team.idTeam);
  };

  const showFavorites = () => {
    setFilteredTeams(favorites);
  };

  return (
    <div className="teams-container">
      <h2>{t('teamsCarousel')}</h2>
      <div className="language-selector">
        <button className="language-button" onClick={() => setLanguage('en')}>English</button>
        <button className="language-button" onClick={() => setLanguage('es')}>Español</button>
      </div>
      {selectedTeam ? (
        <div className="league-details">
          <button onClick={handleBackToCarousel} className="back-button">{t('backToTeams')}</button>
          <h2>
            {selectedTeam.strTeam}
            <span 
              className={`favorite-icon ${isFavorite(selectedTeam) ? 'favorited' : ''}`} 
              onClick={() => toggleFavorite(selectedTeam)}
              style={{ cursor: 'pointer', marginLeft: '10px' }}
            >
              {isFavorite(selectedTeam) ? '★' : '☆'}
            </span>
          </h2>
          {selectedTeam.strBadge && (
            <img src={selectedTeam.strBadge} alt={`${selectedTeam.strTeam} badge`} className="selected-team-badge" />
          )}
          <p><strong>{t('formedYear')}:</strong> {selectedTeam.intFormedYear}</p>
          <p><strong>{t('idLeague')}:</strong> {selectedTeam.idLeague}</p>
          <p><strong>{t('stadium')}:</strong> {selectedTeam.strStadium}</p>
          <p><strong>{t('capacity')}:</strong> {selectedTeam.intStadiumCapacity}</p>
          <p><strong>{t('description')}</strong> {language === 'es' && selectedTeam.strDescriptionES
                      ? selectedTeam.strDescriptionES
                      : selectedTeam.strDescriptionEN}</p>
          {selectedTeam.strWebsite && (
            <p><strong>{t('website')}:</strong> <a href={`http://${selectedTeam.strWebsite}`} target="_blank" rel="noopener noreferrer">{selectedTeam.strWebsite}</a></p>
          )}

          {/* Mostrar los últimos partidos */}
          <h3>{t('lastMatches')}</h3>
          {lastMatches.length > 0 ? (
            <ul className="matches-list">
              {lastMatches.map(match => (
                <li key={match.idEvent}>
                  <div className="match-item">
                    <img src={match.strHomeTeamBadge} alt={`${match.strHomeTeam} badge`} className="match-team-badge small" />
                    <span>{match.strHomeTeam} {match.intHomeScore} - {match.intAwayScore} {match.strAwayTeam}</span>
                    <img src={match.strAwayTeamBadge} alt={`${match.strAwayTeam} badge`} className="match-team-badge small" />
                  </div>
                  <p>{match.dateEvent} - {match.strTime}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>{t('noMatchesAvailable')}</p>
          )}

          {/* Mostrar los próximos partidos */}
          <h3>{t('upcomingMatches')}</h3>
          {upcomingMatches.length > 0 ? (
            <ul className="matches-list">
              {upcomingMatches.map(match => (
                <li key={match.idEvent}>
                  <div className="match-item">
                    <img src={match.strHomeTeamBadge} alt={`${match.strHomeTeam} badge`} className="match-team-badge small" />
                    <span>{match.strHomeTeam} vs {match.strAwayTeam}</span>
                    <img src={match.strAwayTeamBadge} alt={`${match.strAwayTeam} badge`} className="match-team-badge small" />
                  </div>
                  <p>{match.dateEvent} - {match.strTime}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>{t('noUpcomingMatchesAvailable')}</p>
          )}
        </div>
      ) : (
        <>
          <input
            type="text"
            placeholder={t('searchTeams')} 
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          <button onClick={showFavorites} className="back-button">{t('showFavorites')}</button>
          <div className="teams-grid">
            {filteredTeams.map((team) => (
              <div key={team.idTeam} className="team-card" onClick={() => handleTeamClick(team)}>
                <img src={team.strBadge} alt={`${team.strTeam} badge`} className="team-badge" />
                <h3>{team.strTeam}</h3>
                <span 
                  className={`favorite-indicator ${isFavorite(team) ? 'favorited' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(team);
                  }}
                >
                  {isFavorite(team) ? '★' : '☆'}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TeamsCarousel;








