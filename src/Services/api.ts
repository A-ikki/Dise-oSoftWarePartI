const BASE_URL_V2 = '/api/v2/json'; // Usar la ruta relativa para el proxy
const API_KEY = '3';

export const fetchTeamByName = async (teamName: string) => {
    try {
        const response = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${teamName}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching team data:", error);
        return null;
    }
};

export const fetchPlayerByName = async (playerName: string) => {
    try {
        const response = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${playerName}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Unable to fetch data:", error);
        return null;
    }
};

export const fetchAllLeagues = async () => {
    try {
        const response = await fetch('https://www.thesportsdb.com/api/v1/json/3/all_leagues.php');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching leagues data:", error);
        return null;
    }
};

export const fetchTeamsByLeague = async (leagueName: string) => {
    try {
        const formattedLeagueName = encodeURIComponent(leagueName); // Reemplaza espacios por %20 para la URL
        const response = await fetch(`https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=${formattedLeagueName}`);
        const data = await response.json();
        return data.teams || []; // Devuelve un array vacío si no hay equipos
    } catch (error) {
        console.error("Error fetching teams data:", error);
        return [];
    }
};


export const getTeamsByLeagueId = async (leagueId: string) => {
    const response = await fetch(`https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?id=${leagueId}`);
    const data = await response.json();
    return data.teams.map((team: any) => ({
        idTeam: team.idTeam,
        strTeam: team.strTeam,
        strBadge: team.strBadge,
    }));
};

export const fetchStandings = async (leagueId: string, season: string) => {
    try {
        const response = await fetch(`https://www.thesportsdb.com/api/v1/json/3/lookuptable.php?l=${leagueId}&s=${season}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data.table; // Retorna la lista de posiciones
    } catch (error) {
        console.error("Error fetching standings:", error);
        return null;
    }
};

export const fetchLeagueBadge = async (leagueId: string) => {
    try {
        const response = await fetch(`https://www.thesportsdb.com/api/v1/json/3/lookupleague.php?id=${leagueId}`);
        const data = await response.json();

        if (data && data.leagues && data.leagues.length > 0) {
            return data.leagues[0].strBadge;
        }
        return null;
    } catch (error) {
        console.error("Error fetching league badge:", error);
        return null;
    }
};

export const fetchLeagueDetails = async (idLeague: string) => {
    try {
        const response = await fetch(`https://www.thesportsdb.com/api/v2/json/lookup/league/${idLeague}`, {
            headers: {
                'X-API-KEY': API_KEY
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data.leagues ? data.leagues[0] : null;
    } catch (error) {
        console.error("Error fetching league details:", error);
        return null;
    }
};

export const fetchRecentMatches = async (idLeague: string) => {
    try {
        const cleanedIdLeague = idLeague.trim();
        const response = await fetch(`$https://www.thesportsdb.com/api/v2/json/schedual/previous/league/${cleanedIdLeague}`, {
            headers: {
                'X-API-KEY': "3"
            }
        });
        const data = await response.json();
        console.log("Recent matches data:", data); // Para depuración
        return data;
    } catch (error) {
        console.error("Error fetching recent matches:", error);
        return null;
    }
};

export const fetchEnglandLeagues = async () => {
    try {
        const response = await fetch('https://www.thesportsdb.com/api/v1/json/3/search_all_leagues.php?c=England');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched data:', data); // Imprime toda la respuesta para inspección

        // Asegúrate de que la estructura es como esperas
        if (data && data.countries) {
            // Filtra solo las ligas de fútbol
            const soccerLeagues = data.countries.filter((league: any) => league.strSport === 'Soccer');
            console.log('Filtered soccer leagues:', soccerLeagues); // Imprime las ligas filtradas
            return soccerLeagues;
        } else {
            console.error('No leagues data found or unexpected data structure:', data);
            throw new Error('No leagues data found or unexpected data structure');
        }
    } catch (error) {
        console.error('Error fetching Spanish leagues:', error);
        throw error;
    }
};


export const fetchUpcomingMatches = async (idLeague: string) => {
    try {
        const cleanedIdLeague = idLeague.trim();
        const response = await fetch(`https://www.thesportsdb.com/api/v2/json/schedual/next/league/${cleanedIdLeague}`, {
            headers: {
                'X-API-KEY': API_KEY
            }
        });
        const data = await response.json();
        console.log("Upcoming matches data:", data); // Para depuración
        return data;
    } catch (error) {
        console.error("Error fetching upcoming matches:", error);
        return null;
    }
};






