'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createEditor, Transforms } from 'slate';
import { BaseEditor, Descendant, Node } from 'slate';
import {
  ReactEditor,
  Slate,
  Editable,
  withReact,
  RenderElementProps,
  RenderLeafProps,
} from 'slate-react';
import Toolbar, { CustomEditor } from './_components/toolbar';
import Add from './_components/add';

type CustomElement = { type: 'paragraph' | 'title'; children: CustomText[] };
type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
};

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

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

export default function Page() {
  const [editor] = useState(() => withReact(createEditor()));

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

  const [data, setData] = useState<{
    judul: Descendant[];
    doa: {
      text: Descendant[];
      numbering?: Array<Descendant[]>;
    };
    menimbang: Array<Descendant[]>;
    mengingat: Descendant[];
  }>({
    judul: [
      {
        type: 'title',
        children: [
          {
            text: 'UNDANG-UNDANG REPUBLIK INDONESIA NOMOR 13 TAHUN 2003 TENTANG KETENAGAKERJAAN',
          },
        ],
      },
    ],
    doa: {
      text: [
        {
          type: 'paragraph',
          children: [
            {
              text: 'DENGAN RAHMAT TUHAN YANG MAHA ESA PRESIDEN REPUBLIK INDONESIA',
            },
          ],
        },
      ],
    },
    menimbang: [
      [
        {
          type: 'paragraph',
          children: [
            {
              text: 'Bahwa pembangunan nasional dilaksanakan dalam rangka pembangunan manusia Indonesia seutuhnya dan pembangunan masyarakat Indonesia seluruhnya untuk mewujudkan masyarakat yang sejahtera, adil, makmur, yang merata, baik materiil maupun spiritual berdasarkan Pancasila dan ',
            },
            {
              text: 'Undang-Undang Dasar Negara Republik Indonesia Tahun 1945',
              underline: true,
            },
            {
              text: ';',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              text: 'Bahwa dalam pelaksanaan pembangunan nasional, tenaga kerja mempunyai peranan dan kedudukan yang sangat penting sebagai pelaku dan tujuan pembangunan;',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              text: 'Bahwa sesuai dengan peranan dan kedudukan tenaga kerja, diperlukan pembangunan ketenagakerjaan untuk meningkatkan kualitas tenaga kerja dan peran sertanya dalam pembangunan serta peningkatan perlindungan tenaga kerja dan keluarganya sesuai dengan harkat dan martabat kemanusiaan;',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              text: 'Bahwa perlindungan terhadap tenaga kerja dimaksudkan untuk menjamin hak-hak dasar pekerja/buruh dan menjamin kesamaan kesempatan serta perlakuan tanpa diskriminasi atas dasar apapun untuk mewujudkan kesejahteraan pekerja/buruh dan keluarganya dengan tetap memperhatikan perkembangan kemajuan dunia usaha;',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              text: 'Bahwa beberapa Undang-Undang di bidang ketenagakerjaan dipandang sudah tidak sesuai lagi dengan kebutuhan dan tuntutan pembangunan ketenagakerjaan, oleh karena itu perlu dicabut dan/atau ditarik kembali;',
            },
          ],
        },
      ],
    ],
    mengingat: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Pasal 5 ayat (1), Pasal 20 ayat (2), Pasal 27 ayat (2), Pasal 28, dan Pasal 33 ayat (1) ',
          },
          {
            text: 'Undang-Undang Dasar Negara Republik Indonesia Tahun 1945',
            underline: true,
          },
          {
            text: '.',
          },
        ],
      },
    ],
  });

  const [hoverPosition, setHoverPosition] = useState<
    'pembukaan' | 'judul' | 'doa' | 'doa_numbering' | 'menimbang' | 'mengingat'
  >();
  const [activePosition, setActivePosition] = useState<
    'pembukaan' | 'judul' | 'doa' | 'doa_numbering' | 'menimbang' | 'mengingat'
  >();
  const [indexHoverPosition, setIndexHoverPosition] = useState<number>(0);
  const [indexActivePosition, setIndexActivePosition] = useState<number>(0);

  const parentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (parentRef.current && !parentRef.current.contains(e.target as any)) {
        setActivePosition(undefined);
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);
  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      if (parentRef.current && !parentRef.current.contains(e.target as any)) {
        setHoverPosition(undefined);
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    return () => document.removeEventListener('mouseover', handleMouseOver);
  }, []);

  useEffect(() => {
    if (activePosition) {
      Transforms.select(editor, {
        offset: 0,
        path: [0, 0],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePosition]);

  const onAddNumbering = () => {
    setData((prev) => {
      const newNumbering: Descendant[][] | undefined = [
        ...(prev.doa.numbering ?? []),
        [
          {
            type: 'paragraph',
            children: [{ text: '' }],
          },
        ],
      ];
      return {
        ...prev,
        doa: {
          ...prev.doa,
          numbering: newNumbering,
        },
      };
    });
    setTimeout(() => {
      setActivePosition('doa_numbering');
      const numberingLength = data.doa.numbering?.length || 0;
      setIndexActivePosition(numberingLength - 1);
    }, 500);
  };

  return (
    <div ref={parentRef} className="mt-8 mx-auto w-[712px]">
      <fieldset
        className={`
          border p-3 cursor-pointer
          ${activePosition === 'pembukaan' || hoverPosition === 'pembukaan' ? 'border-blue-400' : 'border-neutral-400'}
        `}
        onClick={(e) => {
          e.stopPropagation();
          setActivePosition('pembukaan');
        }}
        onMouseOver={(e) => {
          e.stopPropagation();
          setHoverPosition('pembukaan');
        }}
      >
        <legend className="ps-2 pe-2">Pembuka</legend>

        {/* START JUDUL */}
        <div
          className="relative"
          onClick={(e) => {
            e.stopPropagation();
            setActivePosition('judul');
          }}
          onMouseOver={(e) => {
            e.stopPropagation();
            setHoverPosition('judul');
          }}
        >
          <fieldset
            className={`
              px-4 py-2 border cursor-pointer
              ${activePosition === 'judul' || hoverPosition === 'judul' ? 'border-blue-400' : 'border-neutral-400'}
            `}
          >
            <legend className="ps-2 pe-2">Judul</legend>
            {activePosition === 'judul' ? (
              <Slate
                editor={editor}
                initialValue={data.judul}
                onChange={(value) => setData({ ...data, judul: value })}
              >
                <Editable
                  className={`
                    w-full h-full m-0 p-0 focus:outline-none cursor-text
                  `}
                  renderElement={renderElement}
                  renderLeaf={renderLeaf}
                  autoFocus
                />
              </Slate>
            ) : (
              <h1
                id="hol-judul-readonly"
                className="font-bold text-center cursor-text"
              >
                {data.judul.map((node) => Node.string(node)).join('')}
              </h1>
            )}
          </fieldset>
        </div>
        {/* END JUDUL */}

        {/* START DOA */}
        <div
          className="relative"
          onClick={(e) => {
            e.stopPropagation();
            setActivePosition('doa');
          }}
          onMouseOver={(e) => {
            e.stopPropagation();
            setHoverPosition('doa');
          }}
        >
          <fieldset
            className={`
              px-4 py-2 border cursor-pointer
              ${activePosition === 'doa' || hoverPosition === 'doa' ? 'border-blue-400' : 'border-neutral-400'}
            `}
          >
            <legend className="ps-2 pe-2">Doa</legend>
            {activePosition === 'doa' ? (
              <Slate
                editor={editor}
                initialValue={data.doa.text}
                onChange={(value) =>
                  setData({ ...data, doa: { ...data.doa, text: value } })
                }
              >
                <Editable
                  className={`
                    w-full h-full m-0 p-0 focus:outline-none cursor-text text-center
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
            ) : (
              <p id="hol-doa-readonly" className="cursor-text text-center">
                {data.doa.text.map((node: any) => {
                  return (
                    <>
                      {node.children.map((text: CustomText, i: number) => {
                        return (
                          <span
                            key={i}
                            className={`
                          ${text.bold ? 'font-bold' : ''}
                          ${text.italic ? 'italic' : ''}
                          ${text.underline ? 'underline' : ''}
                        `}
                          >
                            {text.text}
                          </span>
                        );
                      })}
                      <br />
                    </>
                  );
                })}
              </p>
            )}

            {data.doa.numbering?.map((numbering, i) => (
              <div
                key={i}
                className="relative"
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePosition('doa_numbering');
                  setIndexActivePosition(i);
                }}
                onMouseOver={(e) => {
                  e.stopPropagation();
                  setHoverPosition('doa_numbering');
                  setIndexHoverPosition(i);
                }}
              >
                <fieldset
                  className={`
                    px-4 py-2 border cursor-pointer
                    ${(activePosition === 'doa_numbering' || hoverPosition === 'doa_numbering') && (i === indexActivePosition || i === indexHoverPosition) ? 'border-blue-400' : 'border-neutral-400'}
                  `}
                >
                  <legend className="ps-2 pe-2">Numbering</legend>
                  {activePosition === 'doa_numbering' &&
                  i === indexActivePosition ? (
                    <Slate
                      editor={editor}
                      initialValue={numbering}
                      onChange={(value) => {
                        setData((prev) => ({
                          ...prev,
                          doa: {
                            ...prev.doa,
                            numbering: prev.doa.numbering?.map((n, j) =>
                              j === i ? value : n
                            ),
                          },
                        }));
                      }}
                    >
                      <Editable
                        className={`
                          w-full h-full m-0 p-0 focus:outline-none cursor-text
                        `}
                        renderElement={renderElement}
                        renderLeaf={renderLeaf}
                        autoFocus
                      />
                    </Slate>
                  ) : (
                    <p
                      id={`hol-doa-numbering-${i}`}
                      className="cursor-text flex gap-2"
                    >
                      <span>{i + 1}. </span>
                      <div>
                        {numbering.map((node: any) => {
                          return (
                            <>
                              {node.children.map((text: CustomText) => {
                                return (
                                  <>
                                    <span
                                      className={`
                                        ${text.bold ? 'font-bold' : ''}
                                        ${text.italic ? 'italic' : ''}
                                        ${text.underline ? 'underline' : ''}
                                      `}
                                    >
                                      {text.text}
                                    </span>
                                    <br />
                                  </>
                                );
                              })}
                            </>
                          );
                        })}
                      </div>
                    </p>
                  )}
                </fieldset>
              </div>
            ))}
          </fieldset>
          {activePosition === 'doa' && <Toolbar editor={editor} />}
          {activePosition === 'doa' && <Add onClick={onAddNumbering} />}
        </div>
        {/* END DOA */}
      </fieldset>
    </div>
  );
}
