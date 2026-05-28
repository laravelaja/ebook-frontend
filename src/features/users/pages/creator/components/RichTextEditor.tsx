import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import { CustomImage } from './CustomImageExtension';
import { FontSize } from './FontSizeExtension';
import { LineHeight } from './LineHeightExtension';
import { useEffect, useCallback, useRef, useState } from 'react';
import {
  IconBold,
  IconItalic,
  IconUnderline,
  IconStrikethrough,
  IconH1,
  IconH2,
  IconH3,
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
  IconAlignJustified,
  IconList,
  IconListNumbers,
  IconQuote,
  IconSeparator,
  IconPhoto,
  IconArrowBackUp,
  IconArrowForwardUp,
  IconHighlight,
  IconPalette,
  IconLetterCase,
  IconLineHeight,
} from '@tabler/icons-react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  onSave?: () => void;
  placeholder?: string;
}

const FONT_COLORS = [
  // Row 1: basics
  '#000000', '#374151', '#6b7280', '#9ca3af', '#d1d5db', '#ffffff',
  // Row 2: reds & pinks
  '#dc2626', '#ef4444', '#f87171', '#fb7185', '#ec4899', '#db2777',
  // Row 3: oranges & yellows
  '#ea580c', '#f97316', '#fb923c', '#f59e0b', '#eab308', '#facc15',
  // Row 4: greens
  '#16a34a', '#22c55e', '#4ade80', '#10b981', '#14b8a6', '#06b6d4',
  // Row 5: blues & purples
  '#0891b2', '#0ea5e9', '#3b82f6', '#2563eb', '#6366f1', '#7c3aed',
  // Row 6: more purples & special
  '#8b5cf6', '#a855f7', '#c026d3', '#d946ef', '#f43f5e', '#be123c',
];

const HIGHLIGHT_COLORS = [
  // Row 1: light pastels
  '#fef08a', '#fde047', '#bbf7d0', '#86efac', '#bfdbfe', '#93c5fd',
  // Row 2: more pastels
  '#e9d5ff', '#c4b5fd', '#fecdd3', '#fda4af', '#fed7aa', '#fdba74',
  // Row 3: vivid highlights
  '#fef9c3', '#d9f99d', '#ccfbf1', '#a5f3fc', '#dbeafe', '#e0e7ff',
  // Row 4: deeper highlights
  '#fce7f3', '#f3e8ff', '#fff1f2', '#fef3c7', '#ecfccb', 'transparent',
];

const FONT_FAMILIES = [
  { label: 'Default', value: '' },
  { label: 'Serif', value: 'Georgia, serif' },
  { label: 'Mono', value: 'ui-monospace, monospace' },
  { label: 'Sans', value: 'ui-sans-serif, system-ui, sans-serif' },
];

const FONT_SIZES = [
  { label: '8pt', value: '8pt' },
  { label: '9pt', value: '9pt' },
  { label: '10pt', value: '10pt' },
  { label: '11pt', value: '11pt' },
  { label: '12pt', value: '12pt' },
  { label: '14pt', value: '14pt' },
  { label: '16pt', value: '16pt' },
  { label: '18pt', value: '18pt' },
  { label: '20pt', value: '20pt' },
  { label: '24pt', value: '24pt' },
  { label: '28pt', value: '28pt' },
  { label: '32pt', value: '32pt' },
  { label: '36pt', value: '36pt' },
  { label: '48pt', value: '48pt' },
  { label: '72pt', value: '72pt' },
];

const LINE_HEIGHTS = [
  { label: '1.0', value: '1' },
  { label: '1.15', value: '1.15' },
  { label: '1.5', value: '1.5' },
  { label: '2.0', value: '2' },
  { label: '2.5', value: '2.5' },
  { label: '3.0', value: '3' },
];

export const RichTextEditor = ({ content, onChange, onSave, placeholder }: RichTextEditorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      TextStyle,
      FontSize,
      LineHeight,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      CustomImage.configure({
        inline: false,
        allowBase64: true,
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Mulai menulis di sini...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[300px] px-5 py-4 lg:px-8 lg:py-6',
      },
      handleKeyDown: (_view, event) => {
        // Ctrl+S / Cmd+S to save
        if ((event.ctrlKey || event.metaKey) && event.key === 's') {
          event.preventDefault();
          onSave?.();
          return true;
        }
        return false;
      },
    },
  });

  // Sync content from parent when it changes externally (page switch)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-dropdown]')) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Image upload — directly insert into editor (no modal)
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editor) return;
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar (JPG, PNG, GIF, dll).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran gambar maksimal 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      editor.chain().focus().setImage({ src: base64 }).run();
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }, [editor]);

  const setFontColor = useCallback((color: string) => {
    if (!editor) return;
    editor.chain().focus().setColor(color).run();
    setOpenDropdown(null);
  }, [editor]);

  const setHighlightColor = useCallback((color: string) => {
    if (!editor) return;
    if (color === 'transparent') {
      editor.chain().focus().unsetHighlight().run();
    } else {
      editor.chain().focus().setHighlight({ color }).run();
    }
    setOpenDropdown(null);
  }, [editor]);

  const setFontFamily = useCallback((font: string) => {
    if (!editor) return;
    if (font) {
      editor.chain().focus().setMark('textStyle', { fontFamily: font }).run();
    } else {
      editor.chain().focus().unsetMark('textStyle').run();
    }
  }, [editor]);

  const handleFontSizeChange = useCallback((size: string) => {
    if (!editor) return;
    if (size) {
      editor.chain().focus().setFontSize(size).run();
    } else {
      editor.chain().focus().unsetFontSize().run();
    }
  }, [editor]);

  const handleLineHeightChange = useCallback((height: string) => {
    if (!editor) return;
    if (height) {
      editor.chain().focus().setLineHeight(height).run();
    } else {
      editor.chain().focus().unsetLineHeight().run();
    }
  }, [editor]);

  // Text case transformation
  const transformTextCase = useCallback((mode: 'upper' | 'lower' | 'capitalize' | 'sentence') => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    if (from === to) return;

    const selectedText = editor.state.doc.textBetween(from, to, ' ');
    let transformed = '';

    switch (mode) {
      case 'upper': transformed = selectedText.toUpperCase(); break;
      case 'lower': transformed = selectedText.toLowerCase(); break;
      case 'capitalize': transformed = selectedText.replace(/\b\w/g, (c) => c.toUpperCase()); break;
      case 'sentence': transformed = selectedText.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase()); break;
    }

    editor.chain().focus().insertContentAt({ from, to }, transformed).run();
    setOpenDropdown(null);
  }, [editor]);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  if (!editor) return null;

  return (
    <div className="flex flex-col h-full border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />

      {/* Toolbar */}
      <div className="shrink-0 border-b border-slate-200 bg-slate-50/80">
        {/* Row 1 */}
        <div className="flex items-center gap-0.5 px-2 py-1.5 flex-wrap border-b border-slate-100">
          <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo (Ctrl+Z)">
            <IconArrowBackUp size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo (Ctrl+Y)">
            <IconArrowForwardUp size={15} />
          </ToolbarButton>

          <ToolbarDivider />

          <select onChange={(e) => setFontFamily(e.target.value)} className="h-7 px-1.5 pr-5 text-[10px] font-medium bg-white border border-slate-200 rounded-md text-slate-700 cursor-pointer appearance-none focus:outline-none" title="Font">
            {FONT_FAMILIES.map((f) => <option key={f.label} value={f.value}>{f.label}</option>)}
          </select>

          <select onChange={(e) => handleFontSizeChange(e.target.value)} className="h-7 px-1.5 pr-5 text-[10px] font-medium bg-white border border-slate-200 rounded-md text-slate-700 cursor-pointer appearance-none focus:outline-none" title="Ukuran Font">
            <option value="">Size</option>
            {FONT_SIZES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>

          <ToolbarDivider />

          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Heading 1"><IconH1 size={15} /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2"><IconH2 size={15} /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3"><IconH3 size={15} /></ToolbarButton>

          <ToolbarDivider />

          <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold (Ctrl+B)"><IconBold size={15} /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic (Ctrl+I)"><IconItalic size={15} /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline (Ctrl+U)"><IconUnderline size={15} /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough"><IconStrikethrough size={15} /></ToolbarButton>
        </div>

        {/* Row 2 */}
        <div className="flex items-center gap-0.5 px-2 py-1.5 flex-wrap">
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Rata Kiri"><IconAlignLeft size={15} /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Rata Tengah"><IconAlignCenter size={15} /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Rata Kanan"><IconAlignRight size={15} /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} active={editor.isActive({ textAlign: 'justify' })} title="Rata Kanan-Kiri"><IconAlignJustified size={15} /></ToolbarButton>

          <ToolbarDivider />

          <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List"><IconList size={15} /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered List"><IconListNumbers size={15} /></ToolbarButton>

          <ToolbarDivider />

          <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Kutipan"><IconQuote size={15} /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Garis Pemisah"><IconSeparator size={15} /></ToolbarButton>

          <ToolbarDivider />

          {/* Line Height - click toggle */}
          <div className="relative" data-dropdown>
            <ToolbarButton onClick={() => toggleDropdown('lineheight')} title="Spasi Baris">
              <IconLineHeight size={15} />
            </ToolbarButton>
            {openDropdown === 'lineheight' && (
              <div className="absolute top-full left-0 mt-1 py-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 flex flex-col w-[100px]">
                {LINE_HEIGHTS.map((lh) => (
                  <button key={lh.value} type="button" onClick={() => { handleLineHeightChange(lh.value); setOpenDropdown(null); }} className="px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer border-none bg-transparent text-left">
                    {lh.label}×
                  </button>
                ))}
                <button type="button" onClick={() => { handleLineHeightChange(''); setOpenDropdown(null); }} className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 hover:bg-slate-100 cursor-pointer border-none bg-transparent text-left">
                  Default
                </button>
              </div>
            )}
          </div>

          <ToolbarDivider />

          {/* Font Color - click toggle */}
          <div className="relative" data-dropdown>
            <ToolbarButton onClick={() => toggleDropdown('color')} title="Warna Teks">
              <IconPalette size={15} />
            </ToolbarButton>
            {openDropdown === 'color' && (
              <div className="absolute top-full left-0 mt-1 p-2.5 bg-white border border-slate-200 rounded-lg shadow-lg z-50 flex flex-col gap-2 w-[185px]">
                <div className="grid grid-cols-6 gap-1.5">
                  {FONT_COLORS.map((color) => (
                    <button key={color} type="button" onClick={() => setFontColor(color)} className="w-6 h-6 rounded cursor-pointer border border-slate-200 hover:scale-110 hover:ring-2 hover:ring-sky-300 transition-all" style={{ backgroundColor: color }} title={color} />
                  ))}
                </div>
                {/* Custom color input */}
                <div className="flex items-center gap-1.5 pt-1.5 border-t border-slate-100">
                  <input
                    type="color"
                    className="w-6 h-6 rounded cursor-pointer border border-slate-200 p-0"
                    onChange={(e) => setFontColor(e.target.value)}
                    title="Pilih warna custom"
                  />
                  <span className="text-[9px] text-slate-400 font-medium">Warna lainnya...</span>
                </div>
              </div>
            )}
          </div>

          {/* Highlight - click toggle */}
          <div className="relative" data-dropdown>
            <ToolbarButton onClick={() => toggleDropdown('highlight')} title="Warna Sorotan">
              <IconHighlight size={15} />
            </ToolbarButton>
            {openDropdown === 'highlight' && (
              <div className="absolute top-full left-0 mt-1 p-2.5 bg-white border border-slate-200 rounded-lg shadow-lg z-50 flex flex-col gap-2 w-[185px]">
                <div className="grid grid-cols-6 gap-1.5">
                  {HIGHLIGHT_COLORS.map((color) => (
                    <button key={color} type="button" onClick={() => setHighlightColor(color)} className="w-6 h-6 rounded cursor-pointer border border-slate-200 hover:scale-110 hover:ring-2 hover:ring-sky-300 transition-all" style={{ backgroundColor: color === 'transparent' ? '#fff' : color }} title={color === 'transparent' ? 'Hapus' : color}>
                      {color === 'transparent' && <span className="text-[9px] text-rose-500 font-bold">✕</span>}
                    </button>
                  ))}
                </div>
                {/* Custom color input */}
                <div className="flex items-center gap-1.5 pt-1.5 border-t border-slate-100">
                  <input
                    type="color"
                    className="w-6 h-6 rounded cursor-pointer border border-slate-200 p-0"
                    onChange={(e) => setHighlightColor(e.target.value)}
                    title="Pilih warna custom"
                  />
                  <span className="text-[9px] text-slate-400 font-medium">Warna lainnya...</span>
                </div>
              </div>
            )}
          </div>

          <ToolbarDivider />

          {/* Image upload */}
          <ToolbarButton onClick={() => fileInputRef.current?.click()} title="Sisipkan Gambar">
            <IconPhoto size={15} />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Text Case - click toggle */}
          <div className="relative" data-dropdown>
            <ToolbarButton onClick={() => toggleDropdown('textcase')} title="Ubah Huruf (seleksi teks dulu)">
              <IconLetterCase size={15} />
            </ToolbarButton>
            {openDropdown === 'textcase' && (
              <div className="absolute top-full right-0 mt-1 py-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 flex flex-col w-[150px]">
                <button type="button" onClick={() => transformTextCase('upper')} className="px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer border-none bg-transparent text-left">UPPERCASE</button>
                <button type="button" onClick={() => transformTextCase('lower')} className="px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer border-none bg-transparent text-left">lowercase</button>
                <button type="button" onClick={() => transformTextCase('capitalize')} className="px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer border-none bg-transparent text-left">Capitalize Each</button>
                <button type="button" onClick={() => transformTextCase('sentence')} className="px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer border-none bg-transparent text-left">Sentence case</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} className="h-full" />
      </div>
    </div>
  );
};

// --- Sub-components ---

function ToolbarButton({ onClick, active, disabled, title, children }: {
  onClick: () => void; active?: boolean; disabled?: boolean; title?: string; children: React.ReactNode;
}) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} title={title}
      className={`w-7 h-7 rounded-md flex items-center justify-center cursor-pointer border-none transition-all ${
        active ? 'bg-sky-100 text-sky-700' : 'bg-transparent text-slate-600 hover:bg-slate-200/70'
      } ${disabled ? 'opacity-30 pointer-events-none' : ''}`}
    >{children}</button>
  );
}

function ToolbarDivider() {
  return <div className="w-px h-5 bg-slate-200 mx-1" />;
}
