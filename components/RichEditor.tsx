'use client'

import { RICH_EDITOR_HEIGHT } from '@/constants';
import { Placeholder } from '@tiptap/extensions';
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect, useRef, useState } from 'react';

type Props = {
  name: string;
}

export default function RichEditor({name}: Props) {
  const [html, setHtml] = useState('');
  const [richEditorHeight, setRichEditorHeight] = useState(RICH_EDITOR_HEIGHT);
  const richEditorRef = useRef<HTMLDivElement | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: '本文',
      }),
    ],
    immediatelyRender: false,
    onBlur: (event) => {
      setHtml(event.editor.getHTML());
    }
  });

  useEffect(() => {
    if (!richEditorRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      const height = richEditorRef.current?.clientHeight;
      if (height) {
        setRichEditorHeight(height);
      }
    });
    resizeObserver.observe(richEditorRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div>
      <div
        className="has-focus:outline-2 outline-(--outline-color) rounded-sm overflow-scroll bg-gray-100 text-sm w-full resize-y"
        ref={richEditorRef}
        style={{height: `${richEditorHeight}px`}}
      >
        <EditorContent
          editor={editor}
          className="rounded-sm"
          style={{height: `${richEditorHeight}px`}}
        />
      </div>
      <textarea name={name} className="hidden" value={html} readOnly></textarea>
    </div>
  );
}