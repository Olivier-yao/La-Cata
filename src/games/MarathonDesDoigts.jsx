import React from 'react';
import RoundHeader from '../components/RoundHeader.jsx';
import CourseDoigtsHost from '../manette/CourseDoigtsHost.jsx';
import { IconCorde } from '../components/icons.jsx';

export default function MarathonDesDoigts({ manche, remote, onTermine }) {
  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column' }}>
      <RoundHeader icone={<IconCorde color="var(--outline)" />} iconBg="var(--accent-lime)" titre="Marathon des Doigts" sousTitre={`Manche ${manche}`} couleurTitre="var(--accent-lime)" />
      <CourseDoigtsHost remote={remote} onTermine={(scores) => onTermine({ scores })} />
    </div>
  );
}
