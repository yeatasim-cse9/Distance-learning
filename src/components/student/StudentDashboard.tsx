import React, { useState } from 'react';
import {
  BookOpen,
  GraduationCap,
  Trophy,
  Sparkles,
  Target,
  Brain,
  ChevronLeft,
  ChevronRight,
  Zap
} from 'lucide-react';
import { Passage, RevealedMap, FloatingXPState } from '../../types';
import { XPBar } from '../common/XPBar';
import { StreakBadge } from '../common/StreakBadge';
import { PassageCard } from '../common/PassageCard';
import { getIcon, parseText } from '../../utils/helpers';

type StudentDashboardProps = {
  passages: Passage[];
};

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ passages }) => {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [xp, setXP] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [revealedMap, setRevealedMap] = useState<RevealedMap>({});
  const [xpFlash, setXpFlash] = useState<RevealedMap>({});
  const [floatingXP, setFloatingXP] = useState<FloatingXPState>(null);
  const [celebrate, setCelebrate] = useState<boolean>(false);

  const passage = passages[activeIdx];
  const totalWords = passage?.rawText.match(/\[.*?\]/g)?.length || 0;
  const revealedSet = revealedMap[passage?.id] || new Set<number>();
  const xpFlashSet = xpFlash[passage?.id] || new Set<number>();
  const maxXp = passages.reduce(
    (s, p) => s + (p.rawText.match(/\[.*?\]/g)?.length || 0) * 10,
    0
  );
  const level = Math.floor(xp / 100) + 1;

  const handleWordClick = (idx: number) => {
    const key = passage.id;
    const prev = revealedMap[key] || new Set<number>();
    if (prev.has(idx)) return;

    const next = new Set(prev);
    next.add(idx);

    setRevealedMap((r) => ({ ...r, [key]: next }));
    setXP((x) => x + 10);
    setStreak((s) => s + 1);

    const flashSet = new Set(xpFlashSet);
    flashSet.add(idx);
    setXpFlash((f) => ({ ...f, [key]: flashSet }));

    setFloatingXP({ id: Date.now(), x: 50, y: 50 });
    setTimeout(() => setFloatingXP(null), 900);

    if (next.size === totalWords) {
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 2200);
    }
  };

  const progressMap: Record<number, { done: number; total: number }> = {};
  passages.forEach((p) => {
    const total = p.rawText.match(/\[.*?\]/g)?.length || 0;
    const done = (revealedMap[p.id] || new Set<number>()).size;
    progressMap[p.id] = { done, total };
  });

  return (
    <div className="student-root">
      {floatingXP && <div className="floating-xp" key={floatingXP.id}>+10 XP ⚡</div>}

      {celebrate && (
        <div className="celebrate-overlay">
          <div className="celebrate-box">
            <Trophy size={48} style={{ color: '#FFD700' }} />
            <h2>দারুণ! সব Infinitive খুঁজে পেয়েছ! 🎉</h2>
            <p>এই প্যাসেজ সম্পূর্ণ!</p>
          </div>

          <div className="confetti-wrap">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="confetti-dot"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  background: ['#FF6B9D', '#4F9EFF', '#2DD4A0', '#A855F7', '#FFD700'][i % 5],
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="stats-bar">
        <div className="stats-left">
          <GraduationCap size={20} className="brand-icon" />
          <span className="brand-name">দূর-শিক্ষণ</span>
        </div>

        <div className="stats-center">
          <XPBar xp={xp} maxXp={maxXp || 500} level={level} />
        </div>

        <div className="stats-right">
          <StreakBadge streak={streak} />
          {(() => {
            const count = Object.values(progressMap).filter(
              (p) => p.done === p.total && p.total > 0
            ).length;
            return (
              <div className={`trophy-count ${count > 0 ? 'active' : ''}`}>
                <Trophy size={15} className="trophy-icon" />
                <span>{count}</span>
              </div>
            );
          })()}
        </div>
      </div>

      <div className="student-body">
        <aside className="student-sidebar">
          <div className="sidebar-header">
            <BookOpen size={16} />
            <span>গল্পগুলো</span>
          </div>

          {passages.map((p, i) => (
            <PassageCard
              key={p.id}
              passage={p}
              index={i}
              isActive={i === activeIdx}
              onClick={() => setActiveIdx(i)}
              progress={progressMap[p.id]}
            />
          ))}

          <div className="tip-box">
            <div className="tip-header">
              <Sparkles size={13} /> টিপস
            </div>
            <p>
              রঙিন শব্দগুলোতে ক্লিক করো। প্রতিটি Infinitive খুঁজে পেলে <strong>+10 XP</strong>{' '}
              পাবে!
            </p>
          </div>
        </aside>

        <main className="student-main">
          <div
            className="passage-header"
            style={{
              background: `linear-gradient(135deg, ${passage.color}22, ${passage.color}08)`,
              borderColor: `${passage.color}44`,
            }}
          >
            <div className="passage-header-icon" style={{ background: passage.color }}>
              {getIcon(passage.iconName, 'w-6 h-6 text-white')}
            </div>

            <div>
              <h2 className="passage-main-title">{passage.title}</h2>
              <p className="passage-main-subtitle">{passage.titleBn}</p>
            </div>

            <div
              className="passage-score-pill"
              style={{ borderColor: passage.color, color: passage.color }}
            >
              <Target size={13} />
              {revealedSet.size} / {totalWords}
            </div>
          </div>

          <div className="grammar-pill">
            <Brain size={14} />
            <span>
              <strong>Infinitive = to + verb</strong> &nbsp;|&nbsp; রঙিন শব্দে ক্লিক করো →
              অর্থ ও ব্যাখ্যা দেখো → XP অর্জন করো!
            </span>
          </div>

          <div className="story-box">
            <div className="story-text">
              {parseText(
                passage.rawText,
                passage.infinitiveData,
                handleWordClick,
                revealedSet,
                xpFlashSet
              )}
            </div>
          </div>

          <div className="word-grid-section">
            <div className="word-grid-header">
              <Zap size={14} />
              <span>
                Infinitive Progress — {revealedSet.size}/{totalWords} খোলা হয়েছে
              </span>
            </div>

            <div className="word-grid">
              {(passage.rawText.match(/\[.*?\]/g) || []).map((m, i) => {
                const word = m.replace(/[\[\]]/g, '');
                const revealed = revealedSet.has(i);

                return (
                  <div
                    key={i}
                    className={`word-grid-item ${revealed ? 'found' : ''}`}
                    style={{
                      borderColor: revealed ? passage.color : undefined,
                      color: revealed ? passage.color : undefined,
                    }}
                  >
                    {revealed ? word : '???'}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="nav-btns">
            <button
              className="nav-btn"
              onClick={() => setActiveIdx((i) => Math.max(0, i - 1))}
              disabled={activeIdx === 0}
            >
              <ChevronLeft size={16} /> আগের গল্প
            </button>

            <button
              className="nav-btn primary"
              onClick={() => setActiveIdx((i) => Math.min(passages.length - 1, i + 1))}
              disabled={activeIdx === passages.length - 1}
            >
              পরের গল্প <ChevronRight size={16} />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};
