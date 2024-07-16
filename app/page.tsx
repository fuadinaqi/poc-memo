'use client';
import Image from 'next/image';
import { useCallback, useMemo, useState } from 'react';
// Import the Slate editor factory.
import { createEditor, Editor, Element, Transforms } from 'slate';
// TypeScript users only add this code
import { BaseEditor, Descendant, Node } from 'slate';
import { ReactEditor } from 'slate-react';

type CustomElement = { type: 'paragraph'; children: CustomText[] };
type CustomText = { text: string };

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from 'slate-react';

// Define a React component renderer for our code blocks.
const CodeElement = (props: any) => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
};

const DefaultElement = (props: any) => {
  console.log(props);
  return <p {...props.attributes}>{props.children}</p>;
};

// Define a React component to render leaves with bold text.
const Leaf = (props: any) => {
  return (
    <span
      {...props.attributes}
      style={{
        fontWeight: props.leaf.bold ? 'bold' : 'normal',
        fontStyle: props.leaf.italic ? 'italic' : 'normal',
      }}
    >
      {props.children}
    </span>
  );
};

// Define our own custom set of helpers.
const CustomEditor = {
  isBoldMarkActive(editor) {
    const marks = Editor.marks(editor);
    return marks ? marks.bold === true : false;
  },

  isItalicMarkActive(editor) {
    const marks = Editor.marks(editor);
    return marks ? marks.italic === true : false;
  },

  isCodeBlockActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.type === 'code',
    });

    return !!match;
  },

  toggleBoldMark(editor) {
    const isActive = CustomEditor.isBoldMarkActive(editor);
    if (isActive) {
      Editor.removeMark(editor, 'bold');
    } else {
      Editor.addMark(editor, 'bold', true);
    }
  },

  toggleItalicMark(editor) {
    const isActive = CustomEditor.isItalicMarkActive(editor);
    if (isActive) {
      Editor.removeMark(editor, 'italic');
    } else {
      Editor.addMark(editor, 'italic', true);
    }
  },

  // toggleCodeBlock(editor) {
  //   const isActive = CustomEditor.isCodeBlockActive(editor)
  //   Transforms.setNodes(
  //     editor,
  //     { type: isActive ? null : 'code' },
  //     { match: n => Editor.isBlock(editor, n) }
  //   )
  // },
};

export default function Home() {
  const [editor] = useState(() => withReact(createEditor()));
  // editor.isInline = (element) => {
  //   return element.type === 'paragraph'
  // }

  const renderElement = useCallback((props: any) => {
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  const renderLeaf = useCallback((props: any) => {
    return <Leaf {...props} />;
  }, []);

  const initialValue = useMemo(() => {
    if (localStorage.getItem('content')) {
      return (
        JSON.parse(localStorage.getItem('content') || '') || [
          {
            type: 'paragraph',
            children: [{ text: 'A line of text in a paragraph.' }],
          },
        ]
      );
    }
    return [
      {
        type: 'paragraph',
        children: [{ text: 'A line of text in a paragraph.' }],
      },
    ];
  }, []);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  return (
    <div className="flex justify-center mt-40">
      {isEdit ? (
        <Slate
          onChange={(value) => {
            const isAstChange = editor.operations.some(
              (op) => 'set_selection' !== op.type
            );
            if (isAstChange) {
              // console.log(value.map((node: any) => {
              //   return Node.string(node)
              // }).join('\n'))
              // Save the value to Local Storage.
              const content = JSON.stringify(value);
              localStorage.setItem('content', content);
            }
          }}
          editor={editor}
          initialValue={initialValue}
        >
          <div>
            <button
              onMouseDown={(event) => {
                event.preventDefault();
                CustomEditor.toggleBoldMark(editor);
              }}
            >
              Bold
            </button>{' '}
            <button
              onMouseDown={(event) => {
                event.preventDefault();
                CustomEditor.toggleItalicMark(editor);
              }}
            >
              Italic
            </button>
          </div>
          <Editable
            className={`min-w-[400px] max-w-[400px] border`}
            onMouseEnter={() => {
              console.log('onMouseEnter');
            }}
            onMouseLeave={() => {
              console.log('onMouseLeave');
            }}
            autoFocus
            // readOnly
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            onKeyDown={(event) => {
              if (!event.ctrlKey && !event.metaKey) {
                return;
              }

              // Replace the `onKeyDown` logic with our new commands.
              switch (event.key) {
                // case '`': {
                //   event.preventDefault()
                //   CustomEditor.toggleCodeBlock(editor)
                //   break
                // }

                case 'b': {
                  event.preventDefault();
                  CustomEditor.toggleBoldMark(editor);
                  break;
                }

                case 'i': {
                  event.preventDefault();
                  CustomEditor.toggleItalicMark(editor);
                  break;
                }
              }
            }}
          />
        </Slate>
      ) : (
        <div
          className={`border border-transparent hover:border-blue-200`}
          onClick={() => {
            setIsEdit(true);
          }}
        >
          An example text
        </div>
      )}
    </div>
  );
}
