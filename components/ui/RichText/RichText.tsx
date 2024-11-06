import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import Image from '@tiptap/extension-image';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import { useRef, useEffect } from 'react';
import { Button } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import debounce from 'lodash.debounce';
import '@mantine/tiptap/styles.css';

interface RichTextProps {
  setContent: (content: string) => void;
  initialContent?: string;
}

export default function RichText({ setContent, initialContent = '' }: RichTextProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image.configure({ allowBase64: true }),
    ],
    content: '', // Устанавливаем пустое значение при инициализации
    onUpdate: debounce(({ editor }) => {
      setContent(editor.getHTML());
    }, 300),
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result as string;
        editor?.commands.setImage({ src: base64Image });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    // Проверяем, что редактор полностью инициализировался перед установкой начального содержимого
    if (editor?.isEmpty && initialContent) {
      editor.commands.setContent(initialContent, false); // Загружаем начальный контент один раз
    }
  }, [editor, initialContent]);

  return (
    <RichTextEditor style={{ borderRadius: '14px', padding: '8px' }} editor={editor}>
      <RichTextEditor.Toolbar sticky stickyOffset={60}>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.ClearFormatting />
          <RichTextEditor.Highlight />
          <RichTextEditor.Code />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.H1 />
          <RichTextEditor.H2 />
          <RichTextEditor.H3 />
          <RichTextEditor.H4 />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Blockquote />
          <RichTextEditor.Hr />
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
          <RichTextEditor.Subscript />
          <RichTextEditor.Superscript />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Link />
          <RichTextEditor.Unlink />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.AlignLeft />
          <RichTextEditor.AlignCenter />
          <RichTextEditor.AlignJustify />
          <RichTextEditor.AlignRight />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Undo />
          <RichTextEditor.Redo />
        </RichTextEditor.ControlsGroup>

        {/* Поле для загрузки изображений */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />

        <Button
          onClick={handleButtonClick}
          variant="outline"
          color="#cfcfcf"
          radius="4"
          w="30px"
          h="26px"
          styles={() => ({
            root: {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '0',
            },
          })}
        >
          <IconUpload size={14} color="black" />
        </Button>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content pt="0" />
    </RichTextEditor>
  );
}
