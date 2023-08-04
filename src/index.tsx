import React from 'react';
import ReactDOM from 'react-dom/client';

import EditModeContext from './component/context/editModeContext';
import HomePage from './homePage';

import './index.css';

// Utilisation d'un contexte qui entoure notre page principal afin de pouvoir communiquer l'état du mode d'édition aux différentes composants enfants
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <EditModeContext>
      <HomePage />
    </EditModeContext>
  </React.StrictMode>
);
