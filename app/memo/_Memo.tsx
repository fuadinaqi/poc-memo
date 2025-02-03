import React, { useCallback, useEffect, useMemo } from 'react';
import isHotkey from 'is-hotkey';
import {
  Editable,
  withReact,
  useSlate,
  Slate,
  RenderLeafProps,
  RenderElementProps,
  useSelected,
} from 'slate-react';
import {
  Editor,
  Transforms,
  createEditor,
  Descendant,
  Element as SlateElement,
  BaseSelection,
  Range,
} from 'slate';
import { withHistory } from 'slate-history';

import { Button, Icon, Toolbar } from './components';
import { CustomText } from '../_providers/SmartdocProvider';

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
};

const LIST_TYPES = ['numbering', 'bullets', 'alphabet'];
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify'];

const insertLink = (editor: Editor, url: string) => {
  if (editor.selection) {
    wrapLink(editor, url);
  }
};

const AddLinkButton = () => {
  const editor = useSlate();
  return (
    <Button
      active={isLinkActive(editor)}
      onMouseDown={(event: any) => {
        event.preventDefault();
        const url = window.prompt('Enter the URL of the link:');
        if (!url) return;
        insertLink(editor, url);
      }}
    >
      <Icon>link</Icon>
    </Button>
  );
};

const RemoveLinkButton = () => {
  const editor = useSlate();

  return (
    <Button
      active={isLinkActive(editor)}
      onMouseDown={(event: any) => {
        if (isLinkActive(editor)) {
          unwrapLink(editor);
        }
      }}
    >
      <Icon>link_off</Icon>
    </Button>
  );
};

export type LinkElement = { type: 'link'; url: string; children: Descendant[] };

const isUrl = (text: string) => {
  try {
    new URL(text);
    return true;
  } catch (e) {
    return false;
  }
};
const isLinkActive = (editor: Editor) => {
  const [link] = Array.from(
    Editor.nodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link',
    })
  );
  return !!link;
};

const unwrapLink = (editor: Editor) => {
  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link',
  });
};

const wrapLink = (editor: Editor, url: string) => {
  if (isLinkActive(editor)) {
    unwrapLink(editor);
  }

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  const link: LinkElement = {
    type: 'link',
    url,
    children: isCollapsed ? [{ text: url }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, link as any);
  } else {
    Transforms.wrapNodes(editor, link as any, { split: true });
    Transforms.collapse(editor, { edge: 'end' });
  }
};

const withInlines = (editor: Editor) => {
  const { insertData, insertText, isInline, isElementReadOnly, isSelectable } =
    editor;

  editor.isInline = (element) =>
    ['link'].includes(element.type) || isInline(element);

  editor.isSelectable = (element) => isSelectable(element);

  editor.insertText = (text) => {
    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertText(text);
    }
  };

  editor.insertData = (data) => {
    const text = data.getData('text/plain');

    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};

const InlineChromiumBugfix = () => (
  <span contentEditable={false} className={`text-[0]`}>
    {String.fromCodePoint(160) /* Non-breaking space */}
  </span>
);

const allowedSchemes = ['http:', 'https:', 'mailto:', 'tel:'];

const LinkComponent = ({
  attributes,
  children,
  element,
}: RenderElementProps) => {
  const selected = useSelected();

  const safeUrl = useMemo(() => {
    let parsedUrl: URL | null = null;
    try {
      parsedUrl = new URL(element.url || '');
      // eslint-disable-next-line no-empty
    } catch {}
    if (parsedUrl && allowedSchemes.includes(parsedUrl.protocol)) {
      return parsedUrl.href;
    }
    return 'about:blank';
  }, [element.url]);

  return (
    <a
      {...attributes}
      href={safeUrl}
      className={`${selected ? 'shadow-[0_0_0_3px_#ddd]' : ''} underline text-blue-500`}
    >
      <InlineChromiumBugfix />
      {children}
      <InlineChromiumBugfix />
    </a>
  );
};

const MemoExample = ({ value }: { value: Descendant[] }) => {
  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    []
  );
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    []
  );

  const editor = useMemo(() => {
    const e = withHistory(withReact(withInlines(createEditor())));

    const overrideDeleteBackward = (selection: BaseSelection) => {
      if (selection) {
        const [node, path] = Editor.node(e, [0]);

        if (SlateElement.isElement(node) && node.children.length === 1) {
          if (node.children[0].text === '') {
            Transforms.setNodes(
              e,
              {
                type: 'paragraph',
                children: [{ text: '' }],
              },
              { at: path }
            );
          }

          if (
            SlateElement.isElement(node.children[0]) &&
            node.children[0].children.length === 1
          ) {
            const firstChild = node.children[0].children[0];
            if ('text' in firstChild && firstChild.text === '') {
              console.log('masuk sini 2', node);
              Transforms.removeNodes(e, { at: path });
              Transforms.insertNodes(
                e,
                {
                  type: 'paragraph',
                  children: [{ text: '' }],
                },
                { at: path }
              );
              Transforms.select(e, path);
            }
          }
        }
      }
    };

    // Tambahkan normalisasi kustom
    const { deleteBackward, deleteFragment } = e;

    // Override deleteBackward untuk menangani penghapusan
    e.deleteBackward = (...args) => {
      const { selection } = editor;

      // Panggil deleteBackward bawaan terlebih dahulu
      deleteBackward(...args);

      // Cek kondisi setelah penghapusan
      overrideDeleteBackward(selection);
    };

    e.deleteFragment = (...args) => {
      const { selection } = editor;

      // Panggil deleteBackward bawaan terlebih dahulu
      deleteFragment(...args);

      // Cek kondisi setelah penghapusan
      overrideDeleteBackward(selection);
    };

    return e;
  }, []);

  useEffect(() => {
    Transforms.insertNodes(editor, value);
  }, [value]);

  return (
    <Slate
      editor={editor}
      initialValue={value}
      onChange={(e) => {
        console.log(e);
      }}
    >
      <Toolbar>
        <MarkButton format="bold" icon="B" />
        <MarkButton format="italic" icon="I" />
        <MarkButton format="underline" icon="U" />
        <BlockButton format="heading-one" icon="1" />
        <BlockButton format="heading-two" icon="2" />
        <BlockButton format="numbering" icon="n_list" />
        <BlockButton format="bullets" icon="b_list" />
        <BlockButton format="alphabet" icon="a_list" />
        <BlockButton format="left" icon="left" />
        <BlockButton format="center" icon="center" />
        <BlockButton format="right" icon="right" />
        <BlockButton format="justify" icon="justify" />
        <AddLinkButton />
        <RemoveLinkButton />
      </Toolbar>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter some rich text…"
        spellCheck
        autoFocus
        onKeyDown={(event) => {
          // Handle hotkeys
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event as any)) {
              event.preventDefault();
              const mark = HOTKEYS[hotkey as keyof typeof HOTKEYS];
              toggleMark(editor, mark);
            }
          }

          // Handle Shift+Enter dalam list-item
          if (event.shiftKey && event.key === 'Enter') {
            event.preventDefault();
            // Cek apakah kursor berada dalam list-item
            const [match] = Array.from(
              Editor.nodes(editor, {
                match: (n) =>
                  !Editor.isEditor(n) &&
                  SlateElement.isElement(n) &&
                  n.type === 'list-item',
              })
            );

            if (match) {
              // Sisipkan soft break (newline) dalam list-item
              Transforms.insertText(editor, '\n');
            } else {
              // Jika bukan dalam list-item, lakukan default behavior
              Transforms.insertText(editor, '\n');
            }
          }
        }}
      />
    </Slate>
  );
};

const toggleBlock = (editor: Editor, format: any) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
  );
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  });
  let newProperties: Partial<SlateElement>;
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    };
  } else {
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    };
  }
  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor: Editor, format: string, blockType = 'type') => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        (n as any)[blockType] === format,
    })
  );

  return !!match;
};

const isMarkActive = (editor: Editor, format: string) => {
  const marks = Editor.marks(editor);
  return marks
    ? marks[format as keyof Omit<CustomText, 'text'>] === true
    : false;
};

const Element = (props: RenderElementProps) => {
  const { attributes, children, element } = props;
  const style = { textAlign: element.align };
  const childrenArray = React.Children.toArray(children);
  const isChildrenBold = childrenArray.some(
    (child) => React.isValidElement(child) && child.props.text?.bold
  );

  if (element.type === 'list-item') {
    console.log({ attributes, children, element });
  }

  switch (element.type) {
    case 'link':
      return <LinkComponent {...props} />;
    case 'block-quote':
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      );
    case 'bullets':
      return (
        <ul
          className="list-disc"
          style={{ ...style, paddingInlineStart: '40px' }}
          {...attributes}
        >
          {children}
        </ul>
      );
    case 'heading-one':
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      );
    case 'heading-two':
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      );
    case 'list-item':
      return (
        <li
          className={`${isChildrenBold ? 'font-bold' : ''}`}
          style={style}
          {...attributes}
        >
          {children}
        </li>
      );
    case 'numbering':
      return (
        <ol
          className={`list-decimal`}
          style={{ ...style, paddingInlineStart: '40px' }}
          {...attributes}
        >
          {children}
        </ol>
      );
    case 'alphabet':
      return (
        <ol
          className={`list-[lower-alpha]`}
          style={{ ...style, paddingInlineStart: '40px' }}
          {...attributes}
        >
          {children}
        </ol>
      );
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

const BlockButton = ({ format, icon }: { format: string; icon: string }) => {
  const editor = useSlate();
  return (
    <Button
      active={isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
      )}
      onMouseDown={(event: MouseEvent) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
};

const MarkButton = ({ format, icon }: { format: string; icon: string }) => {
  const editor = useSlate();
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={(event: MouseEvent) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
};

// const initialValue: Descendant[] = [
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text': 'Memorandum',
//         'bold': true,
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text': ' ',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text': 'Tanggal    : 03-02-2025',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text':
//           'Tentang    : Implementasi UU Cipta Kerja dan Legalitas Perceraian di Indonesia',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text': ' ',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text': '___________________________________________',
//         'bold': true,
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text': ' ',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text': 'I.   PENDAHULUAN',
//         'bold': true,
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text': ' ',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text':
//           'Memorandum ini membahas dua isu hukum penting di Indonesia: status terkini implementasi Undang-Undang Cipta Kerja dan legalitas perceraian tanpa melaporkan ke negara. UU Cipta Kerja telah disahkan dan beberapa peraturan pelaksana telah diterbitkan, namun masih menghadapi tantangan implementasi. Sementara itu, perceraian di Indonesia hanya sah jika dilakukan melalui prosedur pengadilan yang resmi, dengan konsekuensi hukum yang signifikan jika tidak dipatuhi.',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text': ' ',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text': 'II.   PEMBAHASAN',
//         'bold': true,
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text': ' ',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text':
//           'Berikut adalah pembahasan rinci mengenai kedua isu hukum tersebut:',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text': '',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text': 'a. Status Implementasi UU Cipta Kerja',
//         'bold': true,
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text':
//           'UU Cipta Kerja telah melalui beberapa tahap implementasi sejak disahkan pada 5 Oktober 2020:',
//       },
//     ],
//   },
//   {
//     'type': 'numbering',
//     'children': [
//       {
//         'type': 'list-item',
//         'children': [
//           {
//             'text':
//               'Pengesahan: UU Nomor 11 Tahun 2020 tentang Cipta Kerja telah disahkan oleh DPR.',
//           },
//         ],
//       },
//       {
//         'type': 'list-item',
//         'children': [
//           {
//             'text':
//               'Peraturan Pelaksana: Pemerintah telah menerbitkan beberapa peraturan pelaksana, termasuk:',
//           },
//           // {
//           //   'type': 'paragraph',
//           //   'children': [
//           //     {
//           //       'text':
//           //         '   - PP No. 35 Tahun 2021 tentang PKWT, Alih Daya, Waktu Kerja dan Istirahat, dan PHK.',
//           //     },
//           //   ],
//           // },
//           // {
//           //   'type': 'paragraph',
//           //   'children': [
//           //     {
//           //       'text': '   - PP No. 36 Tahun 2021 tentang Pengupahan.',
//           //     },
//           //   ],
//           // },
//           // {
//           //   'text':
//           //     '   - PP No. 35 Tahun 2021 tentang PKWT, Alih Daya, Waktu Kerja dan Istirahat, dan PHK.',
//           // },
//           // {
//           //   'text': '   - PP No. 36 Tahun 2021 tentang Pengupahan.',
//           // },
//         ],
//       },
//       // {
//       //   'type': 'list-item',
//       //   'children': [
//       //     {
//       //       'text':
//       //         '   - PP No. 35 Tahun 2021 tentang PKWT, Alih Daya, Waktu Kerja dan Istirahat, dan PHK.',
//       //     },
//       //   ],
//       // },
//       // {
//       //   'type': 'list-item',
//       //   'children': [
//       //     {
//       //       'text': '   - PP No. 36 Tahun 2021 tentang Pengupahan.',
//       //     },
//       //   ],
//       // },
//       {
//         'type': 'list-item',
//         'children': [
//           {
//             'text':
//               'Pedoman Pelaksanaan: Kemenaker telah menerbitkan Kepmen No. 104 Tahun 2021 tentang Pedoman Hubungan Kerja selama Pandemi COVID-19.',
//           },
//         ],
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text':
//           'Meskipun demikian, implementasi UU ini masih menghadapi tantangan, termasuk adanya permohonan uji materi ke Mahkamah Konstitusi.',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text': 'b. Legalitas Perceraian Tanpa Melapor ke Negara',
//         'bold': true,
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text':
//           'Perceraian di Indonesia diatur secara ketat oleh hukum negara:',
//       },
//     ],
//   },
//   {
//     'type': 'numbering',
//     'children': [
//       {
//         'type': 'list-item',
//         'children': [
//           {
//             'text':
//               'Dasar Hukum: UU No. 1 Tahun 1974 tentang Perkawinan, Pasal 39 ayat (1) menyatakan bahwa perceraian hanya sah jika dilakukan di depan sidang pengadilan.',
//           },
//         ],
//       },
//       {
//         'type': 'list-item',
//         'children': [
//           {
//             'text':
//               'Konsekuensi Hukum: Perceraian tanpa melalui pengadilan dianggap tidak sah, dengan implikasi:',
//           },
//         ],
//       },
//       {
//         'type': 'list-item',
//         'children': [
//           {
//             'text': '   - Status perkawinan tetap dianggap sah oleh negara.',
//           },
//         ],
//       },
//       {
//         'type': 'list-item',
//         'children': [
//           {
//             'text': '   - Tidak ada pembagian harta gono-gini yang sah.',
//           },
//         ],
//       },
//       {
//         'type': 'list-item',
//         'children': [
//           {
//             'text': '   - Hak-hak anak tidak terjamin secara hukum.',
//           },
//         ],
//       },
//       {
//         'type': 'list-item',
//         'children': [
//           {
//             'text':
//               'Prosedur yang Benar: Perceraian harus diajukan ke Pengadilan Agama (Islam) atau Pengadilan Negeri (non-Muslim) sesuai UU No. 7 Tahun 1989 tentang Peradilan Agama.',
//           },
//         ],
//       },
//       {
//         'type': 'list-item',
//         'children': [
//           {
//             'text':
//               'Sanksi: Meskipun tidak ada sanksi pidana langsung, perceraian di luar pengadilan dapat menimbulkan masalah hukum di kemudian hari.',
//           },
//         ],
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text': ' ',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text': 'III.  KESIMPULAN',
//         'bold': true,
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text': ' ',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text': 'Berdasarkan pembahasan di atas, dapat disimpulkan:',
//       },
//     ],
//   },
//   {
//     'type': 'numbering',
//     'children': [
//       {
//         'type': 'list-item',
//         'children': [
//           {
//             'text':
//               'UU Cipta Kerja telah memasuki tahap implementasi dengan diterbitkannya beberapa peraturan pelaksana. Namun, masih diperlukan pengawasan dan evaluasi berkelanjutan terhadap implementasinya.',
//           },
//         ],
//       },
//       {
//         'type': 'list-item',
//         'children': [
//           {
//             'text':
//               'Perceraian di Indonesia hanya sah jika dilakukan melalui prosedur pengadilan yang resmi. Perceraian tanpa melapor ke negara tidak memiliki kekuatan hukum dan dapat menimbulkan masalah hukum di kemudian hari.',
//           },
//         ],
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text': 'Rekomendasi:',
//       },
//     ],
//   },
//   {
//     'type': 'numbering',
//     'children': [
//       {
//         'type': 'list-item',
//         'children': [
//           {
//             'text':
//               'Pemerintah perlu terus mensosialisasikan dan mengevaluasi implementasi UU Cipta Kerja serta peraturan turunannya untuk memastikan efektivitas dan kepatuhan.',
//           },
//         ],
//       },
//       {
//         'type': 'list-item',
//         'children': [
//           {
//             'text':
//               'Masyarakat harus diedukasi tentang pentingnya melakukan perceraian melalui jalur hukum yang sah untuk melindungi hak-hak semua pihak yang terlibat.',
//           },
//         ],
//       },
//       {
//         'type': 'list-item',
//         'children': [
//           {
//             'text':
//               'Penegak hukum dan lembaga peradilan perlu memastikan proses perceraian yang efisien dan adil sesuai dengan ketentuan hukum yang berlaku.',
//           },
//         ],
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text': ' ',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text': 'LAMPIRAN DASAR HUKUM',
//         'bold': true,
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text': ' ',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text':
//           'Berikut adalah daftar peraturan perundang-undangan yang dirujuk dalam memorandum ini:',
//       },
//     ],
//   },
//   {
//     'type': 'bullets',
//     'children': [
//       {
//         'type': 'list-item',
//         'children': [
//           {
//             'text': 'Undang-Undang Nomor 11 Tahun 2020 tentang Cipta Kerja',
//           },
//         ],
//       },
//       {
//         'type': 'list-item',
//         'children': [
//           {
//             'text': 'Undang-Undang Nomor 1 Tahun 1974 tentang Perkawinan',
//           },
//         ],
//       },
//       {
//         'type': 'list-item',
//         'children': [
//           {
//             'text': 'Undang-Undang Nomor 7 Tahun 1989 tentang Peradilan Agama',
//           },
//         ],
//       },
//       {
//         'type': 'list-item',
//         'children': [
//           {
//             'text':
//               'Peraturan Pemerintah Nomor 35 Tahun 2021 tentang Perjanjian Kerja Waktu Tertentu, Alih Daya, Waktu Kerja dan Waktu Istirahat, dan Pemutusan Hubungan Kerja',
//           },
//         ],
//       },
//       {
//         'type': 'list-item',
//         'children': [
//           {
//             'text':
//               'Peraturan Pemerintah Nomor 36 Tahun 2021 tentang Pengupahan',
//           },
//         ],
//       },
//       {
//         'type': 'list-item',
//         'children': [
//           {
//             'text':
//               'Keputusan Menteri Ketenagakerjaan Nomor 104 Tahun 2021 tentang Pedoman Pelaksanaan Hubungan Kerja Selama Masa Pandemi Corona Virus Disease 2019 (COVID-19)',
//           },
//         ],
//       },
//     ],
//   },
// ];

// const initialValue: Descendant[] = [
//   {
//     type: 'paragraph',
//     children: [
//       {
//         text: 'This is a paragraph',
//       },
//     ],
//   },
//   // {
//   //   type: 'paragraph',
//   //   children: [
//   //     { text: 'This is editable ' },
//   //     { text: 'rich', bold: true },
//   //     { text: ' text, ' },
//   //     { text: 'much', italic: true },
//   //     { text: ' better than a ' },
//   //     { text: '<textarea>' },
//   //     { text: '!' },
//   //   ],
//   // },
//   // {
//   //   type: 'paragraph',
//   //   children: [
//   //     {
//   //       text: "Since it's rich text, you can do things like turn a selection of text ",
//   //     },
//   //     { text: 'bold', bold: true },
//   //     {
//   //       text: ', or add a semantically rendered block quote in the middle of the page, like this:',
//   //     },
//   //   ],
//   // },
//   // {
//   //   type: 'block-quote',
//   //   children: [{ text: 'A wise quote.' }],
//   // },
//   // {
//   //   type: 'paragraph',
//   //   align: 'center',
//   //   children: [{ text: 'Try it out for yourself!' }],
//   // },
// ];

// const initialValuez: Descendant[] = [
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text': 'Memorandum',
//         'bold': true,
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text': ' ',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text': 'Tanggal    : 03-02-2025',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text':
//           'Tentang    : Implementasi UU Cipta Kerja dan Legalitas Perceraian di Indonesia',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text': ' ',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text': '___________________________________________',
//         'bold': true,
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text': ' ',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text': 'I.   PENDAHULUAN',
//         'bold': true,
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text': ' ',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text':
//           'Memorandum ini membahas dua isu hukum penting di Indonesia: status terkini implementasi Undang-Undang Cipta Kerja dan legalitas perceraian tanpa melaporkan ke negara. UU Cipta Kerja telah disahkan dan beberapa peraturan pelaksana telah diterbitkan, namun masih menghadapi tantangan implementasi. Sementara itu, perceraian di Indonesia hanya sah jika dilakukan melalui prosedur pengadilan yang resmi, dengan konsekuensi hukum yang signifikan jika tidak dipatuhi.',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text': ' ',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text': 'II.   PEMBAHASAN',
//         'bold': true,
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text': ' ',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text':
//           'Berikut adalah pembahasan rinci mengenai kedua isu hukum tersebut:',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text': ' ',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text': 'a. Status Implementasi UU Cipta Kerja',
//         'bold': true,
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text':
//           'UU Cipta Kerja telah melalui beberapa tahap implementasi sejak disahkan pada 5 Oktober 2020:',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text':
//           '1. Pengesahan: UU Nomor 11 Tahun 2020 tentang Cipta Kerja telah disahkan oleh DPR.',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text':
//           '2. Peraturan Pelaksana: Pemerintah telah menerbitkan beberapa peraturan pelaksana, termasuk:',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text':
//           '   - PP No. 35 Tahun 2021 tentang PKWT, Alih Daya, Waktu Kerja dan Istirahat, dan PHK.',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text': '   - PP No. 36 Tahun 2021 tentang Pengupahan.',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text':
//           '3. Pedoman Pelaksanaan: Kemenaker telah menerbitkan Kepmen No. 104 Tahun 2021 tentang Pedoman Hubungan Kerja selama Pandemi COVID-19.',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text':
//           'Meskipun demikian, implementasi UU ini masih menghadapi tantangan, termasuk adanya permohonan uji materi ke Mahkamah Konstitusi.',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text': 'b. Legalitas Perceraian Tanpa Melapor ke Negara',
//         'bold': true,
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text':
//           'Perceraian di Indonesia diatur secara ketat oleh hukum negara:',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text':
//           '1. Dasar Hukum: UU No. 1 Tahun 1974 tentang Perkawinan, Pasal 39 ayat (1) menyatakan bahwa perceraian hanya sah jika dilakukan di depan sidang pengadilan.',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text':
//           '2. Konsekuensi Hukum: Perceraian tanpa melalui pengadilan dianggap tidak sah, dengan implikasi:',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text': '   - Status perkawinan tetap dianggap sah oleh negara.',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text': '   - Tidak ada pembagian harta gono-gini yang sah.',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text': '   - Hak-hak anak tidak terjamin secara hukum.',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text':
//           '3. Prosedur yang Benar: Perceraian harus diajukan ke Pengadilan Agama (Islam) atau Pengadilan Negeri (non-Muslim) sesuai UU No. 7 Tahun 1989 tentang Peradilan Agama.',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text':
//           '4. Sanksi: Meskipun tidak ada sanksi pidana langsung, perceraian di luar pengadilan dapat menimbulkan masalah hukum di kemudian hari.',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text': ' ',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text': 'III.  KESIMPULAN',
//         'bold': true,
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text': ' ',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text': 'Berdasarkan pembahasan di atas, dapat disimpulkan:',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text':
//           '1. UU Cipta Kerja telah memasuki tahap implementasi dengan diterbitkannya beberapa peraturan pelaksana. Namun, masih diperlukan pengawasan dan evaluasi berkelanjutan terhadap implementasinya.',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text':
//           '2. Perceraian di Indonesia hanya sah jika dilakukan melalui prosedur pengadilan yang resmi. Perceraian tanpa melapor ke negara tidak memiliki kekuatan hukum dan dapat menimbulkan masalah hukum di kemudian hari.',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text': 'Rekomendasi:',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text':
//           '1. Pemerintah perlu terus mensosialisasikan dan mengevaluasi implementasi UU Cipta Kerja serta peraturan turunannya untuk memastikan efektivitas dan kepatuhan.',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text':
//           '2. Masyarakat harus diedukasi tentang pentingnya melakukan perceraian melalui jalur hukum yang sah untuk melindungi hak-hak semua pihak yang terlibat.',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text':
//           '3. Penegak hukum dan lembaga peradilan perlu memastikan proses perceraian yang efisien dan adil sesuai dengan ketentuan hukum yang berlaku.',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text': ' ',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text': 'LAMPIRAN DASAR HUKUM',
//         'bold': true,
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text': ' ',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'text':
//           'Berikut adalah daftar peraturan perundang-undangan yang dirujuk dalam memorandum ini:',
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'type': 'link',
//         'url': 'https://www.google.com',
//         'children': [
//           {
//             'text': '- Undang-Undang Nomor 11 Tahun 2020 tentang Cipta Kerja',
//           },
//         ],
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'type': 'link',
//         'url': 'https://www.google.com',
//         'children': [
//           {
//             'text': '- Undang-Undang Nomor 1 Tahun 1974 tentang Perkawinan',
//           },
//         ],
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'type': 'link',
//         'url': 'https://www.google.com',
//         'children': [
//           {
//             'text':
//               '- Undang-Undang Nomor 7 Tahun 1989 tentang Peradilan Agama',
//           },
//         ],
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'type': 'link',
//         'url': 'https://www.google.com',
//         'children': [
//           {
//             'text':
//               '- Peraturan Pemerintah Nomor 35 Tahun 2021 tentang Perjanjian Kerja Waktu Tertentu, Alih Daya, Waktu Kerja dan Waktu Istirahat, dan Pemutusan Hubungan Kerja',
//           },
//         ],
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'type': 'link',
//         'url': 'https://www.google.com',
//         'children': [
//           {
//             'text':
//               '- Peraturan Pemerintah Nomor 36 Tahun 2021 tentang Pengupahan',
//           },
//         ],
//       },
//     ],
//   },
//   {
//     'type': 'paragraph',
//     'children': [
//       {
//         'type': 'link',
//         'url': 'https://www.google.com',
//         'children': [
//           {
//             'text':
//               '- Keputusan Menteri Ketenagakerjaan Nomor 104 Tahun 2021 tentang Pedoman Pelaksanaan Hubungan Kerja Selama Masa Pandemi Corona Virus Disease 2019 (COVID-19)',
//           },
//         ],
//       },
//     ],
//   },
// ];

export default MemoExample;
