// remote.js — connexion WebSocket au petit serveur local "manette
// téléphone" (voir server/remote-server.mjs). Ni compte ni service
// externe : le téléphone et le PC doivent juste être sur le même Wi-Fi.

const PORT_REMOTE = 5185;

export function urlServeurRemote() {
  return `ws://${window.location.hostname}:${PORT_REMOTE}`;
}

const LETTRES_CODE = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sans 0/O/1/I ambigus

export function genererCodeSalle() {
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += LETTRES_CODE[Math.floor(Math.random() * LETTRES_CODE.length)];
  }
  return code;
}

// Petit wrapper au-dessus de WebSocket : reconnexion simple, callbacks par
// type de message, file d'attente tant que la connexion n'est pas ouverte.
export function creerConnexionRemote({ onOuverte, onFermee } = {}) {
  let socket = null;
  let fermeeVolontairement = false;
  const gestionnaires = new Map();
  const fileAttente = [];

  function connecter() {
    socket = new WebSocket(urlServeurRemote());
    socket.onopen = () => {
      fileAttente.forEach((m) => socket.send(JSON.stringify(m)));
      fileAttente.length = 0;
      onOuverte && onOuverte();
    };
    socket.onclose = () => {
      onFermee && onFermee();
      if (!fermeeVolontairement) {
        setTimeout(connecter, 1500);
      }
    };
    socket.onerror = () => {
      socket.close();
    };
    socket.onmessage = (event) => {
      let msg;
      try {
        msg = JSON.parse(event.data);
      } catch {
        return;
      }
      const liste = gestionnaires.get(msg.type);
      if (liste) liste.forEach((fn) => fn(msg));
    };
  }

  connecter();

  return {
    envoyer(message) {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
      } else {
        fileAttente.push(message);
      }
    },
    sur(type, fn) {
      if (!gestionnaires.has(type)) gestionnaires.set(type, []);
      gestionnaires.get(type).push(fn);
      return () => {
        const liste = gestionnaires.get(type);
        const i = liste.indexOf(fn);
        if (i >= 0) liste.splice(i, 1);
      };
    },
    fermer() {
      fermeeVolontairement = true;
      socket && socket.close();
    },
  };
}
