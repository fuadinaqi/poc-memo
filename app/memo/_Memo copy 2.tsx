// import React, { useCallback, useEffect, useMemo } from 'react';
// import isHotkey from 'is-hotkey';
// import {
//   Editable,
//   withReact,
//   useSlate,
//   Slate,
//   RenderLeafProps,
//   RenderElementProps,
//   useSelected,
// } from 'slate-react';
// import {
//   Editor,
//   Transforms,
//   createEditor,
//   Descendant,
//   Element as SlateElement,
//   BaseSelection,
//   Range,
// } from 'slate';
// import { withHistory } from 'slate-history';
// import {
//   Document,
//   Paragraph,
//   TextRun,
//   Packer,
//   AlignmentType,
//   HeadingLevel,
// } from 'docx';

// import { Button, Icon, Toolbar } from './components';
// import { CustomText } from '../_providers/SmartdocProvider';

// const HOTKEYS = {
//   'mod+b': 'bold',
//   'mod+i': 'italic',
//   'mod+u': 'underline',
// };

// const LIST_TYPES = ['numbering', 'bullets', 'alphabet'];
// const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify'];

// const insertLink = (editor: Editor, url: string) => {
//   if (editor.selection) {
//     wrapLink(editor, url);
//   }
// };

// const AddLinkButton = () => {
//   const editor = useSlate();
//   return (
//     <Button
//       active={isLinkActive(editor)}
//       onMouseDown={(event: any) => {
//         event.preventDefault();
//         const url = window.prompt('Enter the URL of the link:');
//         if (!url) return;
//         insertLink(editor, url);
//       }}
//     >
//       <Icon>link</Icon>
//     </Button>
//   );
// };

// const RemoveLinkButton = () => {
//   const editor = useSlate();

//   return (
//     <Button
//       active={isLinkActive(editor)}
//       onMouseDown={(event: any) => {
//         if (isLinkActive(editor)) {
//           unwrapLink(editor);
//         }
//       }}
//     >
//       <Icon>link_off</Icon>
//     </Button>
//   );
// };

// export type LinkElement = { type: 'link'; url: string; children: Descendant[] };

// const isUrl = (text: string) => {
//   try {
//     new URL(text);
//     return true;
//   } catch (e) {
//     return false;
//   }
// };
// const isLinkActive = (editor: Editor) => {
//   const [link] = Array.from(
//     Editor.nodes(editor, {
//       match: (n) =>
//         !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link',
//     })
//   );
//   return !!link;
// };

// const unwrapLink = (editor: Editor) => {
//   Transforms.unwrapNodes(editor, {
//     match: (n) =>
//       !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link',
//   });
// };

// const wrapLink = (editor: Editor, url: string) => {
//   if (isLinkActive(editor)) {
//     unwrapLink(editor);
//   }

//   const { selection } = editor;
//   const isCollapsed = selection && Range.isCollapsed(selection);
//   const link: LinkElement = {
//     type: 'link',
//     url,
//     children: isCollapsed ? [{ text: url }] : [],
//   };

//   if (isCollapsed) {
//     Transforms.insertNodes(editor, link as any);
//   } else {
//     Transforms.wrapNodes(editor, link as any, { split: true });
//     Transforms.collapse(editor, { edge: 'end' });
//   }
// };

// const withInlines = (editor: Editor) => {
//   const { insertData, insertText, isInline, isElementReadOnly, isSelectable } =
//     editor;

//   editor.isInline = (element) =>
//     ['link'].includes(element.type) || isInline(element);

//   editor.isSelectable = (element) => isSelectable(element);

//   editor.insertText = (text) => {
//     if (text && isUrl(text)) {
//       wrapLink(editor, text);
//     } else {
//       insertText(text);
//     }
//   };

//   editor.insertData = (data) => {
//     const text = data.getData('text/plain');

//     if (text && isUrl(text)) {
//       wrapLink(editor, text);
//     } else {
//       insertData(data);
//     }
//   };

//   return editor;
// };

// const InlineChromiumBugfix = () => (
//   <span contentEditable={false} className={`text-[0]`}>
//     {String.fromCodePoint(160) /* Non-breaking space */}
//   </span>
// );

// const allowedSchemes = ['http:', 'https:', 'mailto:', 'tel:'];

// const LinkComponent = ({
//   attributes,
//   children,
//   element,
// }: RenderElementProps) => {
//   const selected = useSelected();

//   const safeUrl = useMemo(() => {
//     let parsedUrl: URL | null = null;
//     try {
//       parsedUrl = new URL(element.url || '');
//       // eslint-disable-next-line no-empty
//     } catch {}
//     if (parsedUrl && allowedSchemes.includes(parsedUrl.protocol)) {
//       return parsedUrl.href;
//     }
//     return 'about:blank';
//   }, [element.url]);

//   return (
//     <a
//       {...attributes}
//       href={safeUrl}
//       className={`${selected ? 'shadow-[0_0_0_3px_#ddd]' : ''} underline text-blue-500`}
//     >
//       <InlineChromiumBugfix />
//       {children}
//       <InlineChromiumBugfix />
//     </a>
//   );
// };

// const MemoExample = ({ value }: { value: Descendant[] }) => {
//   const renderElement = useCallback(
//     (props: RenderElementProps) => <Element {...props} />,
//     []
//   );
//   const renderLeaf = useCallback(
//     (props: RenderLeafProps) => <Leaf {...props} />,
//     []
//   );

//   const editor = useMemo(() => {
//     const e = withHistory(withReact(withInlines(createEditor())));

//     const overrideDeleteBackward = (selection: BaseSelection) => {
//       if (selection) {
//         const [node, path] = Editor.node(e, [0]);

//         if (SlateElement.isElement(node) && node.children.length === 1) {
//           if (node.children[0].text === '') {
//             Transforms.setNodes(
//               e,
//               {
//                 type: 'paragraph',
//                 children: [{ text: '' }],
//               },
//               { at: path }
//             );
//           }

//           if (
//             SlateElement.isElement(node.children[0]) &&
//             node.children[0].children.length === 1
//           ) {
//             const firstChild = node.children[0].children[0];
//             if ('text' in firstChild && firstChild.text === '') {
//               Transforms.removeNodes(e, { at: path });
//               Transforms.insertNodes(
//                 e,
//                 {
//                   type: 'paragraph',
//                   children: [{ text: '' }],
//                 },
//                 { at: path }
//               );
//               Transforms.select(e, path);
//             }
//           }
//         }
//       }
//     };

//     // Tambahkan normalisasi kustom
//     const { deleteBackward, deleteFragment } = e;

//     // Override deleteBackward untuk menangani penghapusan
//     e.deleteBackward = (...args) => {
//       const { selection } = editor;

//       // Panggil deleteBackward bawaan terlebih dahulu
//       deleteBackward(...args);

//       // Cek kondisi setelah penghapusan
//       overrideDeleteBackward(selection);
//     };

//     e.deleteFragment = (...args) => {
//       const { selection } = editor;

//       // Panggil deleteBackward bawaan terlebih dahulu
//       deleteFragment(...args);

//       // Cek kondisi setelah penghapusan
//       overrideDeleteBackward(selection);
//     };

//     return e;
//   }, []);

//   useEffect(() => {
//     if (editor.children.length > 0) {
//       Transforms.removeNodes(editor, {
//         at: {
//           anchor: Editor.start(editor, []),
//           focus: Editor.end(editor, []),
//         },
//         mode: 'highest',
//       });
//     }
//     Transforms.insertNodes(editor, value);
//     if (editor.children.length > 0) {
//       Transforms.select(editor, [0, 0]);
//     }
//   }, [value]);

//   const downloadContent = useCallback(() => {
//     // Fungsi untuk mengkonversi node Slate ke docx elements
//     const serializeNode = (node: any): any[] => {
//       // Handle text node
//       if (node.text !== undefined) {
//         return [
//           new TextRun({
//             text: node.text,
//             bold: node.bold || false,
//             italics: node.italic || false,
//             underline: node.underline || false,
//           }),
//         ];
//       }

//       // Handle nested structure
//       if (node.children) {
//         // Gabungkan semua TextRun dari children
//         const runs = node.children.flatMap(serializeNode).flat();

//         // Konversi alignment Slate ke docx
//         const getAlignment = (align?: string) => {
//           switch (align) {
//             case 'center':
//               return AlignmentType.CENTER;
//             case 'right':
//               return AlignmentType.RIGHT;
//             case 'justify':
//               return AlignmentType.JUSTIFIED;
//             default:
//               return AlignmentType.LEFT;
//           }
//         };

//         // Buat paragraf sesuai tipe node
//         switch (node.type) {
//           case 'heading-one':
//             return [
//               new Paragraph({
//                 children: runs,
//                 heading: HeadingLevel.HEADING_1,
//                 alignment: getAlignment(node.align),
//               }),
//             ];
//           case 'heading-two':
//             return [
//               new Paragraph({
//                 children: runs,
//                 heading: HeadingLevel.HEADING_2,
//                 alignment: getAlignment(node.align),
//               }),
//             ];
//           case 'list-item':
//             return [
//               new Paragraph({
//                 children: runs,
//                 bullet: {
//                   level: 0,
//                 },
//                 alignment: getAlignment(node.align),
//               }),
//             ];
//           case 'bullets':
//           case 'numbering':
//           case 'alphabet':
//             // Untuk list container, kita hanya perlu mengembalikan children
//             return runs;
//           case 'link':
//             // Untuk link, kita hanya mengembalikan TextRun
//             return runs;
//           default:
//             return [
//               new Paragraph({
//                 children: runs,
//                 alignment: getAlignment(node.align),
//               }),
//             ];
//         }
//       }

//       return [];
//     };

//     // Buat dokumen baru
//     const doc = new Document({
//       sections: [
//         {
//           properties: {},
//           children: editor.children.flatMap(serializeNode),
//         },
//       ],
//     });

//     // Generate dan unduh file
//     Packer.toBlob(doc).then((blob) => {
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = 'dokumen.docx';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
//     });
//   }, [editor]);

//   return (
//     <Slate
//       editor={editor}
//       initialValue={value}
//       onChange={(e) => {
//         // console.log(e);
//       }}
//     >
//       <Toolbar>
//         <MarkButton format="bold" icon="B" />
//         <MarkButton format="italic" icon="I" />
//         <MarkButton format="underline" icon="U" />
//         <BlockButton format="heading-one" icon="1" />
//         <BlockButton format="heading-two" icon="2" />
//         <BlockButton format="numbering" icon="n_list" />
//         <BlockButton format="bullets" icon="b_list" />
//         <BlockButton format="alphabet" icon="a_list" />
//         <BlockButton format="left" icon="left" />
//         <BlockButton format="center" icon="center" />
//         <BlockButton format="right" icon="right" />
//         <BlockButton format="justify" icon="justify" />
//         <AddLinkButton />
//         <RemoveLinkButton />
//         <Button
//           onMouseDown={(event: MouseEvent) => {
//             event.preventDefault();
//             downloadContent();
//           }}
//         >
//           <Icon>download</Icon>
//         </Button>
//       </Toolbar>
//       <Editable
//         renderElement={renderElement}
//         renderLeaf={renderLeaf}
//         placeholder="Enter some rich text…"
//         spellCheck
//         autoFocus
//         onKeyDown={(event) => {
//           // Handle hotkeys
//           for (const hotkey in HOTKEYS) {
//             if (isHotkey(hotkey, event as any)) {
//               event.preventDefault();
//               const mark = HOTKEYS[hotkey as keyof typeof HOTKEYS];
//               toggleMark(editor, mark);
//             }
//           }

//           // Handle Shift+Enter dalam list-item
//           if (event.shiftKey && event.key === 'Enter') {
//             event.preventDefault();
//             // Cek apakah kursor berada dalam list-item
//             const [match] = Array.from(
//               Editor.nodes(editor, {
//                 match: (n) =>
//                   !Editor.isEditor(n) &&
//                   SlateElement.isElement(n) &&
//                   n.type === 'list-item',
//               })
//             );

//             if (match) {
//               // Sisipkan soft break (newline) dalam list-item
//               Transforms.insertText(editor, '\n');
//             } else {
//               // Jika bukan dalam list-item, lakukan default behavior
//               Transforms.insertText(editor, '\n');
//             }
//           }
//         }}
//       />
//     </Slate>
//   );
// };

// const toggleBlock = (editor: Editor, format: any) => {
//   const isActive = isBlockActive(
//     editor,
//     format,
//     TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
//   );
//   const isList = LIST_TYPES.includes(format);

//   Transforms.unwrapNodes(editor, {
//     match: (n) =>
//       !Editor.isEditor(n) &&
//       SlateElement.isElement(n) &&
//       LIST_TYPES.includes(n.type) &&
//       !TEXT_ALIGN_TYPES.includes(format),
//     split: true,
//   });
//   let newProperties: Partial<SlateElement>;
//   if (TEXT_ALIGN_TYPES.includes(format)) {
//     newProperties = {
//       align: isActive ? undefined : format,
//     };
//   } else {
//     newProperties = {
//       type: isActive ? 'paragraph' : isList ? 'list-item' : format,
//     };
//   }
//   Transforms.setNodes<SlateElement>(editor, newProperties);

//   if (!isActive && isList) {
//     const block = { type: format, children: [] };
//     Transforms.wrapNodes(editor, block);
//   }
// };

// const toggleMark = (editor: Editor, format: string) => {
//   const isActive = isMarkActive(editor, format);

//   if (isActive) {
//     Editor.removeMark(editor, format);
//   } else {
//     Editor.addMark(editor, format, true);
//   }
// };

// const isBlockActive = (editor: Editor, format: string, blockType = 'type') => {
//   const { selection } = editor;
//   if (!selection) return false;

//   const [match] = Array.from(
//     Editor.nodes(editor, {
//       at: Editor.unhangRange(editor, selection),
//       match: (n) =>
//         !Editor.isEditor(n) &&
//         SlateElement.isElement(n) &&
//         (n as any)[blockType] === format,
//     })
//   );

//   return !!match;
// };

// const isMarkActive = (editor: Editor, format: string) => {
//   const marks = Editor.marks(editor);
//   return marks
//     ? marks[format as keyof Omit<CustomText, 'text'>] === true
//     : false;
// };

// const Element = (props: RenderElementProps) => {
//   const { attributes, children, element } = props;
//   const style = { textAlign: element.align };
//   const childrenArray = React.Children.toArray(children);
//   const isChildrenBold = childrenArray.some(
//     (child) => React.isValidElement(child) && child.props.text?.bold
//   );

//   switch (element.type) {
//     case 'link':
//       return <LinkComponent {...props} />;
//     case 'block-quote':
//       return (
//         <blockquote style={style} {...attributes}>
//           {children}
//         </blockquote>
//       );
//     case 'bullets':
//       return (
//         <ul
//           className="list-disc"
//           style={{ ...style, paddingInlineStart: '40px' }}
//           {...attributes}
//         >
//           {children}
//         </ul>
//       );
//     case 'heading-one':
//       return (
//         <h1 style={style} {...attributes}>
//           {children}
//         </h1>
//       );
//     case 'heading-two':
//       return (
//         <h2 style={style} {...attributes}>
//           {children}
//         </h2>
//       );
//     case 'list-item':
//       return (
//         <li
//           className={`${isChildrenBold ? 'font-bold' : ''}`}
//           style={style}
//           {...attributes}
//         >
//           {children}
//         </li>
//       );
//     case 'numbering':
//       return (
//         <ol
//           className={`list-decimal`}
//           style={{ ...style, paddingInlineStart: '40px' }}
//           {...attributes}
//         >
//           {children}
//         </ol>
//       );
//     case 'alphabet':
//       return (
//         <ol
//           className={`list-[lower-alpha]`}
//           style={{ ...style, paddingInlineStart: '40px' }}
//           {...attributes}
//         >
//           {children}
//         </ol>
//       );
//     default:
//       return (
//         <p style={style} {...attributes}>
//           {children}
//         </p>
//       );
//   }
// };

// const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
//   if (leaf.bold) {
//     children = <strong>{children}</strong>;
//   }

//   if (leaf.italic) {
//     children = <em>{children}</em>;
//   }

//   if (leaf.underline) {
//     children = <u>{children}</u>;
//   }

//   return <span {...attributes}>{children}</span>;
// };

// const BlockButton = ({ format, icon }: { format: string; icon: string }) => {
//   const editor = useSlate();
//   return (
//     <Button
//       active={isBlockActive(
//         editor,
//         format,
//         TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
//       )}
//       onMouseDown={(event: MouseEvent) => {
//         event.preventDefault();
//         toggleBlock(editor, format);
//       }}
//     >
//       <Icon>{icon}</Icon>
//     </Button>
//   );
// };

// const MarkButton = ({ format, icon }: { format: string; icon: string }) => {
//   const editor = useSlate();
//   return (
//     <Button
//       active={isMarkActive(editor, format)}
//       onMouseDown={(event: MouseEvent) => {
//         event.preventDefault();
//         toggleMark(editor, format);
//       }}
//     >
//       <Icon>{icon}</Icon>
//     </Button>
//   );
// };

// export default MemoExample;

export default function M() {
  return <div />;
}
