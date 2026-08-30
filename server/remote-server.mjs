// remote-server.mjs — petit serveur WebSocket local pour "La Cata".
//
// Rôle unique : relier l'écran hôte (le PC/tablette posé sur la table) aux
// téléphones des joueurs pendant la soirée, pour qu'ils puissent voter
// individuellement depuis leur propre écran au lieu d'un seul clic pour
// toute la table. Tourne en local sur le réseau Wi-Fi de la soirée —
// aucun service externe, aucun compte, aucune donnée qui sort de la pièce.
//
// Une "salle" = un code à 4 lettres généré par l'hôte. Un seul hôte par
// salle, plusieurs téléphones. Le serveur ne fait que relayer des messages
// JSON, toute la logique de jeu reste côté client (host React app).
//
// Lancement : node server/remote-server.mjs (voir npm run remote)

import { WebSocketServer } from 'ws';

const PORT = process.env.REMOTE_PORT || 5185;
const wss = new WebSocketServer({ port: PORT });

// code -> { host: ws|null, joueurs: string[], joueursConnectes: Map<nom, ws> }
const salles = new Map();

function obtenirSalle(code) {
  if (!salles.has(code)) {
    salles.set(code, { host: null, joueurs: [], joueursConnectes: new Map() });
  }
  return salles.get(code);
}

function envoyer(ws, message) {
  if (ws && ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(message));
  }
}

function listeJoueursPourHost(salle) {
  return salle.joueurs.map((nom) => ({ nom, connecte: salle.joueursConnectes.has(nom) }));
}

function diffuserListeJoueurs(salle) {
  envoyer(salle.host, { type: 'player-list', joueurs: listeJoueursPourHost(salle) });
}

wss.on('connection', (ws) => {
  ws.role = null; // 'host' | 'player'
  ws.code = null;
  ws.nom = null;

  ws.on('message', (data) => {
    let msg;
    try {
      msg = JSON.parse(data.toString());
    } catch {
      return;
    }

    if (msg.type === 'host-start') {
      const salle = obtenirSalle(msg.code);
      salle.host = ws;
      ws.role = 'host';
      ws.code = msg.code;
      diffuserListeJoueurs(salle);
      return;
    }

    if (msg.type === 'set-joueurs' && ws.role === 'host') {
      const salle = obtenirSalle(ws.code);
      salle.joueurs = msg.joueurs;
      diffuserListeJoueurs(salle);
      return;
    }

    if (msg.type === 'player-join') {
      const salle = salles.get(msg.code);
      if (!salle) {
        envoyer(ws, { type: 'join-error', message: "Ce code ne correspond à aucune soirée en cours." });
        return;
      }
      if (!salle.joueurs.includes(msg.nom)) {
        envoyer(ws, { type: 'join-error', message: `« ${msg.nom} » n'est pas dans la liste des joueurs de cette soirée.` });
        return;
      }
      ws.role = 'player';
      ws.code = msg.code;
      ws.nom = msg.nom;
      salle.joueursConnectes.set(msg.nom, ws);
      envoyer(ws, { type: 'joined', nom: msg.nom, index: salle.joueurs.indexOf(msg.nom) });
      diffuserListeJoueurs(salle);
      return;
    }

    if (msg.type === 'vote-start' && ws.role === 'host') {
      const salle = obtenirSalle(ws.code);
      for (const joueurWs of salle.joueursConnectes.values()) {
        envoyer(joueurWs, { type: 'vote-start', question: msg.question });
      }
      return;
    }

    if (msg.type === 'vote' && ws.role === 'player') {
      const salle = salles.get(ws.code);
      if (!salle) return;
      envoyer(salle.host, { type: 'vote-received', nom: ws.nom, points: msg.points });
      envoyer(ws, { type: 'vote-ack' });
      return;
    }
  });

  ws.on('close', () => {
    if (!ws.code) return;
    const salle = salles.get(ws.code);
    if (!salle) return;
    if (ws.role === 'host' && salle.host === ws) {
      salle.host = null;
      for (const joueurWs of salle.joueursConnectes.values()) {
        envoyer(joueurWs, { type: 'host-left' });
      }
    } else if (ws.role === 'player' && salle.joueursConnectes.get(ws.nom) === ws) {
      salle.joueursConnectes.delete(ws.nom);
      diffuserListeJoueurs(salle);
    }
  });
});

console.log(`Serveur manette La Cata en écoute sur le port ${PORT}`);
