'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createEditor, Descendant, Transforms } from 'slate';
import { BaseEditor, Node } from 'slate';
import {
  ReactEditor,
  Slate,
  Editable,
  withReact,
  RenderElementProps,
  RenderLeafProps,
} from 'slate-react';

import Toolbar, { CustomEditor } from '../toolbar';
import Add from '../add';
import {
  CustomElement,
  SmartdocEditorType,
} from '@/app/_providers/SmartdocProvider';
import { withHistory } from 'slate-history';

const TitleElement = (props: RenderElementProps) => {
  return (
    <h1 {...props.attributes} className="font-bold text-center">
      {props.children}
    </h1>
  );
};

const DefaultElement = (props: RenderElementProps) => {
  return <p {...props.attributes}>{props.children}</p>;
};

const Leaf = (props: RenderLeafProps) => {
  return (
    <span
      {...props.attributes}
      className={`
        ${props.leaf.bold ? 'font-bold' : ''}
        ${props.leaf.italic ? 'italic' : ''}
        ${props.leaf.underline ? 'underline' : ''}
      `}
    >
      {props.children}
    </span>
  );
};

export default function SmartdocEditor(props: {
  elementType: SmartdocEditorType;
  initialValue: CustomElement[];
  onChange: (value: Descendant[]) => void;
  className?: string;
}) {
  const { initialValue, onChange, className = '' } = props;
  const [editor] = useState(() => withReact(withHistory(createEditor())));

  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case 'title':
        return <TitleElement {...props} />;
      case 'paragraph':
        return <DefaultElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return <Leaf {...props} />;
  }, []);

  useEffect(() => {
    Transforms.select(editor, {
      offset: 0,
      path: [0, 0],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`relative ${className || ''}`}>
      <Slate editor={editor} initialValue={initialValue} onChange={onChange}>
        <Editable
          className={`
            w-full h-full m-0 p-0 focus:outline-none cursor-text
          `}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          autoFocus
          onKeyDown={(event) => {
            if (!event.ctrlKey && !event.metaKey) {
              return;
            }

            switch (event.key) {
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

              case 'u': {
                event.preventDefault();
                CustomEditor.toggleUnderlineMark(editor);
                break;
              }
            }
          }}
        />
      </Slate>
      <Toolbar elementType={props.elementType} editor={editor} />
    </div>
  );
}
