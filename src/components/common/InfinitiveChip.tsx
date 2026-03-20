import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

type InfinitiveChipProps = {
  word: string;
  meaning: string;
  desc: string;
  idx: number;
  onWordClick?: (idx: number) => void;
  isRevealed?: boolean;
  hasXP?: boolean;
};

export const InfinitiveChip: React.FC<InfinitiveChipProps> = ({
  word,
  meaning,
  desc,
  idx,
  onWordClick,
  isRevealed,
  hasXP,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    if (!isRevealed && onWordClick) onWordClick(idx);
    setOpen((o) => !o);
  };

  return (
    <span className="inf-chip-wrapper" ref={ref} style={{ position: 'relative' }}>
      <span
        onClick={handleClick}
        className={`inf-chip ${isRevealed ? 'revealed' : ''} ${hasXP ? 'xp-flash' : ''}`}
      >
        {word}
        {isRevealed && <span className="chip-badge">✓</span>}
      </span>

      {open && (
        <span className="inf-popup animate-pop">
          <span
            className="popup-close"
            onClick={(e: React.MouseEvent<HTMLSpanElement>) => {
              e.stopPropagation();
              setOpen(false);
            }}
          >
            <X size={12} />
          </span>
          <span className="popup-word">{word}</span>
          <span className="popup-meaning">
            অর্থ: <strong>{meaning || '—'}</strong>
          </span>
          <span className="popup-desc">{desc || '—'}</span>
          {!isRevealed && <span className="popup-xp">+10 XP অর্জন!</span>}
        </span>
      )}
    </span>
  );
};
