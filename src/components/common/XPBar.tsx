import React from 'react';
import { Zap } from 'lucide-react';

type XPBarProps = {
  xp: number;
  maxXp: number;
  level: number;
};

export const XPBar: React.FC<XPBarProps> = ({ xp, maxXp, level }) => {
  const pct = Math.min(100, (xp / maxXp) * 100);

  return (
    <div className="xp-bar-wrapper">
      <div className="xp-bar-info">
        <span className="xp-level">
          <Zap size={13} /> Level {level}
        </span>
        <span className="xp-count">
          {xp} / {maxXp} XP
        </span>
      </div>
      <div className="xp-track">
        <div className="xp-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};
