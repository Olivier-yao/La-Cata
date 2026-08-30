import React, { useEffect, useState } from 'react';
import HomeScreen from './screens/HomeScreen.jsx';
import RoundScreen from './screens/RoundScreen.jsx';
import PlayerSetup from './components/PlayerSetup.jsx';
import ManetteScreen from './screens/ManetteScreen.jsx';
import { sonClic } from './lib/son.js';
import { hapticClic } from './lib/haptique.js';

const EST_MANETTE = new URLSearchParams(window.location.search).get('manette') === '1';

export default function App() {
  const [phase, setPhase] = useState('accueil'); // 'accueil' | 'setup' | 'manche'
  const [joueurs, setJoueurs] = useState([]);

  // Un clic sonore discret sur n'importe quel bouton .btn de l'appli,
  // sans avoir à instrumenter chaque composant individuellement.
  useEffect(() => {
    const surClic = (e) => {
      if (e.target.closest('.btn')) {
        sonClic();
        hapticClic();
      }
    };
    document.addEventListener('click', surClic);
    return () => document.removeEventListener('click', surClic);
  }, []);

  if (EST_MANETTE) {
    return <ManetteScreen />;
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
      }}
    >
      {phase === 'accueil' && <HomeScreen onCommencer={() => setPhase('setup')} />}

      {phase === 'setup' && (
        <PlayerSetup
          onValider={(j) => {
            setJoueurs(j);
            setPhase('manche');
          }}
        />
      )}

      {phase === 'manche' && (
        <RoundScreen
          joueurs={joueurs}
          onNouvelleSoiree={() => {
            setJoueurs([]);
            setPhase('accueil');
          }}
        />
      )}
    </div>
  );
}
