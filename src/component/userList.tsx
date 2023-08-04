import { UserListProps } from '@/utils/types';
import UserCard from './userCard';

export default function UserList({
  loading,
  error,
  userItems,
  handleProfilSelection,
  lastCardElementRef,
}: UserListProps) {
  return (
    <section className='bg-github_light_gray overflow-y-scroll h-2/3 max-h-full shadow-inner shadow-github_gray'>
      <ul className='mt-10 mx-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12'>
        {userItems.map((item, index) => {
          if (index + 1 === userItems.length) {
            return (
              <li key={index} className='flex justify-center' ref={lastCardElementRef}>
                <UserCard userItem={item} handleProfilSelection={handleProfilSelection} />
              </li>
            );
          } else {
            return (
              <li key={index} className='flex justify-center'>
                <UserCard userItem={item} handleProfilSelection={handleProfilSelection} />
              </li>
            );
          }
        })}
      </ul>
      <article className='flex justify-center my-5 pt-5 text-lg font-bold'>
        {loading && <div>Chargement en cours...</div>}
        {error && <div className='text-github_orange'>Erreur lors de la récupération des données : {error}</div>}
        {userItems.length === 0 && <div>Aucun profil à afficher...</div>}
      </article>
    </section>
  );
}
