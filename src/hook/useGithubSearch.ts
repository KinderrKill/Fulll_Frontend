import { useState } from 'react';
import { GitHubUser } from './../utils/types';
import { isStringEmpty, GITHUB_SEARCH_URL, MAX_USERS_PER_FETCH } from './../utils/utils';

export default function useGithubSearch(pageNumber: number) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>();
  const [data, setData] = useState<GitHubUser | null>();

  const [totalPage, setTotalPage] = useState<number>(1);

  async function fetchData(query: string | undefined) {
    // Annulation de l'execution si la query est non définis, vide, contient uniquement des espaces où si le nombre maximal de page est atteinte
    if (query === undefined || query.length === 0 || isStringEmpty(query) || pageNumber > totalPage) return;

    try {
      setLoading(true);
      const response = await fetch(
        `${GITHUB_SEARCH_URL}?q=${query}&per_page=${MAX_USERS_PER_FETCH}&page=${pageNumber}`
      );
      if (!response.ok) {
        if (response.status === 403) setError(`${response.status.toString()} : Limite d'appel à l'API atteinte`);
        else setError(response.status.toString());

        setLoading(false);
      } else {
        const result = await response.json();
        setData(result);
        setLoading(false);

        const totalCount = data?.total_count;

        // Calculer le nombre total de pages
        if (totalCount !== undefined) {
          setTotalPage(Math.ceil(totalCount / MAX_USERS_PER_FETCH));
        }
      }
    } catch (error: unknown) {
      setError(error?.toString());
      setLoading(false);
    }
  }

  // Fonction utilitaire de nettoyage des données en cas de suppression complète du contenus de la barre de recherche
  function clearData() {
    setError(null);
    setData(null);
  }

  return { loading, error, data, fetchData, clearData };
}
