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

export default function Toolbar(props: { editor: BaseEditor & ReactEditor }) {
  const { editor } = props;
  return (
    <div className="absolute -top-4 right-0 flex items-center border border-blue-700">
      <button
        className="p-1 border flex items-center justify-center w-6 h-6 bg-teal-700 text-white border-black cursor-pointer"
        onMouseDown={(event) => {
          event.preventDefault();
          CustomEditor.toggleBoldMark(editor);
        }}
      >
        B
      </button>
      <button
        className="p-1 border flex items-center justify-center w-6 h-6 bg-teal-700 text-white border-black cursor-pointer"
        onMouseDown={(event) => {
          event.preventDefault();
          CustomEditor.toggleItalicMark(editor);
        }}
      >
        I
      </button>
      <button
        className="p-1 border flex items-center justify-center w-6 h-6 bg-teal-700 text-white border-black cursor-pointer"
        onMouseDown={(event) => {
          event.preventDefault();
          CustomEditor.toggleUnderlineMark(editor);
        }}
      >
        U
      </button>
    </div>
  );
}
