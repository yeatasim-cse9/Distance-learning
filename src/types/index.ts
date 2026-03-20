import { LucideIcon } from 'lucide-react';

export type InfinitiveInfo = {
  meaning: string;
  desc: string;
};

export type IconName = 'Smile' | 'BookOpen' | 'Trees' | 'Wand2' | 'Tent';

export type Passage = {
  id: number;
  title: string;
  titleBn: string;
  iconName: IconName;
  color: string;
  bg: string;
  rawText: string;
  infinitiveData: InfinitiveInfo[];
};

export type ToastType = 'success' | 'error';
export type ThemeMode = 'dark' | 'light';
export type ViewMode = 'student' | 'teacher';

export type ToastState = {
  show: boolean;
  msg: string;
  type: ToastType;
};

export type SelectionState = {
  start: number;
  end: number;
  text: string;
} | null;

export type FloatingXPState = {
  id: number;
  x: number;
  y: number;
} | null;

export type RevealedMap = Record<number, Set<number>>;
