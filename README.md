# Fulll - Test technique: Frontend

## Introduction

Bonjour à vous lecteur de ce répository, si vous n'êtes pas un employé de l'entreprise Fulll, une explication s'impose.

Il s'agit là d'un test technique reprenant un énoncé dicté par Fulll sur la création d'une application single page de consultation de profils Github avec la possibilité de modifier, duppliquer et supprimer des profils.

## Énoncé

Le contenu de l'énoncé et les objectifs à réalisés resteront privés.

## Méthodologie

I] La première étape a été de faire une récupération des données de l'API Github, pour cela, la création d'un hook personnalisé afin d'isoler la logique du fetch de l'API et englober plusieurs cas de figure.

```typescript
export default function useGithubSearch(pageNumber: number) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>();
  const [data, setData] = useState<GitHubUser | null>();

  const [totalPage, setTotalPage] = useState<number>(1);

  async function fetchData(query: string | undefined) {
    [...]
  }
  function clearData() {}

  return { loading, error, data, fetchData, clearData };
}
```

Il s'agit de là d'un Hook classique à la particularité qu'il renvoi deux fonctions, une pour lancer l'appel à l'API et une autre pour nettoyer les données existantes.

II] La seconde étape consistait à faire une requête API après que l'utilisateur ai rentré du texte dans une barre de recherche, sans action ou de bouton. Pour ce faire, j'ai procédé à la création de deux hooks customisés, toujours dans le but d'isoler le code, le rendre générique et simplifier sa compréhension

1 - `useTimeout`: Qui est un hook définissant un `window.setTimeout` mais qui permet de le nettoyer et de gérer son état.

```typescript
export default function useTimeout(callback: () => void, delay: number) {
  const callbackRef = useRef<() => void>(callback);
  const timeoutRef = useRef<number | null>(null);

  // Réatribution du callback envoyé par le useDebounce en cas de modification de la dépendance, afin d'avoir les dernières valeurs présentes lors du lancement du callback
  useEffect(() => {...}, [callback]);

  // Assignation du setTimeout avec le délai et la dernière fonction callback renseignée à notre référence
  const set = useCallback(() => {...}, [delay]);

  // Nettoyage du timeout
  const clear = useCallback(() => {...}, []);

  // Nettoyage et réatribution du setTimeout à notre référence
  const reset = useCallback(() => {...}, [clear, set]);

  return { reset };
}
```

(Crédit à Kyle de [WebDevSimplified](https://github.com/WebDevSimplified/useful-custom-react-hooks/blob/main/src/2-useTimeout/useTimeout.js) pour l'idée de base de ce Hook, mis à jour par mes soins)

2 - `useDebounce`: Qui permet de définir une fonction à appelé une fois un délai écoulé seulement si une dépendance est appelé par le client

```typescript
export default function useDebounce(callBack: () => void, delay: number, dependency: unknown | undefined) {
  // Instanciation du useTimeout
  const { reset } = useTimeout(callBack, delay);

  // Appel de la méthode reset() du useTimeout en cas de modification de la dépendance seulement si celle-ci existe déjà
  useEffect(() => {
    if (dependency !== undefined) reset();
  }, [dependency, reset]);
}
```

(Crédit à Kyle de [WebDevSimplified](https://github.com/WebDevSimplified/useful-custom-react-hooks/blob/main/src/3-useDebounce/useDebounce.js) pour l'idée de base de ce Hook, mis à jour et amélioré par mes soins)

Une fois les composants crée j'ai pu passer à l'élaboration du code de la gestion des données reçus, l'affichage sur la page ainsi que la gestion des profils.

**| La totalité du code est commenté afin de faciliter la compréhension de chaques function.**

# CI/CD

Un déploiement automatique de cette application a été réalisé avec la Création d'un `.github/workflows/main.yml` afin de réaliser diverse opération une fois le code _push_ sur la branch `main` de mon repository.
Une fois le code sur github le workflow fera :

- `npm install` : Afin de récupérer les dépendances requises
- `npm run test`: Pour réaliser les tests unitaires
- `npm run build`: Pour construire l'application

Et une fois ces étapes validées passera à l'envoi avec `SamKirkland/FTP-Deploy-Actio` sur un FTP mentionné grâce aux clès secrètes enregistrées sur le repository Github.

# Problématique rencontrée

## Mineur : La taille des cartes utilisateurs

Sur le mockup fourni pour l'exercice, il était mentionné une taille de `100px` de large pour la carte utilisateur, cependant après avoir effectué des tests, cette valeur n'a pas été retenu, en effet, cela nuisais à la lisibilité de la carte et de ces valeurs, afin de garder une bonne visiblité sous toute les dimensions, des valeurs maximales et minimales garantissant une bonne visibilités des éléments à été appliqués.

## Mineur : Récupération de données supplémentaires de l'API Github

Par défaut Github limite à 30 le nombre de données renvoyés, et possèdes un système de pagination dans l'URL pour récupérer les autres résultats s'il y en a. Cependant dans l'énoncé aucune mention n'a été faite de ce principe, si on fait une recherche pour l'utilisateur `Test`, on n'aura que 30 des `128579` résultats possible.

J'ai donc pris l'initiative de mettre en place un `observateur d'intersection` afin de récupérer automatiquement la seconde page si elle existe lorsqu'on arrive en bas de page et donner un effet de 'scroll infini'.

## Critique : Les tests unitaires

A l'issu de cette application j'ai rencontré des difficultés à l'élaboration des tests unitaires, j'ai utilisé différentes dépendances et passer de nombreuses minutes à comprendre la configuration pour faire fonctionner les tests avec `TypeScript` & `ECMA`.

Une fois tout cela en place j'ai pu effectuer un premier test que vous retrouverez dans `./src/__tests__` d'un composants, la première difficulté fû d'outrepasser le contexte du mode d'édition implémenter dans le code.

En passant une valeur par défaut et ainsi _"bypass"_ le contexte dans mon composant enfant j'ai pu effectuer mon test correctement.

Mais pour la suite des tests, et donc la composant principal, après plusieurs heures à faire des essais, je n'ai pas reussi de manière convenable à réaliser des tests de mes systèmes à cause de l'architecture du composant `HomePage`

Je suis conscient de mes lacunes dans le domaine des tests "complexes" sur React et je compte bien me mettre à niveau afin de comprendre comment créer mes composants afin de pouvoir les tester sans difficulté par la suite.

C'est donc pour cela que vous ne trouverez donc qu'un seul test effectué sur cette application et je m'en excuse.
