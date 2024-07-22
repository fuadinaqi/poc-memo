'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createEditor } from 'slate';
import { BaseEditor, Descendant, Node } from 'slate';
import {
  ReactEditor,
  Slate,
  Editable,
  withReact,
  RenderElementProps,
  RenderLeafProps,
} from 'slate-react';
import Toolbar from '../_components/toolbar';
import Add from '../_components/add';
import SmartdocEditor from '../_components/editor';
import { SmartdocViewText } from '../_components/view';
import SmartdocProvider, {
  Alphabet,
  Ayat,
  Bab,
  Bagian,
  Bullet,
  Numbering,
  Paragraf,
  Pasal,
  SmartdocEditorType,
  TextContent,
  useSmartdocContext,
} from '../_providers/SmartdocProvider';

export default function Page() {
  return (
    <SmartdocProvider>
      <Component />
    </SmartdocProvider>
  );
}

function Component() {
  const {
    badan,
    activePosition,
    setActivePosition,
    hoverPosition,
    setHoverPosition,
  } = useSmartdocContext();

  // const [hoverPosition, setHoverPosition] = useState<
  //   'pembukaan' | 'judul' | 'doa' | 'doa_numbering' | 'menimbang' | 'mengingat'
  // >();
  // const [activePosition, setActivePosition] = useState<
  //   'pembukaan' | 'judul' | 'doa' | 'doa_numbering' | 'menimbang' | 'mengingat'
  // >();
  // const [indexHoverPosition, setIndexHoverPosition] = useState<number>(0);
  // const [indexActivePosition, setIndexActivePosition] = useState<number>(0);

  const parentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (parentRef.current && !parentRef.current.contains(e.target as any)) {
        setActivePosition('');
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);
  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      if (parentRef.current && !parentRef.current.contains(e.target as any)) {
        setHoverPosition('');
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    return () => document.removeEventListener('mouseover', handleMouseOver);
  }, []);

  // useEffect(() => {
  //   if (activePosition) {
  //     Transforms.select(editor, {
  //       offset: 0,
  //       path: [0, 0],
  //     });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [activePosition]);

  // const onAddNumbering = () => {
  //   setData((prev) => {
  //     const newNumbering: Descendant[][] | undefined = [
  //       ...(prev.doa.numbering ?? []),
  //       [
  //         {
  //           type: 'paragraph',
  //           children: [{ text: '' }],
  //         },
  //       ],
  //     ];
  //     return {
  //       ...prev,
  //       doa: {
  //         ...prev.doa,
  //         numbering: newNumbering,
  //       },
  //     };
  //   });
  //   setTimeout(() => {
  //     setActivePosition('doa_numbering');
  //     const numberingLength = data.doa.numbering?.length || 0;
  //     setIndexActivePosition(numberingLength - 1);
  //   }, 500);
  // };

  const renderTextContent = (
    text: TextContent,
    elementType: SmartdocEditorType,
    index?: number
  ) => {
    return (
      <fieldset
        className={`
          border cursor-pointer
          ${activePosition === text.id || hoverPosition === text.id ? 'border-blue-400' : 'border-transparent'}
        `}
        onClick={(e) => {
          e.stopPropagation();
          setActivePosition(text.id);
        }}
        onMouseOver={(e) => {
          e.stopPropagation();
          setHoverPosition(text.id);
        }}
      >
        {/* <legend className="ps-1 pe-1">TextContent</legend> */}
        <p className="cursor-text">
          {text?.text?.map((textItem) => {
            return textItem.children.map((text, i) => {
              return (
                <SmartdocViewText
                  key={i}
                  text={text}
                  elementType={elementType}
                  index={typeof index === 'number' ? index + 1 : undefined}
                />
              );
            });
          })}
        </p>

        {text?.alphabet ? renderAlphabet(text.alphabet) : null}
        {text?.bullet ? renderBullet(text.bullet) : null}
      </fieldset>
    );
  };

  const renderAlphabet = (alphabet: Alphabet) => {
    return (
      <fieldset
        className={`
          border cursor-pointer
          ${activePosition === alphabet.id || hoverPosition === alphabet.id ? 'border-blue-400' : 'border-transparent'}
        `}
        onClick={(e) => {
          e.stopPropagation();
          setActivePosition(alphabet.id);
        }}
        onMouseOver={(e) => {
          e.stopPropagation();
          setHoverPosition(alphabet.id);
        }}
      >
        {/* <legend className="ps-1 pe-1">Alphabet</legend> */}
        <ol className="list-decimal list-inside">
          {alphabet?.list?.map((alphabetItem, alphabetIndex) => {
            return renderTextContent(alphabetItem, 'alphabet', alphabetIndex);
            // return (
            //   <li key={alphabetIndex}>
            //     {renderTextContent(alphabetItem, 'alphabet', alphabetIndex)}
            //   </li>
            // );
          })}
        </ol>
      </fieldset>
    );
  };

  const renderBullet = (bullet: Bullet) => {
    return (
      <fieldset
        className={`
          border cursor-pointer
          ${activePosition === bullet.id || hoverPosition === bullet.id ? 'border-blue-400' : 'border-transparent'}
        `}
        onClick={(e) => {
          e.stopPropagation();
          setActivePosition(bullet.id);
        }}
        onMouseOver={(e) => {
          e.stopPropagation();
          setHoverPosition(bullet.id);
        }}
      >
        {/* <legend className="ps-1 pe-1">Bullet</legend> */}
        <ul className="list-disc list-inside">
          {bullet?.list?.map((bulletItem, bulletIndex) => {
            return renderTextContent(bulletItem, 'bullet');
          })}
        </ul>
      </fieldset>
    );
  };

  const renderNumbering = (numbering: Numbering) => {
    return (
      <fieldset
        className={`
          border cursor-pointer
          ${activePosition === numbering.id || hoverPosition === numbering.id ? 'border-blue-400' : 'border-transparent'}
        `}
        onClick={(e) => {
          e.stopPropagation();
          setActivePosition(numbering.id);
        }}
        onMouseOver={(e) => {
          e.stopPropagation();
          setHoverPosition(numbering.id);
        }}
      >
        {/* <legend className="ps-1 pe-1">TextContent</legend> */}
        <ol className="list-decimal list-inside">
          {numbering?.list?.map((numberingItem, numberingIndex) => {
            return renderTextContent(
              numberingItem,
              'numbering',
              numberingIndex
            );
            // return (
            //   <li key={numberingIndex}>
            //     {renderTextContent(numberingItem, 'numbering')}
            //   </li>
            // );
          })}
        </ol>
      </fieldset>
    );
  };

  const renderAyat = (ayat: Ayat, index: number) => {
    return (
      <fieldset
        className={`
          border cursor-pointer
          ${activePosition === ayat.id || hoverPosition === ayat.id ? 'border-blue-400' : 'border-transparent'}
        `}
        onClick={(e) => {
          e.stopPropagation();
          setActivePosition(ayat.id);
        }}
        onMouseOver={(e) => {
          e.stopPropagation();
          setHoverPosition(ayat.id);
        }}
      >
        {/* <legend className="ps-1 pe-1 text-center">Ayat - {ayat.id}</legend> */}

        <div className="flex gap-1.5">
          <span className="cursor-text text-center">({index + 1})&nbsp;</span>
          <p className="cursor-text">
            {ayat?.text?.map((ayatItem, indexItem) => {
              return ayatItem.children.map((text, i) => {
                return (
                  <SmartdocViewText
                    key={i}
                    text={text}
                    elementType="ayat"
                    // index={index + 1}
                  />
                );
              });
            })}
          </p>
        </div>

        <div className="ml-8">
          {ayat?.list?.map((itemAyat, i) => {
            if (itemAyat.type === 'numbering') {
              return renderNumbering(itemAyat);
            }
            if (itemAyat.type === 'alphabet') {
              return renderAlphabet(itemAyat);
            }
            if (itemAyat.type === 'bullet') {
              return renderBullet(itemAyat);
            }
            return null;
          })}
        </div>
      </fieldset>
    );
  };

  const renderPasal = (pasal: Pasal) => {
    return (
      <fieldset
        className={`
          border p-1 cursor-pointer
          ${activePosition === pasal.id || hoverPosition === pasal.id ? 'border-blue-400' : 'border-transparent'}
        `}
        onClick={(e) => {
          e.stopPropagation();
          setActivePosition(pasal.id);
        }}
        onMouseOver={(e) => {
          e.stopPropagation();
          setHoverPosition(pasal.id);
        }}
      >
        <legend className="ps-1 pe-1 text-center">{pasal.title}</legend>

        <p className="cursor-text">
          {pasal.text?.map((textItem, indexItem) => {
            return textItem.children.map((text, i) => {
              return <SmartdocViewText key={i} text={text} />;
            });
          })}
        </p>

        {pasal?.list?.map((itemPasal, i) => {
          if (itemPasal.type === 'ayat') {
            return renderAyat(itemPasal, i);
          }
          if (itemPasal.type === 'numbering') {
            return renderNumbering(itemPasal);
          }
          if (itemPasal.type === 'alphabet') {
            return renderAlphabet(itemPasal);
          }
          if (itemPasal.type === 'bullet') {
            return renderBullet(itemPasal);
          }
          return null;
        })}
      </fieldset>
    );
  };

  const renderParagraf = (paragraf: Paragraf) => {
    return (
      <fieldset
        className={`
          border p-1 cursor-pointer
          ${activePosition === paragraf.id || hoverPosition === paragraf.id ? 'border-blue-400' : 'border-transparent'}
        `}
        onClick={(e) => {
          e.stopPropagation();
          setActivePosition(paragraf.id);
        }}
        onMouseOver={(e) => {
          e.stopPropagation();
          setHoverPosition(paragraf.id);
        }}
      >
        <legend className="ps-1 pe-1 text-center">{paragraf.title}</legend>

        <p className="cursor-text text-center">
          {paragraf.text?.map((textItem, indexItem) => {
            return textItem.children.map((text, i) => {
              return <SmartdocViewText key={i} text={text} />;
            });
          })}
        </p>

        {paragraf?.list?.map((itemParagraf, indexParagraf) => {
          if (itemParagraf.type === 'pasal') {
            return renderPasal(itemParagraf);
          }
          return null;
        })}
      </fieldset>
    );
  };

  const renderBagian = (bagian: Bagian) => {
    return (
      <fieldset
        className={`
          border p-1 cursor-pointer
          ${activePosition === bagian.id || hoverPosition === bagian.id ? 'border-blue-400' : 'border-transparent'}
        `}
        onClick={(e) => {
          e.stopPropagation();
          setActivePosition(bagian.id);
        }}
        onMouseOver={(e) => {
          e.stopPropagation();
          setHoverPosition(bagian.id);
        }}
      >
        <legend className="ps-1 pe-1 text-center">{bagian.title}</legend>

        <h2 className="cursor-text text-center">
          {bagian.text?.map((textItem, indexItem) => {
            return textItem.children.map((text, i) => {
              return <SmartdocViewText key={i} text={text} />;
            });
          })}
        </h2>

        {bagian?.list?.map((itemBagian, indexBagian) => {
          if (itemBagian.type === 'pasal') {
            return renderPasal(itemBagian);
          }
          if (itemBagian.type === 'paragraf') {
            return renderParagraf(itemBagian);
          }
          return null;
        })}
      </fieldset>
    );
  };

  const renderBadan = (
    item: Bab | Bagian | Paragraf | Pasal,
    index?: number
  ) => {
    return (
      <fieldset
        key={index}
        className={`
          border p-1 cursor-pointer
          ${activePosition === item.id || hoverPosition === item.id ? 'border-blue-400' : 'border-transparent'}
        `}
        onClick={(e) => {
          e.stopPropagation();
          setActivePosition(item.id);
        }}
        onMouseOver={(e) => {
          e.stopPropagation();
          setHoverPosition(item.id);
        }}
      >
        <legend className="ps-1 pe-1 uppercase text-center">
          {item.title}
        </legend>

        <h1 className="cursor-text text-center">
          {item.text?.map((textItem, indexItem) => {
            return textItem.children.map((text, i) => {
              return <SmartdocViewText key={i} text={text} />;
            });
          })}
        </h1>

        {item?.list?.map((itemBadan, i) => {
          if (itemBadan.type === 'bagian') {
            return renderBagian(itemBadan);
          }
          if (itemBadan.type === 'paragraf') {
            return renderParagraf(itemBadan);
          }
          if (itemBadan.type === 'pasal') {
            return renderPasal(itemBadan);
          }
          if (itemBadan.type === 'ayat') {
            return renderAyat(itemBadan, i);
          }
          if (itemBadan.type === 'numbering') {
            return renderNumbering(itemBadan);
          }
          if (itemBadan.type === 'alphabet') {
            return renderAlphabet(itemBadan);
          }
          if (itemBadan.type === 'bullet') {
            return renderBullet(itemBadan);
          }
          return null;
        })}
      </fieldset>
    );
  };

  return (
    <div ref={parentRef} className="mt-8 mx-auto w-[712px]">
      <fieldset
        className={`
          border p-1 cursor-pointer
          ${activePosition === 'badan' || hoverPosition === 'badan' ? 'border-blue-400' : 'border-transparent'}
        `}
        onClick={(e) => {
          e.stopPropagation();
          setActivePosition('badan');
        }}
        onMouseOver={(e) => {
          e.stopPropagation();
          setHoverPosition('badan');
        }}
      >
        <legend className="ps-1 pe-1">Badan</legend>

        {badan?.map((itemBadan, indexBadan) =>
          renderBadan(itemBadan, indexBadan)
        )}
      </fieldset>
      {/* <fieldset
          className={`
          border p-1 cursor-pointer
          ${activePosition === 'pembukaan' || hoverPosition === 'pembukaan' ? 'border-blue-400' : 'border-transparent'}
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
          <legend className="ps-1 pe-1">Pembuka</legend>

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
              ${activePosition === 'judul' || hoverPosition === 'judul' ? 'border-blue-400' : 'border-transparent'}
            `}
            >
              <legend className="ps-1 pe-1">Judul</legend>
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
              ${activePosition === 'doa' || hoverPosition === 'doa' ? 'border-blue-400' : 'border-transparent'}
            `}
            >
              <legend className="ps-1 pe-1">Doa</legend>
              {activePosition === 'doa' ? (
                <SmartdocEditor
                  initialValue={data.doa.text}
                  onChange={(value) =>
                    setData({ ...data, doa: { ...data.doa, text: value } })
                  }
                />
              ) : (
                <p id="hol-doa-readonly" className="cursor-text text-center">
                  {data.doa.text.map((node: any) => {
                    return (
                      <>
                        {node.children.map((text: CustomText, i: number) => {
                          return <SmartdocViewText key={i} text={text} />;
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
                    ${(activePosition === 'doa_numbering' || hoverPosition === 'doa_numbering') && (i === indexActivePosition || i === indexHoverPosition) ? 'border-blue-400' : 'border-transparent'}
                  `}
                  >
                    <legend className="ps-1 pe-1">Numbering</legend>
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
        </fieldset> */}
    </div>
  );
}
