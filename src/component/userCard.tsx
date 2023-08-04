import useEditModeContext from '../hook/useEditModeContext';
import { GithubUserItemProps } from '../utils/types';

export default function UserCard({ userItem, handleProfilSelection, debugEditMode }: GithubUserItemProps) {
  // Importation de la variable editMode afin de rendre dynamique l'affichage de la checkbox sur la carte
  const { editMode } = useEditModeContext();

  return (
    <>
      <section
        className={
          'relative shadow-lg flex flex-col justify-center items-center content-center my-3 py-3 min-w-full w-full h-full mx-10 border border-gray-600 rounded-md ' +
          (userItem.isSelected && 'ring-2 ring-github_orange border-github_orange transition-all')
        }>
        {editMode || debugEditMode ? (
          <input
            type='checkbox'
            role='checkbox'
            className='absolute left-5 top-5 w-3 h-3 accent-github_orange'
            checked={userItem.isSelected}
            onChange={() => handleProfilSelection(userItem)}
          />
        ) : null}
        <img
          src={userItem.avatar_url}
          alt='Profile Image'
          className='w-20 h-20 rounded-full bg-gray-500 object-cover'
        />

        <div className='flex flex-col justify-center mt-5 w-full px-10 text-center'>
          <span className='block text-gray-700 text-md italic'>{userItem.id}</span>
          <span className='block text-gray-600 text-lg mb-4 truncate font-bold'>{userItem.login}</span>

          <a
            href={userItem.html_url}
            className='bg-github_dark_gray border hover:border-github_orange hover:text-github_orange transition-all font-bold rounded px-4 py-2 w-full text-center'>
            Consulter le profil
          </a>
        </div>
      </section>
    </>
  );
}
