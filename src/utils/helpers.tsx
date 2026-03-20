import React from 'react';
import {
  Smile,
  BookOpen,
  Trees,
  Wand2,
  Tent,
  LucideIcon,
} from 'lucide-react';
import { IconName, InfinitiveInfo } from '../types';
import { InfinitiveChip } from '../components/common/InfinitiveChip';

const ICON_MAP: Record<IconName, LucideIcon> = {
  Smile,
  BookOpen,
  Trees,
  Wand2,
  Tent,
};

export const getIcon = (name: IconName, cls?: string) => {
  const I = ICON_MAP[name] || BookOpen;
  return <I className={cls} />;
};

export const parseText = (
  rawText: string,
  infinitiveData: InfinitiveInfo[],
  onWordClick?: (idx: number) => void,
  revealedWords?: Set<number>,
  xpWords?: Set<number>
): React.ReactNode => {
  if (!rawText) return null;

  const parts = rawText.split(/\[(.*?)\]/g);

  return parts.map((part, i) => {
    if (i % 2 === 0) return <span key={i}>{part}</span>;

    const idx = Math.floor(i / 2);
    const data = infinitiveData[idx] || { meaning: '', desc: '' };
    const isRevealed = revealedWords?.has(idx);
    const hasXP = xpWords?.has(idx);

    return (
      <InfinitiveChip
        key={i}
        word={part}
        meaning={data.meaning}
        desc={data.desc}
        idx={idx}
        onWordClick={onWordClick}
        isRevealed={isRevealed}
        hasXP={hasXP}
      />
    );
  });
};
