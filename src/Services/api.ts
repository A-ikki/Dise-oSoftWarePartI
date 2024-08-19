

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


export const fetchEnglandLeagues = async () => {
    try {
        // Definir las URLs para cada país
        const urls = [
            'https://www.thesportsdb.com/api/v1/json/3/search_all_leagues.php?c=England',
            'https://www.thesportsdb.com/api/v1/json/3/search_all_leagues.php?c=Spain',
            'https://www.thesportsdb.com/api/v1/json/3/search_all_leagues.php?c=Italy'
        ];

        // Realizar todas las solicitudes en paralelo usando Promise.all
        const responses = await Promise.all(urls.map(url => fetch(url)));

        // Verificar si todas las respuestas son exitosas
        const successfulResponses = responses.filter(response => response.ok);
        if (successfulResponses.length !== responses.length) {
            throw new Error('Some requests failed');
        }

        // Parsear todas las respuestas en JSON
        const data = await Promise.all(successfulResponses.map(response => response.json()));

        // Combinar y filtrar los datos para obtener solo ligas de fútbol
        const combinedLeagues = data.flatMap(item => {
            return item.countries.filter((league: any) => league.strSport === 'Soccer');
        });

        // Especificar el orden deseado
        const priorityOrder = [
            "English Premier League",
            "Spanish La Liga",
            "Italian Serie A",
            "English League Championship",
            "Spanish La Liga 2",
            "Italian Serie B"
        ];

        // Ordenar las ligas con las prioritarias al inicio
        const sortedLeagues = combinedLeagues.sort((a, b) => {
            const indexA = priorityOrder.indexOf(a.strLeague);
            const indexB = priorityOrder.indexOf(b.strLeague);

            if (indexA !== -1 && indexB === -1) {
                return -1; // a tiene prioridad y b no, a va primero
            } else if (indexA === -1 && indexB !== -1) {
                return 1; // b tiene prioridad y a no, b va primero
            } else if (indexA !== -1 && indexB !== -1) {
                return indexA - indexB; // ambos tienen prioridad, se comparan los índices
            } else {
                return a.strLeague.localeCompare(b.strLeague); // ninguno tiene prioridad, se comparan alfabéticamente
            }
        });

        console.log('Sorted soccer leagues:', sortedLeagues);

        return sortedLeagues;
    } catch (error) {
        console.error('Error fetching leagues from multiple countries:', error);
        throw error;
    }
};



export const fetchPlayersByTeamName = async (teamName: string) => {
    try {
        const formattedTeamName = encodeURIComponent(teamName); // Reemplaza espacios por %20 para la URL
        const response = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?t=${formattedTeamName}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data.player || []; 
    } catch (error) {
        console.error("Error fetching players data:", error);
        return [];
    }
};

// api.ts
export const fetchLastFiveMatches = async (idTeam: string) => {
    try {
        const response = await fetch(`https://www.thesportsdb.com/api/v1/json/3/eventslast.php?id=${idTeam}`);
        const data = await response.json();
        if (data && Array.isArray(data.results)) {
            return data.results.map((results: any) => ({
                idEvent: results.idEvent,
                strEvent: results.strEvent,
                strHomeTeam: results.strHomeTeam,
                strAwayTeam: results.strAwayTeam,
                strHomeTeamBadge: results.strHomeTeamBadge,
                strAwayTeamBadge: results.strAwayTeamBadge,
                strTime: results.strTime,
                dateEvent: results.dateEvent,
                intHomeScore: results.intHomeScore,
                intAwayScore: results.intAwayScore,
            }));
        }
        return [];
    } catch (error) {
        console.error("Error fetching last five matches:", error);
        return [];
    }
};





