import React from 'react';
import { Flame } from 'lucide-react';

type StreakBadgeProps = {
  streak: number;
};

export const StreakBadge: React.FC<StreakBadgeProps> = ({ streak }) => (
  <div className={`streak-badge ${streak > 0 ? 'active' : ''}`}>
    <Flame size={16} className="streak-icon" />
    <span>{streak}</span>
  </div>
);
