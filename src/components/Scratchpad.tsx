import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Image, Send, LayoutList, ChevronDown, Hash, X } from 'lucide-react';
import Fuse from 'fuse.js';
import { formatDistanceToNow } from 'date-fns';

type Note = {
  id: number;
  text: string;
  time: string;
  tags?: string[];
};

const DUMMY_ALL_TAGS = [
  'idea',
  'todo',
  'meeting',
  'grocery',
  'work',
  'project',
  'urgent',
  'someday',
  'finance',
  'health',
  'fitness',
  'travel',
  'recipes',
];

const shortTimeAgo = (isoString: string) => {
  const dist = formatDistanceToNow(new Date(isoString));
  if (dist === 'less than a minute') return 'Just now';
  return (
    dist
      .replace('about ', '')
      .replace(' hours', 'h')
      .replace(' hour', 'h')
      .replace(' minutes', 'm')
      .replace(' minute', 'm')
      .replace(' days', 'd')
      .replace(' day', 'd')
      .replace(' months', 'mo')
      .replace(' month', 'mo') + ' ago'
  );
};

export const Scratchpad: React.FC = () => {
  const [text, setText] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>(DUMMY_ALL_TAGS);
  const [replyingToNote, setReplyingToNote] = useState<Note | null>(null);
  const [isRecentsOpen, setIsRecentsOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const fuse = useMemo(() => new Fuse(allTags, { threshold: 0.3 }), [allTags]);

  const suggestedTags = tagsInput.trim()
    ? fuse
        .search(tagsInput)
        .map((result) => result.item)
        .filter((t) => !tags.includes(t))
        .slice(0, 5)
    : [];

  // Auto-focus on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleAddImage = () => {
    // Inject standard markdown image link
    const imageMarkdown = '![Image](https://via.placeholder.com/150)\n';
    setText((prev) => prev + imageMarkdown);
    textareaRef.current?.focus();
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagsInput.trim().replace(/^,|,$/g, '');
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
      }
      setTagsInput('');
    } else if (e.key === 'Backspace' && tagsInput === '' && tags.length > 0) {
      // Remove last tag
      setTags(tags.slice(0, -1));
    }
  };

  const handleSubmit = () => {
    if (!text.trim() && tags.length === 0) return;

    // In a real app, send text and tags to Supabase here
    console.log('Submitting:', {
      text,
      tags,
      timestamp: new Date(),
      parent_id: replyingToNote ? replyingToNote.id : null,
    });

    // Optimistic Tag Adding: Save any newly added tags to our global fuzzy pool
    const newGlobalTags = tags.filter((t) => !allTags.includes(t));
    if (newGlobalTags.length > 0) {
      setAllTags([...allTags, ...newGlobalTags]);
    }

    // Clear the scratching pad instantly
    setText('');
    setTags([]);
    setTagsInput('');
    setReplyingToNote(null);
    textareaRef.current?.focus();
  };

  const recents: Note[] = [
    {
      id: 1,
      text: 'Idea for the new mobile MVP:\nFocus heavily on dark mode because users prefer it at night. This might require updating our entire component library to support Tailwind dark variant, but the tradeoff is worth it for retention.\n\nAlso need to hire a designer for the new settings panel.',
      time: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      tags: ['idea', 'project', 'urgent', 'someday', 'finance'],
    },
    {
      id: 2,
      text: 'Grocery list:\n- Milk\n- Eggs\n- Bread\n- Apples\n- Peanut Butter',
      time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      tags: ['grocery', 'recipes'],
    },
    {
      id: 3,
      text: 'Meeting notes:\nSupabase integration handles the auth beautifully. The RLS policies took some time to wrap my head around, but having the database secured at the row level without middle-tier logic is amazing.',
      time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      tags: ['meeting', 'work', 'project'],
    },
  ];

  const handleReplyTo = (note: Note) => {
    let activeTags = [...tags];

    // If we are switching targets, remove the old inherited tags first
    if (replyingToNote?.tags) {
      activeTags = activeTags.filter((t) => !replyingToNote.tags!.includes(t));
    }

    setReplyingToNote(note);

    if (note.tags) {
      // Merge newly inherited tags
      const inherited = note.tags.filter((t) => !activeTags.includes(t));
      activeTags = [...activeTags, ...inherited];
    }

    setTags(activeTags);
    setIsRecentsOpen(false);
    textareaRef.current?.focus();
  };

  const handleCancelReply = () => {
    if (replyingToNote?.tags) {
      const inherited = replyingToNote.tags;
      setTags((prev) => prev.filter((t) => !inherited.includes(t)));
    }
    setReplyingToNote(null);
  };

  return (
    <div className="relative h-full w-full flex-1 flex-col">
      {/* Top Header */}
      <div className="header-bar">
        <button
          className="btn-icon text-secondary"
          onClick={() => setIsRecentsOpen(true)}
        >
          <LayoutList size={22} />
        </button>
        <span
          className="text-secondary text-sm"
          style={{ flex: 1, textAlign: 'center' }}
        >
          {new Date().toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
        <button className="btn-icon" onClick={handleAddImage} title="Add Image">
          <Image size={22} />
        </button>
      </div>

      {/* Threading Context (Appending To) */}
      {replyingToNote && (
        <div
          style={{
            margin: '16px 16px 0 16px',
            padding: '12px',
            background: 'var(--panel-bg)',
            borderRadius: '8px',
            border: '1px solid var(--divider)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            maxHeight: '45%',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              flex: 1,
              opacity: 0.9,
              fontSize: '1rem',
              lineHeight: '1.4',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '100%',
            }}
          >
            <span
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                marginBottom: '8px',
                flexShrink: 0,
              }}
            >
              Appending To
            </span>
            <div
              style={{
                overflowY: 'auto',
                paddingRight: '8px',
                paddingBottom: '4px',
                whiteSpace: 'pre-wrap',
              }}
            >
              {replyingToNote.text}
            </div>
          </div>
          <button
            className="btn-icon"
            onClick={handleCancelReply}
            style={{ padding: '4px', marginLeft: '8px', flexShrink: 0 }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main Typing Area */}
      <textarea
        id="text-input"
        name="text"
        autoComplete="on"
        autoCorrect="on"
        autoCapitalize="on"
        spellCheck={true}
        ref={textareaRef}
        className="scratchpad-input"
        placeholder="Type a note..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {/* Tag Input Area */}
      <div className="tag-container relative" style={{ flexWrap: 'wrap' }}>
        {/* Suggestion Bar */}
        {suggestedTags.length > 0 && (
          <div className="tag-suggestions-bar">
            {suggestedTags.map((t) => (
              <button
                key={t}
                className="suggestion-pill"
                onClick={() => {
                  setTags([...tags, t]);
                  setTagsInput('');
                  textareaRef.current?.focus();
                }}
              >
                #{t}
              </button>
            ))}
          </div>
        )}

        <Hash size={18} className="text-secondary" />
        {tags.map((tag) => (
          <span key={tag} className="tag-pill">
            {tag}
          </span>
        ))}
        <div
          style={{
            display: 'flex',
            flex: 1,
            minWidth: '140px',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <input
            id="tag-input"
            name="tags"
            autoComplete="off"
            type="text"
            className="tag-input"
            placeholder={tags.length === 0 ? 'Add tags... (Press Enter)' : ''}
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            style={{ flex: 1, minWidth: '50px' }}
          />
          <button
            className="btn-icon"
            onClick={handleSubmit}
            disabled={!text.trim()}
            style={{
              background: text.trim() ? 'var(--accent)' : 'transparent',
              color: text.trim() ? 'var(--app-bg)' : 'var(--text-secondary)',
              width: '32px',
              height: '32px',
              padding: 0,
              flexShrink: 0,
            }}
          >
            <Send
              size={16}
              strokeWidth={2.5}
              style={{ marginRight: '2px', marginTop: '2px' }}
            />
          </button>
        </div>
      </div>

      {/* Slide-up Recents Panel (7-Day Buffer) */}
      <div className={`recents-panel ${isRecentsOpen ? 'open' : ''}`}>
        <div className="recents-header">
          <div style={{ width: 24 }}></div> {/* Spacer */}
          <h2 className="text-base font-semibold">Recent Notes</h2>
          <button className="btn-icon" onClick={() => setIsRecentsOpen(false)}>
            <ChevronDown size={24} />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {recents.map((item) => (
            <div
              key={item.id}
              className="recent-item"
              onClick={() => handleReplyTo(item)}
              style={{ cursor: 'pointer' }}
            >
              <div
                className="recent-item-title flex items-center justify-between"
                style={{ gap: '8px' }}
              >
                <span
                  style={{
                    flex: 1,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {item.text.split('\n')[0]}
                </span>
                {item.tags && item.tags.length > 0 && (
                  <span
                    className="text-secondary hide-scrollbar text-xs"
                    style={{
                      fontWeight: 'normal',
                      display: 'flex',
                      gap: '4px',
                      alignItems: 'center',
                      maxWidth: '33%',
                      overflowX: 'auto',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.tags.map((t) => (
                      <span
                        key={t}
                        style={{
                          background: 'var(--app-bg)',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          flexShrink: 0,
                        }}
                      >
                        #{t}
                      </span>
                    ))}
                  </span>
                )}
              </div>
              <div
                className="mt-1 flex items-center justify-between"
                style={{ gap: '24px' }}
              >
                <span className="recent-item-preview flex-1">{item.text}</span>
                <span
                  className="text-secondary text-xs"
                  style={{
                    whiteSpace: 'nowrap',
                    opacity: 0.6,
                    fontWeight: 500,
                    letterSpacing: '0.5px',
                  }}
                >
                  {shortTimeAgo(item.time)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
