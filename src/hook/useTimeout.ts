import { useCallback, useRef, useEffect } from 'react';

export default function useTimeout(callback: () => void, delay: number) {
  const callbackRef = useRef<() => void>(callback);
  const timeoutRef = useRef<number | null>(null);

  // Réatribution du callback envoyé par le useDebounce en cas de modification de la dépendance, afin d'avoir les dernières valeurs présentes lors du lancement du callback
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Assignation du setTimeout avec le délai et la dernière fonction callback renseignée à notre référence
  const set = useCallback(() => {
    timeoutRef.current = window.setTimeout(() => callbackRef.current(), delay);
  }, [delay]);

  // Nettoyage du timeout
  const clear = useCallback(() => {
    timeoutRef.current && clearTimeout(timeoutRef.current);
  }, []);

  // Nettoyage et réatribution du setTimeout à notre référence
  const reset = useCallback(() => {
    clear();
    set();
  }, [clear, set]);

  return { reset };
}
