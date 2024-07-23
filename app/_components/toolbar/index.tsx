import { SmartdocEditorType } from '@/app/_providers/SmartdocProvider';
import { BaseEditor, Editor } from 'slate';
import { ReactEditor } from 'slate-react';

export const CustomEditor = {
  isBoldMarkActive(editor: Editor) {
    const marks = Editor.marks(editor);
    return marks ? marks.bold === true : false;
  },

  isItalicMarkActive(editor: Editor) {
    const marks = Editor.marks(editor);
    return marks ? marks.italic === true : false;
  },

  isUnderlineMarkActive(editor: Editor) {
    const marks = Editor.marks(editor);
    return marks ? marks.underline === true : false;
  },

  toggleBoldMark(editor: Editor) {
    const isActive = CustomEditor.isBoldMarkActive(editor);
    if (isActive) {
      Editor.removeMark(editor, 'bold');
    } else {
      Editor.addMark(editor, 'bold', true);
    }
  },

  toggleItalicMark(editor: Editor) {
    const isActive = CustomEditor.isItalicMarkActive(editor);
    if (isActive) {
      Editor.removeMark(editor, 'italic');
    } else {
      Editor.addMark(editor, 'italic', true);
    }
  },

  toggleUnderlineMark(editor: Editor) {
    const isActive = CustomEditor.isUnderlineMarkActive(editor);
    if (isActive) {
      Editor.removeMark(editor, 'underline');
    } else {
      Editor.addMark(editor, 'underline', true);
    }
  },
};

export default function Toolbar(props: {
  elementType: SmartdocEditorType;
  editor: BaseEditor & ReactEditor;
}) {
  const { elementType, editor } = props;

  const renderBoldButton = () => {
    if (
      elementType === 'text_content' ||
      elementType === 'ayat' ||
      elementType === 'pasal' ||
      elementType === 'numbering' ||
      elementType === 'alphabet' ||
      elementType === 'bullet'
    ) {
      return (
        <button
          className="p-1 border flex items-center justify-center w-6 h-6 bg-teal-700 text-white border-black cursor-pointer"
          onMouseDown={(event) => {
            event.preventDefault();
            CustomEditor.toggleBoldMark(editor);
          }}
        >
          B
        </button>
      );
    }
    return null;
  };

  const renderItalicButton = () => {
    if (
      elementType === 'text_content' ||
      elementType === 'ayat' ||
      elementType === 'pasal' ||
      elementType === 'numbering' ||
      elementType === 'alphabet' ||
      elementType === 'bullet'
    ) {
      return (
        <button
          className="p-1 border flex items-center justify-center w-6 h-6 bg-teal-700 text-white border-black cursor-pointer"
          onMouseDown={(event) => {
            event.preventDefault();
            CustomEditor.toggleItalicMark(editor);
          }}
        >
          I
        </button>
      );
    }
    return null;
  };

  const renderUnderlineButton = () => {
    if (
      elementType === 'text_content' ||
      elementType === 'ayat' ||
      elementType === 'pasal' ||
      elementType === 'numbering' ||
      elementType === 'alphabet' ||
      elementType === 'bullet'
    ) {
      return (
        <button
          className="p-1 border flex items-center justify-center w-6 h-6 bg-teal-700 text-white border-black cursor-pointer"
          onMouseDown={(event) => {
            event.preventDefault();
            CustomEditor.toggleUnderlineMark(editor);
          }}
        >
          U
        </button>
      );
    }
    return null;
  };

  return (
    <div className="absolute -top-8 -left-8 flex items-center border border-blue-700">
      {renderBoldButton()}
      {renderItalicButton()}
      {renderUnderlineButton()}
    </div>
  );
}
