import React, { useEffect, useRef } from 'react';
import { Bold, Italic, List, ListOrdered, Eraser } from 'lucide-react';

/**
 * Minimal contenteditable WYSIWYG with a basic text toolbar.
 * Stores HTML in `value` and emits HTML from onChange.
 * Preserves line breaks natively (contenteditable wraps in <div>/<br>).
 */
export default function RichTextEditor({ value = '', onChange, placeholder = 'Write a description…', minHeight = 180 }) {
  const ref = useRef(null);

  // Keep editor in sync when parent value changes (e.g. AI insert)
  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = () => {
    if (!onChange) return;
    onChange(ref.current.innerHTML);
  };

  const exec = (cmd, arg = null) => {
    if (ref.current) ref.current.focus();
    document.execCommand(cmd, false, arg);
    handleInput();
  };

  const Btn = ({ onClick, title, children }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    >
      {children}
    </button>
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden focus-within:border-[#3355FF] focus-within:ring-2 focus-within:ring-[#3355FF]/20 transition-colors">
      <div className="flex items-center gap-1 border-b border-gray-100 bg-gray-50 px-2 py-1.5">
        <Btn title="Bold" onClick={() => exec('bold')}><Bold className="w-4 h-4" /></Btn>
        <Btn title="Italic" onClick={() => exec('italic')}><Italic className="w-4 h-4" /></Btn>
        <span className="mx-1 h-5 w-px bg-gray-200" />
        <Btn title="Bulleted list" onClick={() => exec('insertUnorderedList')}><List className="w-4 h-4" /></Btn>
        <Btn title="Numbered list" onClick={() => exec('insertOrderedList')}><ListOrdered className="w-4 h-4" /></Btn>
        <span className="mx-1 h-5 w-px bg-gray-200" />
        <Btn title="Clear formatting" onClick={() => exec('removeFormat')}><Eraser className="w-4 h-4" /></Btn>
      </div>
      <div
        ref={ref}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        suppressContentEditableWarning
        className="prose prose-sm max-w-none p-4 text-gray-900 leading-7 focus:outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400"
        style={{ minHeight }}
        data-placeholder={placeholder}
      />
    </div>
  );
}
