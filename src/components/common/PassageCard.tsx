import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Passage } from '../../types';
import { getIcon } from '../../utils/helpers';

type PassageCardProps = {
  passage: Passage;
  index: number;
  isActive: boolean;
  onClick: () => void;
  progress?: {
    done: number;
    total: number;
  };
};

export const PassageCard: React.FC<PassageCardProps> = ({
  passage,
  index,
  isActive,
  onClick,
  progress,
}) => {
  const done = progress?.done || 0;
  const total = progress?.total || 0;

  return (
    <button onClick={onClick} className={`passage-card ${isActive ? 'active' : ''}`}>
      <div
        className="passage-card-icon"
        style={{
          background: `linear-gradient(135deg, ${passage.color}33, ${passage.color}11)`,
          borderColor: `${passage.color}55`,
        }}
      >
        {getIcon(passage.iconName, 'w-5 h-5')}
      </div>

      <div className="passage-card-text">
        <span className="passage-num">Passage {index + 1}</span>
        <span className="passage-title">{passage.titleBn}</span>

        {total > 0 && (
          <div className="passage-mini-bar">
            <div
              className="passage-mini-fill"
              style={{ width: `${(done / total) * 100}%`, background: passage.color }}
            />
          </div>
        )}
      </div>

      {done === total && total > 0 && <span className="passage-done">🏆</span>}
      <ChevronRight size={14} className="passage-arrow" />
    </button>
  );
};
