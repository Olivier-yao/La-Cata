import React, { useEffect, useState } from 'react';
import HomeScreen from './screens/HomeScreen.jsx';
import RoundScreen from './screens/RoundScreen.jsx';
import PlayerSetup from './components/PlayerSetup.jsx';
import ManetteScreen from './screens/ManetteScreen.jsx';
import { useRemoteHote } from './lib/useRemoteHote.js';
import { sonClic } from './lib/son.js';
import { hapticClic } from './lib/haptique.js';

const EST_MANETTE = new URLSearchParams(window.location.search).get('manette') === '1';

export default function App() {
  const [phase, setPhase] = useState('accueil'); // 'accueil' | 'setup' | 'manche'
  const [joueurs, setJoueurs] = useState([]);

  // Un seul hôte de manette pour toute la session : activé dès le lobby
  // (voir plus bas) et gardé tel quel jusqu'à RoundScreen, pour que le
  // code/QR affiché au lancement reste valable pendant toute la soirée.
  const remote = useRemoteHote(joueurs, {
    onNouveauJoueur: (nom) => {
      setJoueurs((prev) => (prev.some((j) => j.toLowerCase() === nom.toLowerCase()) ? prev : [...prev, nom]));
    },
  });

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

  // Proposer de connecter les téléphones dès le lobby, pas seulement une
  // fois la partie commencée : le QR/code apparaît automatiquement quand
  // on arrive sur l'écran d'ajout des joueurs.
  useEffect(() => {
    if (phase === 'setup' && !remote.actif) remote.activer();
  }, [phase, remote.actif]);

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
          joueurs={joueurs}
          onChangerJoueurs={setJoueurs}
          remote={remote}
          onValider={() => setPhase('manche')}
        />
      )}

      {phase === 'manche' && (
        <RoundScreen
          joueurs={joueurs}
          remote={remote}
          onNouvelleSoiree={() => {
            setJoueurs([]);
            remote.desactiver();
            setPhase('accueil');
          }}
        />
      )}
    </div>
  );
}
