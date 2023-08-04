import { useEffect } from 'react';
import useTimeout from './useTimeout';

export default function useDebounce(callBack: () => void, delay: number, dependency: unknown | undefined) {
  // Instanciation du useTimeout
  const { reset } = useTimeout(callBack, delay);

  // Appel de la méthode reset() du useTimeout en cas de modification de la dépendance seulement si celle-ci existe déjà
  useEffect(() => {
    if (dependency !== undefined) reset();
  }, [dependency, reset]);
}
