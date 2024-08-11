// src/Services/api.ts

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

export const fetchLeagueBadge = async (leagueName: string) => {
    try {
        const formattedLeagueName = leagueName.replace(/\s+/g, '_');
        const response = await fetch(`https://www.thesportsdb.com/api/v2/json/3/search/league/${formattedLeagueName}`);
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
        const response = await fetch(`https://www.thesportsdb.com/api/v2/json/3/lookup/league/${idLeague}`);
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
        const response = await fetch(`https://www.thesportsdb.com/api/v2/json/3/schedual/previous/league/${cleanedIdLeague}`);
        const data = await response.json();
        console.log("Recent matches data:", data); // Para depuración
        return data;
    } catch (error) {
        console.error("Error fetching recent matches:", error);
        return null;
    }
};


export const fetchTeamsByLeague = async (leagueName: string) => {
    try {
        const formattedLeagueName = leagueName.replace(/\s+/g, '%20'); // Reemplaza espacios por %20 para la URL
        const response = await fetch(`https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=${formattedLeagueName}`);
        const data = await response.json();
        return data.teams;
    } catch (error) {
        console.error("Error fetching teams data:", error);
        return null;
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







