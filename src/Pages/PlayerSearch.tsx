import React, { useState, useEffect } from 'react';
import './PlayerSearch.css';
import { doc, setDoc, deleteDoc, collection, getDocs, query } from 'firebase/firestore';
import { auth, db } from '../Services/FirebaseConfi';

// Definición de las interfaces
interface Player {
  idPlayer: string;
  strPlayer: string;
  dateBorn: string;
  strNationality: string;
  strDescriptionEN: string;
  strDescriptionES?: string; // Añadido para la descripción en español
  strTeam: string;
  strThumb: string;
  strWage: string;
  strBirthLocation: string;
  strSide: string;
  strPosition: string;
  strHeight: string;
  strWeight: string;
  strInstagram: string;
  strTeam2: string;
}

// Definición de las claves de traducción
type TranslationKeys = 'searchPlayers' | 'enterName' | 'search' | 'showFavorites' | 'noPlayersFound' |
  'favoritePlayers' | 'noFavoritePlayers' | 'dateOfBirth' | 'nationality' | 'team' | 
  'selected' | 'wage' | 'birthLocation' | 'strongFoot' | 'position' | 'height' | 'weight' |
  'removeFromFavorites' | 'addToFavorites' | 'changeToEnglish' | 'changeToSpanish' | 
  'description' | 'instagram';

const translations: Record<'es' | 'en', Record<TranslationKeys, string>> = {
  es: {
    searchPlayers: 'Buscar Jugadores',
    enterName: 'Ingresa el nombre completo del jugador',
    search: 'Buscar',
    showFavorites: 'Mostrar Favoritos',
    noPlayersFound: 'No se encontraron jugadores',
    favoritePlayers: 'Jugadores Favoritos',
    noFavoritePlayers: 'No hay jugadores favoritos',
    dateOfBirth: 'Fecha de Nacimiento:',
    nationality: 'Nacionalidad:',
    team: 'Equipo:',
    selected: 'Seleccionado:',
    wage: 'Salario:',
    birthLocation: 'Lugar de Nacimiento:',
    strongFoot: 'Pierna Fuerte:',
    position: 'Posición:',
    height: 'Altura:',
    weight: 'Peso:',
    removeFromFavorites: 'Eliminar de favoritos',
    addToFavorites: 'Agregar a favoritos',
    changeToEnglish: 'Cambiar a Inglés',
    changeToSpanish: 'Cambiar a Español',
    description: 'Descripción:',
    instagram: 'Instagram:',
  },
  en: {
    searchPlayers: 'Search Players',
    enterName: 'Enter the player\'s full name',
    search: 'Search',
    showFavorites: 'Show Favorites',
    noPlayersFound: 'No players found',
    favoritePlayers: 'Favorite Players',
    noFavoritePlayers: 'No favorite players',
    dateOfBirth: 'Date of Birth:',
    nationality: 'Nationality:',
    team: 'Team:',
    selected: 'Selected:',
    wage: 'Wage:',
    birthLocation: 'Birth Location:',
    strongFoot: 'Strong Foot:',
    position: 'Position:',
    height: 'Height:',
    weight: 'Weight:',
    removeFromFavorites: 'Remove from Favorites',
    addToFavorites: 'Add to Favorites',
    changeToEnglish: 'Change to English',
    changeToSpanish: 'Change to Spanish',
    description: 'Description:',
    instagram: 'Instagram:',
  },
};

// Mapeo para las traducciones de la pierna fuerte
const sideTranslations: Record<'es' | 'en', Record<string, string>> = {
  es: {
    Right: 'Derecha',
    Left: 'Izquierda',
    Both: 'Ambas'
  },
  en: {
    Right: 'Right',
    Left: 'Left',
    Both: 'Both'
  }
};

// Mapeo para las traducciones de la posición
const positionTranslations: Record<'es' | 'en', Record<string, string>> = {
  es: {
    Goalkeeper: 'Portero',
    Defender: 'Defensor',
    'Center Back': 'Defensa Central',
    'Full Back': 'Lateral',
    'Wing Back': 'Carrilero',
    Sweeper: 'Líbero',
    Midfielder: 'Centrocampista',
    'Central Midfielder': 'Centrocampista Central',
    'Defensive Midfielder': 'Centrocampista Defensivo',
    'Attacking Midfielder': 'Centrocampista Ofensivo',
    'Wide Midfielder': 'Centrocampista Extremo',
    Forward: 'Delantero',
    'Centre-Forward': 'Delantero Centro',
    Winger: 'Extremo',
    'Right Winger': 'Extremo Derecho',
    'Left Winger': 'Extremo Izquierdo',
    'Second Striker': 'Delantero Secundario'
  },
  en: {
    Goalkeeper: 'Goalkeeper',
    Defender: 'Defender',
    'Center Back': 'Center Back',
    'Full Back': 'Full Back',
    'Wing Back': 'Wing Back',
    Sweeper: 'Sweeper',
    Midfielder: 'Midfielder',
    'Central Midfielder': 'Central Midfielder',
    'Defensive Midfielder': 'Defensive Midfielder',
    'Attacking Midfielder': 'Attacking Midfielder',
    'Wide Midfielder': 'Wide Midfielder',
    Forward: 'Forward',
    'Centre-Forward': 'Centre-Forward',
    Winger: 'Winger',
    'Right Winger': 'Right Winger',
    'Left Winger': 'Left Winger',
    'Second Striker': 'Second Striker'
  }
};

const PlayerSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('Cristiano Ronaldo');
  const [players, setPlayers] = useState<Player[]>([]);
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState<string>('Cristiano Ronaldo');
  const [favorites, setFavorites] = useState<Player[]>([]);
  const [showFavorites, setShowFavorites] = useState<boolean>(false);
  const [language, setLanguage] = useState<'es' | 'en'>('es'); // Estado para manejar el idioma

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!auth.currentUser) return;

      const userId = auth.currentUser.uid;
      const favoritesRef = collection(db, 'users', userId, 'favorites');
      const q = query(favoritesRef);
      const querySnapshot = await getDocs(q);

      const favoritesList = querySnapshot.docs.map(doc => doc.data() as Player);
      setFavorites(favoritesList);
    };

    fetchFavorites();
  }, [auth.currentUser]);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmittedSearchTerm(searchTerm.trim());
  };

  const addToFavorites = async (player: Player) => {
    if (!auth.currentUser) {
      console.error("User must be logged in to save favorites.");
      return;
    }

    const userId = auth.currentUser.uid;
    const playerRef = doc(db, 'users', userId, 'favorites', player.idPlayer);

    await setDoc(playerRef, player);
  };

  const removeFromFavorites = async (player: Player) => {
    if (!auth.currentUser) {
      console.error("User must be logged in to remove favorites.");
      return;
    }

    const userId = auth.currentUser.uid;
    const playerRef = doc(db, 'users', userId, 'favorites', player.idPlayer);

    await deleteDoc(playerRef);
  };

  const handleAddToFavorites = async (player: Player) => {
    const isFavorite = favorites.some(fav => fav.idPlayer === player.idPlayer);
    if (!isFavorite) {
      await addToFavorites(player);
      setFavorites([...favorites, player]);
    }
  };

  const handleRemoveFromFavorites = async (player: Player) => {
    await removeFromFavorites(player);
    setFavorites(favorites.filter(fav => fav.idPlayer !== player.idPlayer));
  };

  const toggleShowFavorites = () => {
    setShowFavorites(!showFavorites);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es'); // Cambia el idioma entre español e inglés
  };

  // Obtener las traducciones para el idioma actual
  const t = (key: TranslationKeys) => translations[language][key] || key;

  // Función para traducir la pierna fuerte
  const translateSide = (side: string) => sideTranslations[language][side] || side;

  // Función para traducir la posición
  const translatePosition = (position: string) => positionTranslations[language][position] || position;

  return (
    <div className="player-search-container">
      <div className="language-toggle" onClick={toggleLanguage}>
        <span
          className="language-icon"
          title={language === 'es' ? t('changeToEnglish') : t('changeToSpanish')}
        >
          {language === 'es' ? 'EN' : 'ES'}
        </span>
      </div>

      <div className="favorites-toggle" onClick={toggleShowFavorites}>
        <span
          className="favorite-icon-large"
          style={{ cursor: 'pointer', color: showFavorites ? 'gold' : 'gray' }}
          title={t('showFavorites')}
        >
          ★
        </span>
      </div>

      {!showFavorites ? (
        <div className="player-search">
          <h2>{t('searchPlayers')}</h2>
          <form onSubmit={handleSearch} className="search-form">
            <div className="input-group">
              <input
                type="text"
                placeholder={t('enterName')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-button">
                {t('search')}
              </button>
              <span className="help-icon" title={t('enterName')}>?</span>
            </div>
          </form>

          {players.length > 0 ? (
            <div className="player-list">
              {players.map(player => (
                <div key={player.idPlayer} className="player-card">
                  <h3 className="player-name">
                    {player.strPlayer}
                    <span
                      className="favorite-icon"
                      title={favorites.some(fav => fav.idPlayer === player.idPlayer) ? t('removeFromFavorites') : t('addToFavorites')}
                      onClick={() => {
                        if (favorites.some(fav => fav.idPlayer === player.idPlayer)) {
                          handleRemoveFromFavorites(player);
                        } else {
                          handleAddToFavorites(player);
                        }
                      }}
                      style={{ cursor: 'pointer', color: favorites.some(fav => fav.idPlayer === player.idPlayer) ? 'gold' : 'gray' }}
                    >
                      ★
                    </span>
                  </h3>
                  <div className="player-info">
                    <img src={player.strThumb} alt={player.strPlayer} className="player-image" />
                    <p><strong>{t('dateOfBirth')}</strong> {player.dateBorn}</p>
                    <p><strong>{t('nationality')}</strong> {player.strNationality}</p>
                    <p><strong>{t('team')}</strong> {player.strTeam}</p>
                    <p><strong>{t('selected')}</strong> {player.strTeam2}</p>
                    <p><strong>{t('wage')}</strong> {player.strWage}</p>
                    <p><strong>{t('birthLocation')}</strong> {player.strBirthLocation}</p>
                    <p><strong>{t('strongFoot')}</strong> {translateSide(player.strSide)}</p>
                    <p><strong>{t('position')}</strong> {translatePosition(player.strPosition)}</p>
                    <p><strong>{t('height')}</strong> {player.strHeight}</p>
                    <p><strong>{t('weight')}</strong> {player.strWeight}</p>
                    <p><strong>{t('description')}</strong> {language === 'es' && player.strDescriptionES
                      ? player.strDescriptionES
                      : player.strDescriptionEN}</p>
                    <p><strong>{t('instagram')}</strong> <a href={player.strInstagram} target="_blank" rel="noopener noreferrer">{player.strInstagram}</a></p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-players-found">
              <p>{t('noPlayersFound')}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="favorites-list">
          <h2>{t('favoritePlayers')}</h2>
          {favorites.length > 0 ? (
            <div className="player-list">
              {favorites.map(player => (
                <div key={player.idPlayer} className="player-card">
                  <h3 className="player-name">
                    {player.strPlayer}
                    <span
                      className="favorite-icon"
                      title={t('removeFromFavorites')}
                      onClick={() => handleRemoveFromFavorites(player)}
                      style={{ cursor: 'pointer', color: 'gold' }}
                    >
                      ★
                    </span>
                  </h3>
                  <div className="player-info">
                    <img src={player.strThumb} alt={player.strPlayer} className="player-image" />
                    <p><strong>{t('dateOfBirth')}</strong> {player.dateBorn}</p>
                    <p><strong>{t('nationality')}</strong> {player.strNationality}</p>
                    <p><strong>{t('team')}</strong> {player.strTeam}</p>
                    <p><strong>{t('selected')}</strong> {player.strTeam2}</p>
                    <p><strong>{t('wage')}</strong> {player.strWage}</p>
                    <p><strong>{t('birthLocation')}</strong> {player.strBirthLocation}</p>
                    <p><strong>{t('strongFoot')}</strong> {translateSide(player.strSide)}</p>
                    <p><strong>{t('position')}</strong> {translatePosition(player.strPosition)}</p>
                    <p><strong>{t('height')}</strong> {player.strHeight}</p>
                    <p><strong>{t('weight')}</strong> {player.strWeight}</p>
                    <p><strong>{t('description')}</strong> {language === 'es' && player.strDescriptionES
                      ? player.strDescriptionES
                      : player.strDescriptionEN}</p>
                    <p><strong>{t('instagram')}</strong> <a href={player.strInstagram} target="_blank" rel="noopener noreferrer">{player.strInstagram}</a></p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>{t('noFavoritePlayers')}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PlayerSearch;
