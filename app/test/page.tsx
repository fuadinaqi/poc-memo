'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
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
    badan,
    setBadan,
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
    setBadan((prevBadan) => {
      const newBadan = deepCopy(prevBadan);

      // const findElement = (arr: any[], id: string): any => {
      //   for (let i = 0; i < arr.length; i++) {
      //     if (arr[i].id === id) {
      //       return arr[i];
      //     }
      //     if (arr[i].list) {
      //       const found = findElement(arr[i].list, id);
      //       if (found) {
      //         return found;
      //       }
      //     }
      //   }
      //   return null;
      // };

      const element = findElement(newBadan, id);
      const parentElement = findElement(
        newBadan,
        id?.split('-')?.slice(0, -1).join('-')
      );
      const isDeletedValue =
        value.length === 1 &&
        value[0].children.length === 1 &&
        value[0].children[0].text === '';
      if (isDeletedValue && parentElement) {
        parentElement.list = parentElement.list.filter(
          (item: any) => item.id !== id
        );
      } else {
        element.text = value;
      }

      return newBadan;
    });
  };

  const onAdd = (elementType: SmartdocEditorType) => {
    const isBadan = !selectedBlock?.id;
    // if (selectedBlock.type)
    if (isBadan) {
      if (elementType === 'bab') {
        const lastBab = getLastElement().lastBab;
        if (lastBab) {
          const lastBabNumber = romanToNumber(lastBab.title.split(' ')[1]);

          setBadan((prevBadan) => {
            const newBadan = deepCopy(prevBadan);

            newBadan.push({
              id: `bab${lastBabNumber + 1}`,
              type: 'bab',
              title: `Bab ${numberToRoman(lastBabNumber + 1)}`,
              text: [
                {
                  type: 'title',
                  children: [
                    {
                      text: 'Type judul bab here...',
                      bold: true,
                    },
                  ],
                },
              ],
              list: [],
            });
            return newBadan;
          });

          setTimeout(() => {
            setActivePosition(`bab${lastBabNumber + 1}`);
          }, 200);
        }
      } else if (elementType === 'bagian') {
        //
      }
    } else {
      // if (selectedBlock.type === 'bab') {
      if (elementType === 'bagian') {
        const lastBagian = selectedBlock.list?.findLast(
          (item) => item.type === 'bagian'
        );

        if (lastBagian) {
          const lastBagianNumber = sentenceToNumber(
            lastBagian.title.split(' ')[1]
          );
          setBadan((prevBadan) => {
            const newBadan = deepCopy(prevBadan);
            const parentElement = newBadan.find(
              (item: any) => item.id === selectedBlock.id
            );
            parentElement.list.push({
              id: `bag${lastBagianNumber + 1}`,
              type: 'bagian',
              title: `Bagian ${numberToSentence(lastBagianNumber + 1)}`,
              text: [
                {
                  type: 'title',
                  children: [
                    {
                      text: 'Type judul bagian here...',
                      bold: true,
                    },
                  ],
                },
              ],
              list: [],
            });
            return newBadan;
          });

          setTimeout(() => {
            setActivePosition(`bag${lastBagianNumber + 1}`);
          }, 200);
        } else {
          setBadan((prevBadan) => {
            const newBadan = deepCopy(prevBadan);
            const parentElement = newBadan.find(
              (item: any) => item.id === selectedBlock.id
            );
            parentElement.list.push({
              id: 'bag1',
              type: 'bagian',
              title: 'Bagian Kesatu',
              text: [
                {
                  type: 'title',
                  children: [
                    {
                      text: 'Type judul bagian here...',
                      bold: true,
                    },
                  ],
                },
              ],
              list: [],
            });
            return newBadan;
          });

          setTimeout(() => {
            setActivePosition('bag1');
          }, 200);
        }
      } else if (elementType === 'paragraf') {
        const lastParagraf = selectedBlock.list?.findLast(
          (item) => item.type === 'paragraf'
        );

        if (lastParagraf) {
          const lastParagrafNumber = Number(lastParagraf.title.split(' ')[1]);
          setBadan((prevBadan) => {
            const newBadan = deepCopy(prevBadan);
            const parentElement = newBadan.find(
              (item: any) => item.id === selectedBlock.id
            );
            parentElement.list.push({
              id: `par${lastParagrafNumber + 1}`,
              type: 'paragraf',
              title: `Paragraf ${lastParagrafNumber + 1}`,
              text: [
                {
                  type: 'title',
                  children: [
                    {
                      text: 'Type judul paragraf here...',
                      bold: true,
                    },
                  ],
                },
              ],
              list: [],
            });
            return newBadan;
          });

          setTimeout(() => {
            setActivePosition(`par${lastParagrafNumber + 1}`);
          }, 200);
        } else {
          setBadan((prevBadan) => {
            const newBadan = deepCopy(prevBadan);
            const parentElement = newBadan.find(
              (item: any) => item.id === selectedBlock.id
            );
            parentElement.list.push({
              id: 'par1',
              type: 'paragraf',
              title: 'Paragraf Kesatu',
              text: [
                {
                  type: 'title',
                  children: [
                    {
                      text: 'Type judul paragraf here...',
                      bold: true,
                    },
                  ],
                },
              ],
              list: [],
            });
            return newBadan;
          });

          setTimeout(() => {
            setActivePosition('par1');
          }, 200);
        }
      } else if (elementType === 'pasal') {
        const lastPasal =
          // selectedBlock.list?.findLast((item) => item.type === 'pasal') ||
          getLastElement().lastPasal;

        if (lastPasal) {
          const lastPasalNumber = Number(lastPasal.title.split(' ')[1]);
          setBadan((prevBadan) => {
            const newBadan = deepCopy(prevBadan);

            // const findElement = (arr: any[], id: string): any => {
            //   for (let i = 0; i < arr.length; i++) {
            //     if (arr[i].id === id) {
            //       return arr[i];
            //     }
            //     if (arr[i].list) {
            //       const found = findElement(arr[i].list, id);
            //       if (found) {
            //         return found;
            //       }
            //     }
            //   }
            //   return null;
            // };
            const parentElement = findElement(newBadan, selectedBlock?.id);
            // console.log(parentElement);
            parentElement.list = [
              ...parentElement.list,
              {
                id: `pas${lastPasalNumber + 1}`,
                type: 'pasal',
                title: `Pasal ...`,
                text: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        text: `Type pasal here...`,
                      },
                    ],
                  },
                ],
                list: [],
              },
            ];
            return newBadan;
          });

          setTimeout(() => {
            setActivePosition(`pas${lastPasalNumber + 1}`);
          }, 200);
        } else {
          setBadan((prevBadan) => {
            const newBadan = deepCopy(prevBadan);
            const parentElement = newBadan.find(
              (item: any) => item.id === selectedBlock.id
            );
            parentElement.list.push({
              id: 'pas1',
              type: 'pasal',
              title: 'Pasal Kesatu',
              text: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: 'Type pasal kesatu here...',
                    },
                  ],
                },
              ],
              list: [],
            });
            return newBadan;
          });

          setTimeout(() => {
            setActivePosition('pas1');
          }, 200);
        }
      } else if (elementType === 'ayat') {
        const ayatLength =
          selectedBlock.list?.filter((item) => item.type === 'ayat').length ||
          0;

        setBadan((prevBadan) => {
          const newBadan = deepCopy(prevBadan);
          const parentElement = findElement(newBadan, selectedBlock?.id);
          if (ayatLength) {
            parentElement.list.push({
              id: `ayat${ayatLength + 1}`,
              type: 'ayat',
              text: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: `Type ayat ${ayatLength + 1} here...`,
                    },
                  ],
                },
              ],
              list: [],
            });
          } else {
            parentElement.list = [
              {
                id: `ayat1`,
                type: 'ayat',
                text: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        text: `Type ayat 1 here...`,
                      },
                    ],
                  },
                ],
                list: [],
              },
            ];
          }
          return newBadan;
        });

        setTimeout(() => {
          setActivePosition(`ayat${ayatLength + 1}`);
        }, 200);
      } else if (elementType === 'numbering') {
        const numberingLength =
          selectedBlock.list?.filter((item) => item.type === 'numbering')
            .length || 0;

        setBadan((prevBadan) => {
          const newBadan = deepCopy(prevBadan);
          const parentElement = findElement(newBadan, selectedBlock?.id);
          if (numberingLength) {
            parentElement.list.push({
              id: `numbering${numberingLength + 1}`,
              type: 'numbering',
              list: [
                {
                  id: `numbering${numberingLength + 1}-1`,
                  type: 'text_content',
                  text: [
                    {
                      type: 'paragraph',
                      children: [
                        {
                          text: `Type numbering ${numberingLength + 1} here...`,
                        },
                      ],
                    },
                  ],
                },
              ],
            });
          } else {
            parentElement.list = [
              {
                id: `numbering1`,
                type: 'numbering',
                list: [
                  {
                    id: `numbering1-1`,
                    type: 'text_content',
                    text: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: `Type numbering 1 here...`,
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ];
          }
          return newBadan;
        });

        setTimeout(() => {
          setActivePosition(`numbering${numberingLength + 1}-1`);
        }, 200);
      } else if (elementType === 'alphabet') {
        const alphabetLength =
          selectedBlock.list?.filter((item) => item.type === 'alphabet')
            .length || 0;

        setBadan((prevBadan) => {
          const newBadan = deepCopy(prevBadan);
          const parentElement = findElement(newBadan, selectedBlock?.id);
          if (alphabetLength) {
            parentElement.list.push({
              id: `alphabet${alphabetLength + 1}`,
              type: 'alphabet',
              list: [
                {
                  id: `alphabet${alphabetLength + 1}-1`,
                  type: 'text_content',
                  text: [
                    {
                      type: 'paragraph',
                      children: [
                        {
                          text: `Type alphabet ${alphabetLength + 1} here...`,
                        },
                      ],
                    },
                  ],
                },
              ],
            });
          } else {
            parentElement.list = [
              {
                id: `alphabet1`,
                type: 'alphabet',
                list: [
                  {
                    id: `alphabet1-1`,
                    type: 'text_content',
                    text: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: `Type alphabet 1 here...`,
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ];
          }
          return newBadan;
        });

        setTimeout(() => {
          setActivePosition(`alphabet${alphabetLength + 1}-1`);
        }, 200);
      } else if (elementType === 'bullet') {
        const bulletLength =
          selectedBlock.list?.filter((item) => item.type === 'bullet').length ||
          0;

        setBadan((prevBadan) => {
          const newBadan = deepCopy(prevBadan);
          const parentElement = findElement(newBadan, selectedBlock?.id);
          if (bulletLength) {
            parentElement.list.push({
              id: `bullet${bulletLength + 1}`,
              type: 'bullet',
              list: [
                {
                  id: `bullet${bulletLength + 1}-1`,
                  type: 'text_content',
                  text: [
                    {
                      type: 'paragraph',
                      children: [
                        {
                          text: `Type bullet ${bulletLength + 1} here...`,
                        },
                      ],
                    },
                  ],
                },
              ],
            });
          } else {
            parentElement.list = [
              {
                id: `bullet1`,
                type: 'bullet',
                list: [
                  {
                    id: `bullet1-1`,
                    type: 'text_content',
                    text: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: `Type bullet 1 here...`,
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ];
          }
          return newBadan;
        });

        setTimeout(() => {
          setActivePosition(`bullet${bulletLength + 1}-1`);
        }, 200);
      } else if (elementType === 'text_content') {
        const textContentLength =
          selectedBlock.list?.filter((item) => item.type === 'text_content')
            .length || 0;

        setBadan((prevBadan) => {
          const newBadan = deepCopy(prevBadan);
          const parentElement = findElement(newBadan, selectedBlock?.id);
          if (textContentLength) {
            parentElement.list.push({
              id: `text_content${textContentLength + 1}`,
              type: 'text_content',
              text: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      text: `Type text content ${textContentLength + 1} here...`,
                    },
                  ],
                },
              ],
            });
          } else {
            parentElement.list = [
              {
                id: `text_content1`,
                type: 'text_content',
                text: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        text: `Type text content 1 here...`,
                      },
                    ],
                  },
                ],
              },
            ];
          }
          return newBadan;
        });

        setTimeout(() => {
          setActivePosition(`text_content${textContentLength + 1}`);
        }, 200);
      }
    }
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

  const renderAyat = (ayat: Ayat, index: number) => {
    return (
      <fieldset
        className={`
          relative border cursor-pointer
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

        {activePosition === ayat.id ? (
          <div className="flex gap-1.5">
            <span className="cursor-text text-center">({index + 1})&nbsp;</span>
            <SmartdocEditor
              elementType={ayat.type}
              initialValue={ayat.text ?? []}
              onChange={(v) => {
                const value: CustomElement[] = v as CustomElement[];

                onChange({
                  id: ayat.id,
                  elementType: ayat.type,
                  value,
                });
              }}
            />
          </div>
        ) : (
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
        )}

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

        {activePosition === ayat.id && (
          <Add elementType="ayat" onClick={onAdd} />
        )}
      </fieldset>
    );
  };

  const renderPasal = (pasal: Pasal) => {
    return (
      <fieldset
        className={`
          relative border p-1 cursor-pointer
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

        {activePosition === pasal.id ? (
          <SmartdocEditor
            elementType={pasal.type}
            initialValue={pasal.text ?? []}
            onChange={(v) => {
              const value: CustomElement[] = v as CustomElement[];

              onChange({
                id: pasal.id,
                elementType: pasal.type,
                value,
              });
            }}
          />
        ) : (
          <h4 className="cursor-text">
            {pasal.text?.map((textItem, indexItem) => {
              return textItem.children.map((text, i) => {
                return <SmartdocViewText key={i} text={text} />;
              });
            })}
          </h4>
        )}

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

        {activePosition === pasal.id && (
          <Add elementType="pasal" onClick={onAdd} />
        )}
      </fieldset>
    );
  };

  const renderParagraf = (paragraf: Paragraf) => {
    return (
      <fieldset
        className={`
          relative border p-1 cursor-pointer
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

        {activePosition === paragraf.id ? (
          <SmartdocEditor
            elementType={paragraf.type}
            initialValue={paragraf.text ?? []}
            onChange={(v) => {
              const value: CustomElement[] = v as CustomElement[];

              onChange({
                id: paragraf.id,
                elementType: paragraf.type,
                value,
              });
            }}
          />
        ) : (
          <h3 className="cursor-text text-center">
            {paragraf.text?.map((textItem, indexItem) => {
              return textItem.children.map((text, i) => {
                return <SmartdocViewText key={i} text={text} />;
              });
            })}
          </h3>
        )}

        {paragraf?.list?.map((itemParagraf, indexParagraf) => {
          if (itemParagraf.type === 'pasal') {
            return renderPasal(itemParagraf);
          }
          return null;
        })}

        {activePosition === paragraf.id && (
          <Add elementType="paragraf" onClick={onAdd} />
        )}
      </fieldset>
    );
  };

  const renderBagian = (bagian: Bagian) => {
    return (
      <fieldset
        className={`
          relative border p-1 cursor-pointer
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

        {activePosition === bagian.id ? (
          <SmartdocEditor
            elementType={bagian.type}
            initialValue={bagian.text ?? []}
            onChange={(v) => {
              const value: CustomElement[] = v as CustomElement[];

              onChange({
                id: bagian.id,
                elementType: bagian.type,
                value,
              });
            }}
          />
        ) : (
          <h2 className="cursor-text text-center">
            {bagian.text?.map((textItem, indexItem) => {
              return textItem.children.map((text, i) => {
                return <SmartdocViewText key={i} text={text} />;
              });
            })}
          </h2>
        )}

        {bagian?.list?.map((itemBagian, indexBagian) => {
          if (itemBagian.type === 'pasal') {
            return renderPasal(itemBagian);
          }
          if (itemBagian.type === 'paragraf') {
            return renderParagraf(itemBagian);
          }
          return null;
        })}

        {activePosition === bagian.id && (
          <Add elementType="bagian" onClick={onAdd} />
        )}
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
          relative border p-1 cursor-pointer
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

        {activePosition === item.id ? (
          <SmartdocEditor
            elementType={item.type}
            initialValue={item.text ?? []}
            onChange={(v) => {
              const value: CustomElement[] = v as CustomElement[];

              onChange({
                id: item.id,
                elementType: item.type,
                value,
              });
            }}
          />
        ) : (
          <h1 className="cursor-text text-center">
            {item.text?.map((textItem, indexItem) => {
              return textItem.children.map((text, i) => {
                return <SmartdocViewText key={i} text={text} />;
              });
            })}
          </h1>
        )}

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

        {activePosition === item.id && (
          <Add elementType={item.type} onClick={onAdd} />
        )}
      </fieldset>
    );
  };

  return (
    <div ref={parentRef} className="mt-8 mx-auto w-[712px]">
      <fieldset
        className={`
          relative border p-1 cursor-pointer
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

        {activePosition === 'badan' && (
          <Add elementType="badan" onClick={onAdd} />
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
