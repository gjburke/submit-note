import React, { useState, useRef, useEffect } from 'react';
import { Image, Send, LayoutList, ChevronDown, Hash } from 'lucide-react';

export const Scratchpad: React.FC<{
  onLogout: () => void;
}> = ({ onLogout }) => {
  const [text, setText] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isRecentsOpen, setIsRecentsOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    console.log('Submitting:', { text, tags, timestamp: new Date() });
    
    // Clear the scratching pad instantly
    setText('');
    setTags([]);
    setTagsInput('');
    textareaRef.current?.focus();
  };

  const recents = [
    { id: 1, text: "Idea for the new mobile MVP: Focus heavily on dark mode.", time: "10m ago" },
    { id: 2, text: "Grocery list: Milk, Eggs, Bread", time: "2h ago" },
    { id: 3, text: "Meeting notes: Supabase integration handles the auth beautifully.", time: "Yesterday" }
  ];

  return (
    <div className="flex-1 flex-col relative w-full h-full">
      {/* Top Header */}
      <div className="header-bar">
        <button className="btn-icon text-secondary" onClick={() => setIsRecentsOpen(true)}>
          <LayoutList size={22} />
        </button>
        <span className="text-secondary text-sm" style={{flex: 1, textAlign: 'center'}}>
          {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        <button className="btn-icon" onClick={handleAddImage} title="Add Image">
          <Image size={22} />
        </button>
      </div>

      {/* Main Typing Area */}
      <textarea
        ref={textareaRef}
        className="scratchpad-input"
        placeholder="Type a note..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {/* Tag Input Area */}
      <div className="tag-container" style={{ flexWrap: 'wrap' }}>
        <Hash size={18} className="text-secondary" />
        {tags.map((tag) => (
          <span key={tag} className="tag-pill">
            {tag}
          </span>
        ))}
        <input
          type="text"
          className="tag-input"
          placeholder={tags.length === 0 ? "Add tags... (Press Enter)" : ""}
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
          style={{ flex: 1, minWidth: '100px' }}
        />
        <button 
          className="btn-icon" 
          onClick={handleSubmit}
          disabled={!text.trim() && tags.length === 0}
          style={{ background: text.trim() || tags.length > 0 ? 'var(--accent)' : 'transparent', color: text.trim() || tags.length > 0 ? 'var(--app-bg)' : 'var(--text-secondary)' }}
        >
          <Send size={18} />
        </button>
      </div>

      {/* Slide-up Recents Panel (7-Day Buffer) */}
      <div className={`recents-panel ${isRecentsOpen ? 'open' : ''}`}>
        <div className="recents-header">
          <div style={{width: 24}}></div> {/* Spacer */}
          <h2 className="text-base font-semibold">Recent Notes</h2>
          <button className="btn-icon" onClick={() => setIsRecentsOpen(false)}>
            <ChevronDown size={24} />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {recents.map((item) => (
            <div key={item.id} className="recent-item">
              <div className="recent-item-title">{item.text.split('\n')[0]}</div>
              <div className="flex justify-between items-center mt-1">
                <span className="recent-item-preview flex-1">{item.text}</span>
                <span className="text-xs text-secondary ml-2">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
