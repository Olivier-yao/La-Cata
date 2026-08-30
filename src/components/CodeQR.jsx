import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

// CodeQR — génère un QR code local (aucun service externe) pointant vers
// l'écran manette avec le code de la soirée déjà rempli, pour que les
// joueurs n'aient qu'à scanner et taper leur prénom.

export default function CodeQR({ url, taille = 160 }) {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    let annule = false;
    QRCode.toDataURL(url, { width: taille * 2, margin: 1, color: { dark: '#120C1B', light: '#F6ECFF' } })
      .then((data) => !annule && setSrc(data))
      .catch(() => {});
    return () => { annule = true; };
  }, [url, taille]);

  if (!src) {
    return <div style={{ width: taille, height: taille, background: 'var(--bg-panel-raised)', borderRadius: 16 }} />;
  }

  return <img src={src} alt="QR code pour rejoindre" width={taille} height={taille} style={{ borderRadius: 16, border: '3px solid var(--outline)' }} />;
}
