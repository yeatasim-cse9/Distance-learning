import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Save,
  Settings,
  Edit3,
  MousePointer2,
  Highlighter,
  AlertCircle,
  Star,
  Eye,
} from 'lucide-react';
import { Passage, ToastType, SelectionState, InfinitiveInfo } from '../../types';
import { parseText } from '../../utils/helpers';

type TeacherDashboardProps = {
  passages: Passage[];
  setPassages: React.Dispatch<React.SetStateAction<Passage[]>>;
  showToast: (msg: string, type?: ToastType) => void;
};

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  passages,
  setPassages,
  showToast,
}) => {
  const [editingId, setEditingId] = useState<number | undefined>(passages[0]?.id);
  const [selection, setSelection] = useState<SelectionState>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const current = passages.find((p) => p.id === editingId) || passages[0];

  const updateField = <K extends keyof Passage>(field: K, val: Passage[K]) => {
    setPassages((ps) =>
      ps.map((p) => (p.id === editingId ? { ...p, [field]: val } : p))
    );
  };

  const updatePassageText = (newText: string) => {
    const matches = [...newText.matchAll(/\[(.*?)\]/g)];
    const newData: InfinitiveInfo[] = matches.map(
      (_, i) => current.infinitiveData[i] || { meaning: '', desc: '' }
    );

    setPassages((ps) =>
      ps.map((p) =>
        p.id === editingId
          ? { ...p, rawText: newText, infinitiveData: newData }
          : p
      )
    );
  };

  const updateInfData = (i: number, field: keyof InfinitiveInfo, val: string) => {
    const nd = [...current.infinitiveData];
    nd[i] = { ...nd[i], [field]: val };

    setPassages((ps) =>
      ps.map((p) => (p.id === editingId ? { ...p, infinitiveData: nd } : p))
    );
  };

  const handleSelect = (
    e:
      | React.SyntheticEvent<HTMLTextAreaElement>
      | React.MouseEvent<HTMLTextAreaElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    const ta = e.target as HTMLTextAreaElement;
    if (ta.tagName !== 'TEXTAREA') return;

    const start = ta.selectionStart;
    const end = ta.selectionEnd;

    if (start !== end) {
      setSelection({
        start,
        end,
        text: ta.value.substring(start, end),
      });
    } else {
      setSelection(null);
    }
  };

  const markAsInfinitive = () => {
    if (!selection) return;

    const { start, end } = selection;
    const raw = current.rawText;
    const newText = raw.slice(0, start) + '[' + raw.slice(start, end) + ']' + raw.slice(end);

    updatePassageText(newText);
    setSelection(null);
    showToast('ইনফিনিটিভ যুক্ত হয়েছে! ✨');
  };

  const addPassage = () => {
    const id = Date.now();

    const newPassage: Passage = {
      id,
      title: 'New Passage',
      titleBn: 'নতুন গল্প',
      iconName: 'BookOpen',
      color: '#4F9EFF',
      bg: 'from-blue-500 to-indigo-400',
      rawText: '',
      infinitiveData: [],
    };

    setPassages((ps) => [...ps, newPassage]);
    setEditingId(id);
    showToast('নতুন প্যাসেজ যোগ হয়েছে!');
  };

  const confirmDelete = () => {
    if (deleteId === null) return;

    if (passages.length === 1) {
      showToast('অন্তত একটি প্যাসেজ থাকতে হবে!', 'error');
      return;
    }

    const filtered = passages.filter((p) => p.id !== deleteId);
    setPassages(filtered);

    if (editingId === deleteId) setEditingId(filtered[0]?.id);
    setDeleteId(null);
    showToast('প্যাসেজ মুছে ফেলা হয়েছে!');
  };

  const extracted = [...(current?.rawText.matchAll(/\[(.*?)\]/g) || [])].map((m) => m[1]);

  return (
    <div className="teacher-root">
      {deleteId && (
        <div className="modal-overlay">
          <div className="modal-box">
            <AlertCircle size={36} style={{ color: '#EF4444' }} />
            <h3>প্যাসেজ ডিলিট করবেন?</h3>
            <p>এই পরিবর্তন আর ফেরানো যাবে না।</p>
            <div className="modal-btns">
              <button className="modal-cancel" onClick={() => setDeleteId(null)}>
                বাতিল
              </button>
              <button className="modal-confirm" onClick={confirmDelete}>
                <Trash2 size={14} /> ডিলিট
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="teacher-header">
        <div className="teacher-header-left">
          <Settings size={18} />
          <span>Teacher Panel</span>
        </div>

        <button
          className="save-all-btn"
          onClick={() => showToast('সব পরিবর্তন সেভ হয়েছে! ✅')}
        >
          <Save size={15} /> সেভ করুন
        </button>
      </div>

      <div className="teacher-body">
        <aside className="teacher-sidebar">
          <button className="add-passage-btn" onClick={addPassage}>
            <Plus size={16} /> নতুন প্যাসেজ
          </button>

          <div className="teacher-passage-list">
            {passages.map((p, i) => (
              <div
                key={p.id}
                className={`teacher-passage-item ${editingId === p.id ? 'active' : ''}`}
                onClick={() => setEditingId(p.id)}
              >
                <span className="tp-num">{i + 1}</span>
                <span className="tp-name">{p.titleBn}</span>
                <button
                  className="tp-del"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    setDeleteId(p.id);
                  }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </aside>

        <div className="teacher-editor">
          <div className="editor-card">
            <div className="editor-card-header">
              <Edit3 size={16} /> <span>প্যাসেজ তথ্য</span>
            </div>

            <div className="editor-fields">
              <div className="editor-field">
                <label>ইংরেজি নাম</label>
                <input
                  value={current.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateField('title', e.target.value)
                  }
                  placeholder="Passage title in English"
                />
              </div>

              <div className="editor-field">
                <label>বাংলা নাম</label>
                <input
                  value={current.titleBn}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateField('titleBn', e.target.value)
                  }
                  placeholder="বাংলা শিরোনাম"
                />
              </div>
            </div>
          </div>

          <div className="editor-card">
            <div className="editor-card-header">
              <MousePointer2 size={16} /> <span>Smart Highlighter — মাউস দিয়ে সিলেক্ট করুন</span>
            </div>

            <div className="highlighter-tip">
              <span className="tip-step">১</span> গল্পটি পেস্ট করুন
              <span className="tip-step">২</span> Infinitive সিলেক্ট করুন
              <span className="tip-step">৩</span> <em>"Mark"</em> বাটনে ক্লিক করুন
            </div>

            {selection && (
              <div className="selection-bar animate-pop">
                <span>
                  সিলেক্ট: <strong>"{selection.text}"</strong>
                </span>
                <button className="mark-btn" onClick={markAsInfinitive}>
                  <Highlighter size={13} /> Mark as Infinitive
                </button>
              </div>
            )}

            <textarea
              className="raw-textarea"
              value={current.rawText}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                updatePassageText(e.target.value)
              }
              onSelect={handleSelect}
              onMouseUp={handleSelect}
              onKeyUp={handleSelect}
              placeholder="গল্পটি এখানে পেস্ট করুন..."
            />
          </div>

          <div className="editor-card">
            <div className="editor-card-header">
              <Star size={16} /> <span>Infinitive এর তথ্য ({extracted.length} টি)</span>
            </div>

            {extracted.length === 0 ? (
              <div className="empty-state">ওপরের বক্স থেকে শব্দ সিলেক্ট করুন।</div>
            ) : (
              <div className="inf-data-list">
                <div className="inf-header-row">
                  <span className="inf-num-h">#</span>
                  <span className="inf-badge-h">Infinitive</span>
                  <span className="inf-meaning-h">অর্থ (Meaning)</span>
                  <span className="inf-desc-h">ব্যাখ্যা (Description)</span>
                </div>
                {extracted.map((word, i) => (
                  <div key={i} className="inf-data-row">
                    <span className="inf-num">{i + 1}</span>
                    <span className="inf-word-badge">{word}</span>

                    <input
                      className="inf-input"
                      value={current.infinitiveData[i]?.meaning || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateInfData(i, 'meaning', e.target.value)
                      }
                      placeholder="অর্থ (যেমন: পড়তে)"
                    />

                    <input
                      className="inf-input"
                      value={current.infinitiveData[i]?.desc || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateInfData(i, 'desc', e.target.value)
                      }
                      placeholder="ব্যাখ্যা লিখুন..."
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="editor-card">
            <div className="editor-card-header preview-header">
              <Eye size={16} /> <span>স্টুডেন্ট লাইভ প্রিভিউ</span>
              <span className="live-badge">LIVE</span>
            </div>

            <div className="preview-text">
              {parseText(current.rawText, current.infinitiveData, undefined, new Set(), new Set())}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
