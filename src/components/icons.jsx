import React from 'react';

// icons.jsx — pictogrammes des mini-jeux, repris du kit de design
// (grille 32, trait 3,4px). `color` définit le trait/remplissage.

const base = { width: 26, height: 26, viewBox: '0 0 32 32', fill: 'none' };

export function IconVirelangue({ color = '#241B2F', size = 26 }) {
  return (
    <svg {...base} width={size} height={size}>
      <path d="M4 9h20M4 16h14M4 23h22" stroke={color} strokeWidth="4" strokeLinecap="round" />
      <path d="M25 12l4 4-4 4" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconAccent({ color = '#241B2F', size = 26 }) {
  return (
    <svg {...base} width={size} height={size}>
      <path d="M5 7h22v15H15l-7 5v-5H5z" stroke={color} strokeWidth="3.4" strokeLinejoin="round" />
      <path d="M12 14h.01M16 14h.01M20 14h.01" stroke={color} strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export function IconSansRire({ color = '#241B2F', size = 26 }) {
  return (
    <svg {...base} width={size} height={size}>
      <circle cx="16" cy="16" r="12" stroke={color} strokeWidth="3.4" />
      <path d="M11 21h10" stroke={color} strokeWidth="3.4" strokeLinecap="round" />
      <path d="M11 12l2.5 2.5M13.5 12L11 14.5M18.5 12l2.5 2.5M21 12l-2.5 2.5" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function IconChrono({ color = '#241B2F', size = 26 }) {
  return (
    <svg {...base} width={size} height={size}>
      <circle cx="16" cy="18" r="11" stroke={color} strokeWidth="3.4" />
      <path d="M16 12v6l4 3" stroke={color} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 3h8" stroke={color} strokeWidth="3.4" strokeLinecap="round" />
    </svg>
  );
}

export function IconDoublage({ color = '#241B2F', size = 26 }) {
  return (
    <svg {...base} width={size} height={size}>
      <rect x="4" y="7" width="24" height="18" rx="3" stroke={color} strokeWidth="3.4" />
      <path d="M13 13l7 4-7 4z" fill={color} />
    </svg>
  );
}

export function IconBruit({ color = '#C8FF4D', size = 26 }) {
  return (
    <svg {...base} width={size} height={size}>
      <path d="M5 16v2M10 11v10M15 6v20M20 11v10M25 15v3" stroke={color} strokeWidth="3.4" strokeLinecap="round" />
    </svg>
  );
}

export function IconChant({ color = '#FFC94D', size = 26 }) {
  return (
    <svg {...base} width={size} height={size}>
      <path d="M13 23V6l12-2v17" stroke={color} strokeWidth="3.4" strokeLinejoin="round" />
      <circle cx="9" cy="23" r="4" stroke={color} strokeWidth="3.4" />
      <circle cx="21" cy="21" r="4" stroke={color} strokeWidth="3.4" />
    </svg>
  );
}

export function IconAveugle({ color = '#4DE8FF', size = 26 }) {
  return (
    <svg {...base} width={size} height={size}>
      <path d="M6 26l1.5-6L21 6.5a3 3 0 014 4L11.5 24z" stroke={color} strokeWidth="3.2" strokeLinejoin="round" />
      <path d="M4 4l24 24" stroke={color} strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  );
}

export function IconMenteur({ color = '#FF4D8D', size = 26 }) {
  return (
    <svg {...base} width={size} height={size}>
      <path d="M5 6h22v15H15l-7 5v-5H5z" stroke={color} strokeWidth="3.2" strokeLinejoin="round" />
      <path d="M11 10l6 6M17 10l-6 6" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <path d="M19 14l2.5 2.5L26 11" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconStatue({ color = '#7C4DFF', size = 26 }) {
  return (
    <svg {...base} width={size} height={size}>
      <circle cx="16" cy="6" r="3.4" stroke={color} strokeWidth="3" />
      <path d="M16 10v9M16 19l-5 8M16 19l5 8M7 13l9 2 9-2" stroke={color} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconConversation({ color = '#FF4D8D', size = 26 }) {
  return (
    <svg {...base} width={size} height={size}>
      <path d="M3 6h16v11H10l-5 4v-4H3z" stroke={color} strokeWidth="3.2" strokeLinejoin="round" />
      <path d="M15 13h14v10h-5v4l-5-4h-4z" stroke={color} strokeWidth="3.2" strokeLinejoin="round" />
    </svg>
  );
}

export function IconMemoire({ color = '#4DE8FF', size = 26 }) {
  return (
    <svg {...base} width={size} height={size}>
      <circle cx="16" cy="16" r="12" stroke={color} strokeWidth="3.2" />
      <path d="M11 13c1-3 9-3 10 0M10 18h12M11 22c1.5 1.5 8.5 1.5 10 0" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

export function IconImprovisation({ color = '#FFC94D', size = 26 }) {
  return (
    <svg {...base} width={size} height={size}>
      <path d="M16 4a8 8 0 00-5 14.2V21h10v-2.8A8 8 0 0016 4z" stroke={color} strokeWidth="3.2" strokeLinejoin="round" />
      <path d="M12 25h8M13 28h6" stroke={color} strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  );
}

export function IconCalcul({ color = '#241B2F', size = 26 }) {
  return (
    <svg {...base} width={size} height={size}>
      <rect x="5" y="5" width="22" height="22" rx="5" stroke={color} strokeWidth="3" />
      <path d="M9.5 13c1.6-2.2 3.2-2.2 4.8 0s3.2 2.2 4.8 0M9.5 20c1.6-2.2 3.2-2.2 4.8 0s3.2 2.2 4.8 0" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

export function IconSondage({ color = '#241B2F', size = 26 }) {
  return (
    <svg {...base} width={size} height={size}>
      <path d="M5 27V13M14 27V6M23 27v-9" stroke={color} strokeWidth="4" strokeLinecap="round" />
      <path d="M4 27h24" stroke={color} strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  );
}

export function IconDetective({ color = '#241B2F', size = 26 }) {
  return (
    <svg {...base} width={size} height={size}>
      <circle cx="13" cy="13" r="8" stroke={color} strokeWidth="3.4" />
      <path d="M19 19l7 7" stroke={color} strokeWidth="3.6" strokeLinecap="round" />
    </svg>
  );
}

export function IconSolo({ color = '#6B5A82', size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="9" r="4.5" stroke={color} strokeWidth="3" />
      <path d="M7 27c0-5 4-8 9-8s9 3 9 8" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function IconGroupe({ color = '#241B2F', size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="11" cy="10" r="4" stroke={color} strokeWidth="3" />
      <circle cx="22" cy="12" r="3.4" stroke={color} strokeWidth="3" />
      <path d="M4 25c0-4 3-6 7-6s7 2 7 6M18 25c0-3 2-5 5-5s5 2 5 5" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function IconDeclaration({ color = '#241B2F', size = 26 }) {
  return (
    <svg {...base} width={size} height={size}>
      <path d="M5 6h22v15H15l-7 5v-5H5z" stroke={color} strokeWidth="3.2" strokeLinejoin="round" />
      <path d="M16 11v5" stroke={color} strokeWidth="3.4" strokeLinecap="round" />
      <circle cx="16" cy="19.5" r="0.4" stroke={color} strokeWidth="3.4" strokeLinecap="round" />
    </svg>
  );
}

export function IconClavier({ color = '#241B2F', size = 26 }) {
  return (
    <svg {...base} width={size} height={size}>
      <rect x="4" y="8" width="24" height="16" rx="3" stroke={color} strokeWidth="3" />
      <path d="M8 13h.01M13 13h.01M18 13h.01M23 13h.01M8 18h12M22 18h2" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function IconCadenas({ color = '#C8FF4D', size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect x="7" y="14" width="18" height="13" rx="3" stroke={color} strokeWidth="3.4" />
      <path d="M11 14v-4a5 5 0 0110 0v4" stroke={color} strokeWidth="3.4" />
    </svg>
  );
}
