// Limite maximal imposée par Github 30
export const MAX_USERS_PER_FETCH = 30;
export const GITHUB_SEARCH_URL = 'https://api.github.com/search/users';

// Fonction utilitaire pour détecter si le texte renseigné contient uniquement des espaces ou non
export function isStringEmpty(inputString: string): boolean {
  return inputString.trim().length === 0;
}
