import { useState, useEffect, useRef, useCallback } from 'react';
import Header from './component/shared/header';
import UserList from './component/userList';
import useDebounce from './hook/useDebounce';
import useGithubSearch from './hook/useGithubSearch';

import iconDuplicate from './assets/icons8-duplicate.webp';
import iconBin from './assets/icons8-bin.webp';
import { isStringEmpty, MAX_USERS_PER_FETCH } from './utils/utils';
import { GitHubUserItem } from './utils/types';
import useEditModeContext from './hook/useEditModeContext';

export default function HomePage() {
  // Utilisation d'un contexte afin de pouvoir vérifier le mode d'édition sur tout les composants necessaires et ne pas charger les props des composants enfants.
  // Le hook custom est là pour faciliter l'utilisation du contexte et de vérifier si celui-ci est bien défini
  const { editMode, toggleEditMode } = useEditModeContext();

  const [searchValue, setSearchValue] = useState<string | undefined>(undefined);

  // Définition d'un useState qui servira de 'copie' des données reçus par Github afin de pouvoir modifier celle-ci à notre guise
  const [userItems, setUserItems] = useState<GitHubUserItem[]>([]);

  // List similaire à la précédente afin de simplifier le traitement des profiles séléctionnés ou non (Impossibilité de faire par GitHubUserItem.id car lors de la duplication le profil gardera le même)
  const [selectedProfiles, setSelectedProfiles] = useState<GitHubUserItem[]>([]);

  // Utilisation d'une variable d'état pour stocker la page actuel de consultation des données Github
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Utilisation d'un Hook custom afin de pouvoir traiter facilement les appels à l'API Github.
  const { loading, error, data, fetchData, clearData } = useGithubSearch(currentPage);

  // Initialisation de notre Hook custom pour la detection des frappes sur le clavier et l'execution de l'action en cas d'arrêt
  useDebounce(
    () => {
      setCurrentPage(1);
      clearData();
      fetchData(searchValue);
    },
    1000,
    searchValue
  );

  // Création d'une référence de notre observateur d'intersection
  const cardObserver = useRef<IntersectionObserver | null>(null);

  // Création d'un callback à assigner à la dernière carte rendu dans notre page
  const lastCardElementRef = useCallback(
    (node: HTMLLIElement | null) => {
      if (loading) return;

      // Déconnexion de l'observer si celui-ci est déjà actif lors de l'appel du callback
      // En résultera la déconnexion de l'ancien observer après la récupération des données de la page suivante
      if (cardObserver.current !== null) cardObserver.current.disconnect();

      // S'il y a une erreur ou qu'il n'y a pas assez de données pour effectué une nouvelle requête, déconnexion on interrompt le callback
      if (error || userItems.length < MAX_USERS_PER_FETCH) {
        return;
      }

      // On définis notre IntersectionObserver avec une logique de code en cas 'd'interception' par le client
      cardObserver.current = new IntersectionObserver((entries) => {
        const [entry] = entries;

        if (entry.isIntersecting) {
          setCurrentPage((prevPageNumber) => prevPageNumber + 1);
          fetchData(searchValue);
        }
      });

      // On assigne à notre référence l'observation de notre dernière carte rendu par le client
      if (node) cardObserver.current.observe(node);
    },
    [loading, error, userItems.length, fetchData, searchValue]
  );

  // Function de traitement du texte entrant et gérer le cas de suppression total du texte où d'espace présent
  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const value = event.target.value;
    setSearchValue(value);

    selectAllProfiles(false);

    if (value === undefined || isStringEmpty(value)) {
      clearData();
    }
  }

  // Gestion de la selection d'un profil, cette fonction définis le profil de l'utilisateur comme étant séléctionné ou non puis met à jour la liste des utilisateurs séléctionnés
  // Cette fonction est envoyé aux composants enfants 'userList.tsx' qui lui même enverra à 'userCard.tsx' afin de faire la liaison entre les composants.
  function handleProfilSelection(userItem: GitHubUserItem): void {
    userItem.isSelected = !userItem.isSelected;
    if (!selectedProfiles.some((profil) => profil === userItem)) {
      setSelectedProfiles((prevValue) => [...prevValue, userItem]);
    } else {
      setSelectedProfiles((prevValue) => prevValue.filter((profil) => profil !== userItem));
    }
  }

  // Gestion de l'action sur la checkbox de séléction de la totalité des profils
  function handleSelectAllProfiles(event: React.ChangeEvent<HTMLInputElement>) {
    if (userItems === undefined || userItems.length === 0) {
      event.target.checked = false;
      return;
    }

    selectAllProfiles(event.target.checked);
  }

  // Fonction générique de séléction / désélection des profils, réalisé pour faciliter le traitement des cas de figures
  // Exemples : Modification de la barre de recherche, sortie du mode édition avec des profils séléctionnés et l'action sur la checkbox de séléction des profils
  function selectAllProfiles(value: boolean) {
    userItems.forEach((userItem) => {
      userItem.isSelected = value;
      if (!value) {
        setSelectedProfiles([]);
      } else {
        if (!selectedProfiles.some((profil) => profil === userItem)) {
          setSelectedProfiles((prevValue) => [...prevValue, userItem]);
        }
      }
    });
  }

  // Fonction de dupplication des profiles séléctionnés
  function dupplicateSelectedProfiles() {
    if (selectedProfiles.length === 0) return;

    setUserItems((prevValue) => [
      ...prevValue,
      ...selectedProfiles.map((selectedProfil) => ({ ...selectedProfil, isSelected: false })),
    ]);
  }

  // Fonction de suppression des profiles séléctionnés
  function deleteSelectedProfiles() {
    if (selectedProfiles.length === 0) return;

    const updatedUserItems = userItems.filter((user) => !selectedProfiles.includes(user));

    setUserItems(updatedUserItems);
    setSelectedProfiles([]);
  }

  // Fonction de gestion de l'état du mode édition et traitement de la suppression de tout les profils séléctionnés en cas de sortie du mode
  function handleToggleEditMode() {
    if (editMode) selectAllProfiles(false);
    toggleEditMode();
  }

  // Synchronisation entre les données reçues et les données enregistrées sur le front
  useEffect(() => {
    if (data === null || data === undefined) {
      setUserItems([]);
    } else {
      setUserItems((prevValue) => [...prevValue, ...data.items]);
    }
  }, [data]);

  return (
    <main className='flex flex-col h-screen'>
      <Header />
      <section className='bg-blue-300 flex-grow flex flex-col justify-around items-center w-full'>
        <div className='flex flex-col w-full md:w-2/3 gap-4 h-full justify-center px-5'>
          <input
            type='text'
            name=''
            id=''
            placeholder="Veuillez entrer un nom d'utilisateur"
            className='w-full lg:w-1/2 mx-auto p-3 rounded-lg'
            onChange={(event) => handleSearchChange(event)}
          />
          <button
            onClick={handleToggleEditMode}
            className='w-full lg:w-1/3 bg-github_light_gray border border-github_light_gray hover:github_light_gray hover:border hover:border-github_text mx-auto py-3 rounded-lg shadow-md shadow-gray-500 hover:scale-[1.02] transition-transform'>
            {editMode ? "Quitter le mode d'édition" : "Mode d'édition"}
          </button>
        </div>
        {editMode ? (
          <article className='flex justify-between w-full h-10 my-8 lg:mb-10 px-10'>
            <div className='mx-5'>
              <input
                type='checkbox'
                role='checkbox'
                name=''
                id=''
                className='w-4 h-4 accent-github_orange'
                checked={userItems.length > 0 && userItems.length === selectedProfiles.length}
                onChange={(event) => handleSelectAllProfiles(event)}
              />
              <span className='ml-3 text-lg'>
                {selectedProfiles.length} {selectedProfiles.length > 1 ? 'profils séléctionnés' : 'profil séléctionné'}
              </span>
            </div>
            <div className='mx-5 flex gap-5'>
              <button
                className='w-8 h-8 cursor-pointer hover:scale-105 transition-transform'
                onClick={dupplicateSelectedProfiles}>
                <img src={iconDuplicate} alt="'Duplicate' icon by Icons8" className='invert' />
              </button>
              <button
                className='w-8 h-8 cursor-pointer hover:scale-105 rounded-full transition-transform'
                onClick={deleteSelectedProfiles}>
                <img src={iconBin} alt="'Bin' icon by Icons8" className='invert' />
              </button>
            </div>
          </article>
        ) : (
          <div className='w-full h-10 mx-auto text-center italic mb-11 px-10'>
            <span>Activer le mode d'édition pour modifier les profils</span>
          </div>
        )}
      </section>
      <UserList
        loading={loading}
        error={error}
        userItems={userItems}
        handleProfilSelection={handleProfilSelection}
        lastCardElementRef={lastCardElementRef}
      />
    </main>
  );
}
