import { db, auth } from './FirebaseConfi';
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

const getUserFavoritesRef = (userId: string) => doc(db, 'users', userId);

export const addFavoriteTeam = async (teamId: string) => {
    const user = auth.currentUser;
    if (user) {
        const userFavoritesRef = getUserFavoritesRef(user.uid);
        await updateDoc(userFavoritesRef, {
            favoriteTeams: arrayUnion(teamId)
        });
    }
};

export const removeFavoriteTeam = async (teamId: string) => {
    const user = auth.currentUser;
    if (user) {
        const userFavoritesRef = getUserFavoritesRef(user.uid);
        await updateDoc(userFavoritesRef, {
            favoriteTeams: arrayRemove(teamId)
        });
    }
};

export const getFavoriteTeams = async () => {
    const user = auth.currentUser;
    if (user) {
        const userFavoritesRef = getUserFavoritesRef(user.uid);
        const docSnap = await getDoc(userFavoritesRef);
        if (docSnap.exists()) {
            return docSnap.data().favoriteTeams || [];
        } else {
            await setDoc(userFavoritesRef, { favoriteTeams: [] });
            return [];
        }
    }
    return [];
};