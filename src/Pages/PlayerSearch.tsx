import React, { useState, useEffect } from 'react';
import './PlayerSearch.css';
import { doc, setDoc, deleteDoc, collection, getDocs, query } from 'firebase/firestore';
import { auth, db } from '../Services/FirebaseConfi';

interface Player {
  idPlayer: string;
  strPlayer: string;
  dateBorn: string;
  strNationality: string;
  strDescriptionEN: string;
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

const PlayerSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('Cristiano Ronaldo');
  const [players, setPlayers] = useState<Player[]>([]);
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState<string>('Cristiano Ronaldo');
  const [favorites, setFavorites] = useState<Player[]>([]);
  const [showFavorites, setShowFavorites] = useState<boolean>(false);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const response = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${submittedSearchTerm}`);
        const data = await response.json();
        if (data && Array.isArray(data.player)) {
          setPlayers(data.player);
        } else {
          setPlayers([]);
        }
      } catch (error) {
        console.error("Error fetching players:", error);
        setPlayers([]);
      }
    };

    fetchPlayer();
  }, [submittedSearchTerm]);

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

  return (
    <div className="player-search-container">
      <div className="favorites-toggle" onClick={toggleShowFavorites}>
        <span
          className="favorite-icon-large"
          style={{ cursor: 'pointer', color: showFavorites ? 'gold' : 'gray' }}
          title="Mostrar Favoritos"
        >
          ★
        </span>
      </div>

      {!showFavorites ? (
        <div className="player-search">
          <h2>Buscar Jugadores</h2>
          <form onSubmit={handleSearch} className="search-form">
            <div className="input-group">
              <input
                type="text"
                placeholder="Ingresa el nombre completo del jugador"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-button">Buscar</button>
              <span className="help-icon" title="Debes poner el nombre completo del jugador que quieres buscar">?</span>
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
                      title={favorites.some(fav => fav.idPlayer === player.idPlayer) ? "Eliminar de favoritos" : "Agregar a favoritos"}
                      onClick={() =>
                        favorites.some(fav => fav.idPlayer === player.idPlayer)
                          ? handleRemoveFromFavorites(player)
                          : handleAddToFavorites(player)
                      }
                      style={{
                        cursor: 'pointer',
                        marginLeft: '10px',
                        color: favorites.some(fav => fav.idPlayer === player.idPlayer) ? 'gold' : 'gray',
                      }}
                    >
                      ★
                    </span>
                  </h3>
                  {player.strThumb && <img src={player.strThumb} alt={`${player.strPlayer}`} className="player-image" />}
                  <p><strong>Fecha de Nacimiento:</strong> {player.dateBorn}</p>
                  <p><strong>Nacionalidad:</strong> {player.strNationality}</p>
                  <p><strong>Equipo:</strong> {player.strTeam}</p>
                  <p><strong>Seleccionado:</strong> {player.strTeam2}</p>
                  <p><strong>Salario:</strong> {player.strWage}</p>
                  <p><strong>Lugar de Nacimiento:</strong> {player.strBirthLocation}</p>
                  <p><strong>Pierna Fuerte:</strong> {player.strSide}</p>
                  <p><strong>Pocision:</strong> {player.strPosition}</p>
                  <p><strong>Altura:</strong> {player.strHeight}</p>
                  <p><strong>Peso:</strong> {player.strWeight}</p>
                  <p className="player-description">{player.strDescriptionEN}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No se encontraron jugadores</p>
          )}
        </div>
      ) : (
        <div className="favorites-section">
          <h2>Jugadores Favoritos</h2>
          {favorites.length > 0 ? (
            <div className="player-list">
              {favorites.map(fav => (
                <div key={fav.idPlayer} className="player-card">
                  <h3 className="player-name">
                    {fav.strPlayer}
                    <span
                      className="favorite-icon"
                      title="Eliminar de favoritos"
                      onClick={() => handleRemoveFromFavorites(fav)}
                      style={{
                        cursor: 'pointer',
                        marginLeft: '10px',
                        color: 'gold',
                      }}
                    >
                      ★
                    </span>
                  </h3>
                  {fav.strThumb && <img src={fav.strThumb} alt={`${fav.strPlayer}`} className="player-image" />}
                  <p><strong>Fecha de Nacimiento:</strong> {fav.dateBorn}</p>
                  <p><strong>Nacionalidad:</strong> {fav.strNationality}</p>
                  <p><strong>Equipo:</strong> {fav.strTeam}</p>
                  <p className="player-description">{fav.strDescriptionEN}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No hay jugadores favoritos</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PlayerSearch;
