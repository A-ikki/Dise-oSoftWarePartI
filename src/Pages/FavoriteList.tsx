import React, { useState, useEffect } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { auth, db } from '../Services/FirebaseConfi';
import './FavoriteList.css';  // Asegúrate de agregar el CSS adecuado

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

const FavoritesList: React.FC = () => {
  const [favorites, setFavorites] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!auth.currentUser) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      const userId = auth.currentUser.uid;
      const favoritesRef = collection(db, 'users', userId, 'favorites');
      const q = query(favoritesRef);

      try {
        const querySnapshot = await getDocs(q);
        const favoritesList = querySnapshot.docs.map(doc => doc.data() as Player);
        setFavorites(favoritesList);
      } catch (error) {
        console.error("Error fetching favorites:", error);
        setError('Failed to load favorites');
      }

      setLoading(false);
    };

    fetchFavorites();
  }, []);

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player);
  };

  const handleCloseDetails = () => {
    setSelectedPlayer(null);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="favorites-list-container">
      {selectedPlayer ? (
        <div className="player-details">
          <button className="close-button" onClick={handleCloseDetails}>X</button>
          <h2>{selectedPlayer.strPlayer}</h2>
          {selectedPlayer.strThumb && <img src={selectedPlayer.strThumb} alt={`${selectedPlayer.strPlayer}`} className="player-image-large" />}
          <p><strong>Fecha de Nacimiento:</strong> {selectedPlayer.dateBorn}</p>
          <p><strong>Nacionalidad:</strong> {selectedPlayer.strNationality}</p>
          <p><strong>Equipo:</strong> {selectedPlayer.strTeam}</p>
          <p><strong>Seleccionado:</strong> {selectedPlayer.strTeam2}</p>
          <p><strong>Salario:</strong> {selectedPlayer.strWage}</p>
          <p><strong>Lugar de Nacimiento:</strong> {selectedPlayer.strBirthLocation}</p>
          <p><strong>Pierna Fuerte:</strong> {selectedPlayer.strSide}</p>
          <p><strong>Pocision:</strong> {selectedPlayer.strPosition}</p>
          <p><strong>Altura:</strong> {selectedPlayer.strHeight}</p>
          <p><strong>Peso:</strong> {selectedPlayer.strWeight}</p>
          <p className="player-description">{selectedPlayer.strDescriptionEN}</p>
        </div>
      ) : (
        <div>
          <h2>Jugadores Favoritos</h2>
          {favorites.length > 0 ? (
            <div className="player-list">
              {favorites.map(player => (
                <div key={player.idPlayer} className="player-preview" onClick={() => handlePlayerClick(player)}>
                  <img src={player.strThumb} alt={`${player.strPlayer}`} className="player-image-preview" />
                  <h3 className="player-name-preview">{player.strPlayer}</h3>
                </div>
              ))}
            </div>
          ) : (
            <p>No tienes jugadores favoritos.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FavoritesList;
