// components/TiptapEditor.tsx
"use client";
import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
  minHeight?: string;
}

export const TiptapEditor: React.FC<TiptapEditorProps> = ({
  content,
  onChange,
  placeholder = 'Start writing...',
  editable = true,
  minHeight = '450px',
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-cyan-400 underline cursor-pointer hover:text-cyan-300',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg my-4',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `w-full bg-transparent text-white focus:outline-none leading-relaxed prose prose-invert max-w-none px-6 py-6`,
        style: `min-height: ${minHeight}`,
      },
    },
  });

  const setLink = () => {
    if (!editor) return;
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    if (!editor) return;
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  if (!editor) return null;

  const toolbarSections = [
    {
      title: 'Headings',
      tools: [
        {
          icon: Type,
          label: 'H1',
          action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
          isActive: () => editor.isActive('heading', { level: 1 }),
        },
        {
          icon: Type,
          label: 'H2',
          action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
          isActive: () => editor.isActive('heading', { level: 2 }),
        },
        {
          icon: Type,
          label: 'H3',
          action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
          isActive: () => editor.isActive('heading', { level: 3 }),
        },
      ],
    },
    {
      title: 'Text Style',
      tools: [
        {
          icon: Bold,
          label: 'Bold',
          action: () => editor.chain().focus().toggleBold().run(),
          isActive: () => editor.isActive('bold'),
          shortcut: 'Ctrl+B',
        },
        {
          icon: Italic,
          label: 'Italic',
          action: () => editor.chain().focus().toggleItalic().run(),
          isActive: () => editor.isActive('italic'),
          shortcut: 'Ctrl+I',
        },
        {
          icon: UnderlineIcon,
          label: 'Underline',
          action: () => editor.chain().focus().toggleUnderline().run(),
          isActive: () => editor.isActive('underline'),
          shortcut: 'Ctrl+U',
        },
      ],
    },
    {
      title: 'Alignment',
      tools: [
        {
          icon: AlignLeft,
          label: 'Left',
          action: () => editor.chain().focus().setTextAlign('left').run(),
          isActive: () => editor.isActive({ textAlign: 'left' }),
        },
        {
          icon: AlignCenter,
          label: 'Center',
          action: () => editor.chain().focus().setTextAlign('center').run(),
          isActive: () => editor.isActive({ textAlign: 'center' }),
        },
        {
          icon: AlignRight,
          label: 'Right',
          action: () => editor.chain().focus().setTextAlign('right').run(),
          isActive: () => editor.isActive({ textAlign: 'right' }),
        },
      ],
    },
    {
      title: 'Lists',
      tools: [
        {
          icon: List,
          label: 'Bullet',
          action: () => editor.chain().focus().toggleBulletList().run(),
          isActive: () => editor.isActive('bulletList'),
        },
        {
          icon: ListOrdered,
          label: 'Numbered',
          action: () => editor.chain().focus().toggleOrderedList().run(),
          isActive: () => editor.isActive('orderedList'),
        },
      ],
    },
    {
      title: 'Insert',
      tools: [
        {
          icon: LinkIcon,
          label: 'Link',
          action: setLink,
          isActive: () => editor.isActive('link'),
        },
        {
          icon: ImageIcon,
          label: 'Image',
          action: addImage,
          isActive: () => false,
        },
        {
          icon: Quote,
          label: 'Quote',
          action: () => editor.chain().focus().toggleBlockquote().run(),
          isActive: () => editor.isActive('blockquote'),
        },
      ],
    },
  ];

  return (
    <div>
      {editable && (
        <div className="bg-white/10 border-b border-white/20 p-4">
          <div className="flex flex-wrap gap-4 items-center">
            {toolbarSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="flex items-center gap-1">
                {section.tools.map((tool, toolIndex) => (
                  <Button
                    key={toolIndex}
                    variant="ghost"
                    size="sm"
                    onClick={tool.action}
                    className={`w-9 h-9 p-0 transition-colors ${
                      tool.isActive()
                        ? 'bg-cyan-500 text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/20'
                    }`}
                    title={`${tool.label}${
                      'shortcut' in tool && tool.shortcut ? ` (${tool.shortcut})` : ''
                    }`}
                  >
                    <tool.icon className="h-4 w-4" />
                  </Button>
                ))}
                {sectionIndex < toolbarSections.length - 1 && (
                  <div className="w-px h-6 bg-white/20 mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <EditorContent editor={editor} />

      <style jsx global>{`
        .ProseMirror {
          outline: none;
        }

        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: rgba(255, 255, 255, 0.4);
          pointer-events: none;
          height: 0;
          font-style: italic;
        }

        .ProseMirror h1 {
          font-size: 2rem;
          font-weight: bold;
          margin: 1rem 0;
          color: #60a5fa;
        }

        .ProseMirror h2 {
          font-size: 1.75rem;
          font-weight: bold;
          margin: 0.75rem 0;
          color: #34d399;
        }

        .ProseMirror h3 {
          font-size: 1.5rem;
          font-weight: bold;
          margin: 0.5rem 0;
          color: #fbbf24;
        }

        .ProseMirror h4 {
          font-size: 1.25rem;
          font-weight: bold;
          margin: 0.5rem 0;
          color: #f472b6;
        }

        .ProseMirror ul,
        .ProseMirror ol {
          margin: 1rem 0;
          padding-left: 2rem;
        }

        .ProseMirror li {
          margin: 0.5rem 0;
        }

        .ProseMirror blockquote {
          border-left: 4px solid #60a5fa;
          padding-left: 1rem;
          margin: 1rem 0;
          color: #cbd5e1;
          font-style: italic;
        }

        .ProseMirror a {
          color: #60a5fa;
          text-decoration: underline;
        }

        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1rem 0;
        }
      `}</style>
    </div>
  );
};