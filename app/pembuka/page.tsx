'use client';

import { act, useCallback, useEffect, useRef, useState } from 'react';
import { createEditor, last } from 'slate';
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
  CustomElement,
  Menimbang,
  Numbering,
  Paragraf,
  Pasal,
  SmartdocEditorType,
  TextContent,
  useSmartdocContext,
} from '../_providers/SmartdocProvider';
import { numberToRoman, romanToNumber } from '../_utils/roman';
import { numberToSentence, sentenceToNumber } from '../_utils/sentence';

function deepCopy(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

const findElement = (arr: any[], id: string): any => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === id) {
      return arr[i];
    }
    if (arr[i].list) {
      const found = findElement(arr[i].list, id);
      if (found) {
        return found;
      }
    }
  }
  return null;
};

export default function Page() {
  return (
    <SmartdocProvider>
      <Component />
    </SmartdocProvider>
  );
}

function Component() {
  const {
    pembukaan,
    setPembukaan,
    activePosition,
    setActivePosition,
    hoverPosition,
    setHoverPosition,
    getLastElement,
    selectedBlock,
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      if (parentRef.current && !parentRef.current.contains(e.target as any)) {
        setHoverPosition('');
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    return () => document.removeEventListener('mouseover', handleMouseOver);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [jsonValue, setJsonValue] = useState<string>('');

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

  const onChange = ({
    id,
    value,
    elementType,
  }: {
    id: string;
    elementType?: SmartdocEditorType;
    value: CustomElement[];
  }) => {
    // setPembukaan((prevPembukaan) => {
    //   const newPembukaan = deepCopy(prevPembukaan);
    //   // const findElement = (arr: any[], id: string): any => {
    //   //   for (let i = 0; i < arr.length; i++) {
    //   //     if (arr[i].id === id) {
    //   //       return arr[i];
    //   //     }
    //   //     if (arr[i].list) {
    //   //       const found = findElement(arr[i].list, id);
    //   //       if (found) {
    //   //         return found;
    //   //       }
    //   //     }
    //   //   }
    //   //   return null;
    //   // };
    //   const element = findElement(newPembukaan, id);
    //   const parentElement = findElement(
    //     newPembukaan,
    //     id?.split('-')?.slice(0, -1).join('-')
    //   );
    //   const isDeletedValue =
    //     value.length === 1 &&
    //     value[0].children.length === 1 &&
    //     value[0].children[0].text === '';
    //   if (isDeletedValue && parentElement) {
    //     parentElement.list = parentElement.list.filter(
    //       (item: any) => item.id !== id
    //     );
    //   } else {
    //     element.text = value;
    //   }
    //   return newPembukaan;
    // });
  };

  const onAdd = (elementType: SmartdocEditorType) => {
    //
  };

  const renderTextContent = (
    text: TextContent,
    elementType: SmartdocEditorType,
    index?: number
  ) => {
    return (
      <fieldset
        className={`
          relative border cursor-pointer
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

        {activePosition === text.id ? (
          <SmartdocEditor
            elementType={elementType}
            initialValue={text.text ?? []}
            onChange={(v) => {
              const value: CustomElement[] = v as CustomElement[];

              onChange({
                id: text.id,
                elementType,
                value,
              });
            }}
          />
        ) : (
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
        )}

        {text?.alphabet ? renderAlphabet(text.alphabet) : null}
        {text?.bullet ? renderBullet(text.bullet) : null}
      </fieldset>
    );
  };

  const renderAlphabet = (alphabet: Alphabet) => {
    return (
      <fieldset
        className={`
          relative border p-2 cursor-pointer
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
            // return renderTextContent(alphabetItem, 'alphabet', alphabetIndex);
            return (
              <li key={alphabetIndex} className="flex">
                <span className="cursor-text w-6">{`${String.fromCharCode(96 + alphabetIndex + 1)}. `}</span>
                {renderTextContent(alphabetItem, 'alphabet', alphabetIndex)}
              </li>
            );
          })}
        </ol>

        {activePosition === alphabet.id && (
          <Add elementType="alphabet" onClick={onAdd} />
        )}
      </fieldset>
    );
  };

  const renderBullet = (bullet: Bullet) => {
    return (
      <fieldset
        className={`
          relative border p-2 cursor-pointer
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
            return (
              <li className="flex" key={`${bulletItem.id}-${bulletIndex}`}>
                <span className="cursor-text w-6">&bull;&nbsp;</span>
                {renderTextContent(bulletItem, 'bullet')}
              </li>
            );
          })}
        </ul>

        {activePosition === bullet.id && (
          <Add elementType="bullet" onClick={onAdd} />
        )}
      </fieldset>
    );
  };

  const renderNumbering = (numbering: Numbering) => {
    return (
      <fieldset
        className={`
          relative border p-2 cursor-pointer
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
            return (
              <li
                className="flex"
                key={`${numberingItem.id}-${numberingIndex}`}
              >
                <span className="cursor-text w-6">
                  {numberingIndex + 1}.&nbsp;
                </span>
                {renderTextContent(numberingItem, 'numbering', numberingIndex)}
              </li>
            );
            // return (
            //   <li key={numberingIndex}>
            //     {renderTextContent(numberingItem, 'numbering')}
            //   </li>
            // );
          })}
        </ol>

        {activePosition === numbering.id && (
          <Add elementType="numbering" onClick={onAdd} />
        )}
      </fieldset>
    );
  };

  // const renderJudul = () => {
  //   return (
  //     <fieldset
  //       className={`
  //         relative border p-1 cursor-pointer
  //         ${activePosition === pembukaan?.judul?.id || hoverPosition === pembukaan?.judul?.id ? 'border-blue-400' : 'border-transparent'}
  //       `}
  //       onClick={(e) => {
  //         e.stopPropagation();
  //         setActivePosition(pembukaan?.judul?.id);
  //       }}
  //       onMouseOver={(e) => {
  //         e.stopPropagation();
  //         setHoverPosition(pembukaan?.judul?.id);
  //       }}
  //     >
  //       <legend className="ps-1 pe-1 uppercase text-center">
  //         {activePosition === pembukaan?.judul?.id ? (
  //           <SmartdocEditor
  //             elementType={pembukaan?.judul?.type}
  //             initialValue={[
  //               {
  //                 type: 'title',
  //                 children: [{ text: pembukaan?.judul?.hierarki }],
  //               },
  //             ]}
  //             onChange={(v) => {
  //               const value: CustomElement[] = v as CustomElement[];

  //               onChange({
  //                 id: pembukaan?.judul?.id,
  //                 elementType: pembukaan?.judul?.type,
  //                 value,
  //               });
  //             }}
  //           />
  //         ) : (
  //           <h1 className="cursor-text text-center uppercase font-bold">
  //             {pembukaan?.judul?.hierarki}
  //             <br />
  //             NOMOR {pembukaan?.judul?.nomor}
  //           </h1>
  //         )}
  //       </legend>
  //     </fieldset>
  //   );
  // };

  return (
    <div className="mt-8 mx-auto w-[1096px] flex gap-2">
      <form className="w-[384px] h-[712px]">
        <textarea
          placeholder="Type json pembuka here;"
          className="w-full p-2 border border-blue-500"
          onChange={(e) => {
            // console.log(e.target.value);
            // console.log(JSON.parse(e.target.value));
            setJsonValue(e.target.value);
          }}
          rows={20}
        />
        <button
          type="button"
          className="w-full p-2 bg-blue-500 text-white"
          onClick={() => {
            let a;
            try {
              a = JSON.parse(jsonValue);
              setPembukaan(a);
            } catch (e) {
              alert('Invalid JSON');
              return console.error(e); // error in the above string (in this case, yes)!
            }
          }}
        >
          Submit
        </button>
      </form>
      <div ref={parentRef} className="w-[712px]">
        <fieldset
          className={`
            relative border p-1 cursor-pointer
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
          <legend className="ps-1 pe-1">Pembukaan</legend>

          <h1 className="text-center font-bold uppercase cursor-text">
            <span
              className={`
                relative border cursor-text
                ${activePosition === 'pembukaan_judul_hierarki' || hoverPosition === 'pembukaan_judul_hierarki' ? 'border-blue-400' : 'border-transparent'}
              `}
              onClick={(e) => {
                e.stopPropagation();
                setActivePosition('pembukaan_judul_hierarki');
              }}
              onMouseOver={(e) => {
                e.stopPropagation();
                setHoverPosition('pembukaan_judul_hierarki');
              }}
            >
              {activePosition === 'pembukaan_judul_hierarki' ? (
                <SmartdocEditor
                  className="inline-block"
                  elementType="judul"
                  initialValue={[
                    {
                      type: 'title',
                      children: [{ text: pembukaan?.judul?.hierarki }],
                    },
                  ]}
                  onChange={(v) => {
                    const value: CustomElement[] = v as CustomElement[];

                    onChange({
                      id: 'pembukaan_judul_hierarki',
                      elementType: 'judul',
                      value,
                    });
                  }}
                />
              ) : (
                pembukaan?.judul?.hierarki
              )}
            </span>
            <br />
            NOMOR{' '}
            <span
              className={`
                relative border cursor-text
                ${activePosition === 'pembukaan_judul_nomor' || hoverPosition === 'pembukaan_judul_nomor' ? 'border-blue-400' : 'border-transparent'}
              `}
              onClick={(e) => {
                e.stopPropagation();
                setActivePosition('pembukaan_judul_nomor');
              }}
              onMouseOver={(e) => {
                e.stopPropagation();
                setHoverPosition('pembukaan_judul_nomor');
              }}
            >
              {activePosition === 'pembukaan_judul_nomor' ? (
                <SmartdocEditor
                  className="inline-block"
                  elementType="judul"
                  initialValue={[
                    {
                      type: 'title',
                      children: [{ text: pembukaan?.judul?.nomor?.toString() }],
                    },
                  ]}
                  onChange={(v) => {
                    const value: CustomElement[] = v as CustomElement[];

                    onChange({
                      id: 'pembukaan_judul_nomor',
                      elementType: 'judul',
                      value,
                    });
                  }}
                />
              ) : (
                pembukaan?.judul?.nomor
              )}
            </span>{' '}
            TAHUN{' '}
            <span
              className={`
                relative border cursor-text
                ${activePosition === 'pembukaan_judul_tahun' || hoverPosition === 'pembukaan_judul_tahun' ? 'border-blue-400' : 'border-transparent'}
              `}
              onClick={(e) => {
                e.stopPropagation();
                setActivePosition('pembukaan_judul_tahun');
              }}
              onMouseOver={(e) => {
                e.stopPropagation();
                setHoverPosition('pembukaan_judul_tahun');
              }}
            >
              {activePosition === 'pembukaan_judul_tahun' ? (
                <SmartdocEditor
                  className="inline-block"
                  elementType="judul"
                  initialValue={[
                    {
                      type: 'title',
                      children: [{ text: pembukaan?.judul?.tahun?.toString() }],
                    },
                  ]}
                  onChange={(v) => {
                    const value: CustomElement[] = v as CustomElement[];

                    onChange({
                      id: 'pembukaan_judul_tahun',
                      elementType: 'judul',
                      value,
                    });
                  }}
                />
              ) : (
                pembukaan?.judul?.tahun
              )}
            </span>
            <br />
            TENTANG
            <br />
            <span
              className={`
                relative border cursor-text
                ${activePosition === 'pembukaan_judul_tentang' || hoverPosition === 'pembukaan_judul_tentang' ? 'border-blue-400' : 'border-transparent'}
              `}
              onClick={(e) => {
                e.stopPropagation();
                setActivePosition('pembukaan_judul_tentang');
              }}
              onMouseOver={(e) => {
                e.stopPropagation();
                setHoverPosition('pembukaan_judul_tentang');
              }}
            >
              {activePosition === 'pembukaan_judul_tentang' ? (
                <SmartdocEditor
                  className="inline-block"
                  elementType="judul"
                  initialValue={[
                    {
                      type: 'title',
                      children: [{ text: pembukaan?.judul?.tentang }],
                    },
                  ]}
                  onChange={(v) => {
                    const value: CustomElement[] = v as CustomElement[];

                    onChange({
                      id: 'pembukaan_judul_tentang',
                      elementType: 'judul',
                      value,
                    });
                  }}
                />
              ) : (
                pembukaan?.judul?.tentang
              )}
            </span>
          </h1>

          {pembukaan?.doa?.id ? (
            <h1
              className={`
                mt-2 relative border cursor-text text-center
                ${activePosition === 'pembukaan_doa' || hoverPosition === 'pembukaan_doa' ? 'border-blue-400' : 'border-transparent'}
              `}
              onClick={(e) => {
                e.stopPropagation();
                setActivePosition('pembukaan_doa');
              }}
              onMouseOver={(e) => {
                e.stopPropagation();
                setHoverPosition('pembukaan_doa');
              }}
            >
              {activePosition === 'pembukaan_doa' ? (
                <SmartdocEditor
                  className="inline-block"
                  elementType="doa"
                  initialValue={[
                    {
                      type: 'paragraph',
                      children: [
                        {
                          text: pembukaan?.doa?.text,
                          bold: false,
                        },
                      ],
                    },
                  ]}
                  onChange={(v) => {
                    const value: CustomElement[] = v as CustomElement[];

                    onChange({
                      id: 'pembukaan_doa',
                      elementType: 'doa',
                      value,
                    });
                  }}
                />
              ) : (
                pembukaan?.doa?.text
              )}
            </h1>
          ) : null}

          <h1
            className={`
              relative border cursor-text text-center
              ${activePosition === 'pembukaan_pihak' || hoverPosition === 'pembukaan_pihak' ? 'border-blue-400' : 'border-transparent'}
            `}
            onClick={(e) => {
              e.stopPropagation();
              setActivePosition('pembukaan_pihak');
            }}
            onMouseOver={(e) => {
              e.stopPropagation();
              setHoverPosition('pembukaan_pihak');
            }}
          >
            {activePosition === 'pembukaan_pihak' ? (
              <SmartdocEditor
                className="inline-block"
                elementType="pihak"
                initialValue={[
                  {
                    type: 'paragraph',
                    children: [
                      {
                        text: pembukaan?.pihak?.text,
                        bold: false,
                      },
                    ],
                  },
                ]}
                onChange={(v) => {
                  const value: CustomElement[] = v as CustomElement[];

                  onChange({
                    id: 'pembukaan_pihak',
                    elementType: 'pihak',
                    value,
                  });
                }}
              />
            ) : (
              pembukaan?.pihak?.text
            )}
          </h1>

          <fieldset
            className={`
              relative border p-2 cursor-pointer
              ${activePosition === 'pembukaan_menimbang' || hoverPosition === 'pembukaan_menimbang' ? 'border-blue-400' : 'border-transparent'}
            `}
            onClick={(e) => {
              e.stopPropagation();
              setActivePosition('pembukaan_menimbang');
            }}
            onMouseOver={(e) => {
              e.stopPropagation();
              setHoverPosition('pembukaan_menimbang');
            }}
          >
            <legend className="">Menimbang:</legend>

            {pembukaan?.menimbang?.id ? (
              <>
                {pembukaan.menimbang.type === 'text_content'
                  ? renderTextContent(pembukaan.menimbang, 'text_content')
                  : null}

                {pembukaan.menimbang.type === 'numbering'
                  ? renderNumbering(pembukaan.menimbang)
                  : null}

                {pembukaan.menimbang.type === 'alphabet'
                  ? renderAlphabet(pembukaan.menimbang)
                  : null}

                {pembukaan.menimbang.type === 'bullet'
                  ? renderBullet(pembukaan.menimbang)
                  : null}
              </>
            ) : null}
          </fieldset>

          <fieldset
            className={`
              relative border p-2 cursor-pointer
              ${activePosition === 'pembukaan_mengingat' || hoverPosition === 'pembukaan_mengingat' ? 'border-blue-400' : 'border-transparent'}
            `}
            onClick={(e) => {
              e.stopPropagation();
              setActivePosition('pembukaan_mengingat');
            }}
            onMouseOver={(e) => {
              e.stopPropagation();
              setHoverPosition('pembukaan_mengingat');
            }}
          >
            <legend className="">Mengingat:</legend>

            {pembukaan?.mengingat?.id ? (
              <>
                {pembukaan.mengingat.type === 'text_content'
                  ? renderTextContent(pembukaan.mengingat, 'text_content')
                  : null}

                {pembukaan.mengingat.type === 'numbering'
                  ? renderNumbering(pembukaan.mengingat)
                  : null}

                {pembukaan.mengingat.type === 'alphabet'
                  ? renderAlphabet(pembukaan.mengingat)
                  : null}

                {pembukaan.mengingat.type === 'bullet'
                  ? renderBullet(pembukaan.mengingat)
                  : null}
              </>
            ) : null}
          </fieldset>

          <fieldset
            className={`
              relative border p-2 cursor-pointer
              ${activePosition === 'pembukaan_memperhatikan' || hoverPosition === 'pembukaan_memperhatikan' ? 'border-blue-400' : 'border-transparent'}
            `}
            onClick={(e) => {
              e.stopPropagation();
              setActivePosition('pembukaan_memperhatikan');
            }}
            onMouseOver={(e) => {
              e.stopPropagation();
              setHoverPosition('pembukaan_memperhatikan');
            }}
          >
            <legend className="">Memperhatikan:</legend>

            {pembukaan?.memperhatikan?.id ? (
              <>
                {pembukaan.memperhatikan.type === 'text_content'
                  ? renderTextContent(pembukaan.memperhatikan, 'text_content')
                  : null}

                {pembukaan.memperhatikan.type === 'numbering'
                  ? renderNumbering(pembukaan.memperhatikan)
                  : null}

                {pembukaan.memperhatikan.type === 'alphabet'
                  ? renderAlphabet(pembukaan.memperhatikan)
                  : null}

                {pembukaan.memperhatikan.type === 'bullet'
                  ? renderBullet(pembukaan.memperhatikan)
                  : null}
              </>
            ) : null}
          </fieldset>

          <h1 className="text-center cursor-text">
            <span>Dengan Persetujuan Bersama Antara:</span>
            <br />
            <span
              className={`
                relative border cursor-text
                ${activePosition === 'pembukaan_setuju_pihak1' || hoverPosition === 'pembukaan_setuju_pihak1' ? 'border-blue-400' : 'border-transparent'}
              `}
              onClick={(e) => {
                e.stopPropagation();
                setActivePosition('pembukaan_setuju_pihak1');
              }}
              onMouseOver={(e) => {
                e.stopPropagation();
                setHoverPosition('pembukaan_setuju_pihak1');
              }}
            >
              {activePosition === 'pembukaan_setuju_pihak1' ? (
                <SmartdocEditor
                  className="inline-block"
                  elementType="pihak"
                  initialValue={[
                    {
                      type: 'paragraph',
                      children: [{ text: pembukaan?.setuju?.pihak1 ?? '' }],
                    },
                  ]}
                  onChange={(v) => {
                    const value: CustomElement[] = v as CustomElement[];

                    onChange({
                      id: 'pembukaan_setuju_pihak1',
                      elementType: 'pihak',
                      value,
                    });
                  }}
                />
              ) : (
                pembukaan?.setuju?.pihak1
              )}
            </span>
            <br />
            DAN
            <br />
            <span
              className={`
                relative border cursor-text
                ${activePosition === 'pembukaan_setuju_pihak2' || hoverPosition === 'pembukaan_setuju_pihak2' ? 'border-blue-400' : 'border-transparent'}
              `}
              onClick={(e) => {
                e.stopPropagation();
                setActivePosition('pembukaan_setuju_pihak2');
              }}
              onMouseOver={(e) => {
                e.stopPropagation();
                setHoverPosition('pembukaan_setuju_pihak2');
              }}
            >
              {activePosition === 'pembukaan_setuju_pihak2' ? (
                <SmartdocEditor
                  className="inline-block"
                  elementType="pihak"
                  initialValue={[
                    {
                      type: 'paragraph',
                      children: [{ text: pembukaan?.setuju?.pihak2 ?? '' }],
                    },
                  ]}
                  onChange={(v) => {
                    const value: CustomElement[] = v as CustomElement[];

                    onChange({
                      id: 'pembukaan_setuju_pihak2',
                      elementType: 'pihak',
                      value,
                    });
                  }}
                />
              ) : (
                pembukaan?.setuju?.pihak2
              )}
            </span>
          </h1>

          <fieldset
            className={`
              mt-2 relative border cursor-text
              ${activePosition === 'pembukaan_memutuskan' || hoverPosition === 'pembukaan_memutuskan' ? 'border-blue-400' : 'border-transparent'}
            `}
            onClick={(e) => {
              e.stopPropagation();
              setActivePosition('pembukaan_memutuskan');
            }}
            onMouseOver={(e) => {
              e.stopPropagation();
              setHoverPosition('pembukaan_memutuskan');
            }}
          >
            <legend className="ps-1 pe-1 text-center">MEMUTUSKAN:</legend>

            <p>Menetapkan:</p>

            {pembukaan?.memutuskan?.id ? (
              <span
                className={`
                relative border cursor-text
                ${activePosition === 'pembukaan_memutuskan' || hoverPosition === 'pembukaan_memutuskan' ? 'border-blue-400' : 'border-transparent'}
              `}
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePosition('pembukaan_memutuskan');
                }}
                onMouseOver={(e) => {
                  e.stopPropagation();
                  setHoverPosition('pembukaan_memutuskan');
                }}
              >
                {activePosition === 'pembukaan_memutuskan' ? (
                  <SmartdocEditor
                    className="inline-block"
                    elementType="pihak"
                    initialValue={[
                      {
                        type: 'paragraph',
                        children: [{ text: pembukaan?.memutuskan?.text ?? '' }],
                      },
                    ]}
                    onChange={(v) => {
                      const value: CustomElement[] = v as CustomElement[];

                      onChange({
                        id: 'pembukaan_memutuskan',
                        elementType: 'pihak',
                        value,
                      });
                    }}
                  />
                ) : (
                  pembukaan?.memutuskan?.text
                )}
              </span>
            ) : null}
          </fieldset>

          {/* {activePosition === 'pembukaan' && (
            <Add elementType="badan" onClick={onAdd} />
          )} */}
        </fieldset>
      </div>
    </div>
  );
}
