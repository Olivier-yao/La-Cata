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

// Ping/pong toutes les 10s : sans ça, une connexion morte en silence (Wi-Fi
// coupé, téléphone mis en veille profonde) reste "connectée" côté serveur
// indéfiniment — le prochain vote-start part dans le vide et personne ne
// s'en aperçoit. En forçant la fermeture des sockets qui ne répondent plus,
// le client (voir remote.js) déclenche son propre onclose et se reconnecte
// tout seul.
const INTERVALLE_PING = 10000;
const intervalPing = setInterval(() => {
  for (const ws of wss.clients) {
    if (ws.enVie === false) {
      ws.terminate();
      continue;
    }
    ws.enVie = false;
    ws.ping();
  }
}, INTERVALLE_PING);
wss.on('close', () => clearInterval(intervalPing));

wss.on('connection', (ws) => {
  ws.role = null; // 'host' | 'player'
  ws.code = null;
  ws.nom = null;
  ws.enVie = true;
  ws.on('pong', () => { ws.enVie = true; });

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
      const nomPropre = (msg.nom || '').trim();
      if (!nomPropre) return;
      const nomExistant = salle.joueurs.find((j) => j.toLowerCase() === nomPropre.toLowerCase());
      if (nomExistant) {
        // Un nom déjà dans la liste : soit c'est le même téléphone qui se
        // reconnecte (Wi-Fi coupé, page rechargée), soit un autre appareil
        // essaie de piquer le même prénom — dans ce cas seulement, refus.
        const dejaConnecte = salle.joueursConnectes.get(nomExistant);
        if (dejaConnecte && dejaConnecte !== ws && dejaConnecte.readyState === dejaConnecte.OPEN) {
          envoyer(ws, { type: 'join-error', message: `« ${nomPropre} » est déjà pris par un autre téléphone connecté.` });
          return;
        }
        ws.role = 'player';
        ws.code = msg.code;
        ws.nom = nomExistant;
        salle.joueursConnectes.set(nomExistant, ws);
        envoyer(ws, { type: 'joined', nom: nomExistant, index: salle.joueurs.indexOf(nomExistant) });
        diffuserListeJoueurs(salle);
        return;
      }
      // Nouveau prénom : le téléphone s'ajoute tout seul à la liste des
      // joueurs de la soirée — c'est le principe même du lobby (voir
      // PlayerSetup.jsx côté hôte), pas besoin qu'un nom soit déjà tapé
      // sur l'écran principal.
      salle.joueurs.push(nomPropre);
      ws.role = 'player';
      ws.code = msg.code;
      ws.nom = nomPropre;
      salle.joueursConnectes.set(nomPropre, ws);
      envoyer(ws, { type: 'joined', nom: nomPropre, index: salle.joueurs.indexOf(nomPropre) });
      diffuserListeJoueurs(salle);
      envoyer(salle.host, { type: 'joueurs-sync', joueurs: salle.joueurs });
      return;
    }

    if (msg.type === 'vote-start' && ws.role === 'host') {
      const salle = obtenirSalle(ws.code);
      for (const joueurWs of salle.joueursConnectes.values()) {
        envoyer(joueurWs, { type: 'vote-start', question: msg.question, options: msg.options });
      }
      return;
    }

    if ((msg.type === 'contexte' || msg.type === 'scores') && ws.role === 'host') {
      const salle = obtenirSalle(ws.code);
      for (const joueurWs of salle.joueursConnectes.values()) {
        envoyer(joueurWs, msg);
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

    // Relais générique pour les 20 mini-jeux "manette" (buzzer, mash,
    // QCM, séquence, dessin...) : le serveur ne connaît jamais la forme
    // de `payload`, toute la logique de jeu reste côté React (host et
    // téléphone). Un seul couple de messages sert pour tous les jeux.
    if (msg.type === 'action' && ws.role === 'player') {
      const salle = salles.get(ws.code);
      if (!salle) return;
      envoyer(salle.host, { type: 'action', nom: ws.nom, payload: msg.payload });
      return;
    }

    if (msg.type === 'action-broadcast' && ws.role === 'host') {
      const salle = obtenirSalle(ws.code);
      for (const joueurWs of salle.joueursConnectes.values()) {
        envoyer(joueurWs, { type: 'action-broadcast', payload: msg.payload });
      }
      return;
    }

    // Variante "privée" : chaque téléphone reçoit un payload différent
    // (ex. rôle secret du Traître) — le serveur route juste par prénom,
    // sans jamais regarder ce qu'il y a dedans.
    if (msg.type === 'action-broadcast-prive' && ws.role === 'host') {
      const salle = obtenirSalle(ws.code);
      Object.entries(msg.parJoueur || {}).forEach(([nom, payload]) => {
        const joueurWs = salle.joueursConnectes.get(nom);
        if (joueurWs) envoyer(joueurWs, { type: 'action-broadcast', payload });
      });
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
