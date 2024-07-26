import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';
import { DUMMY_BADAN } from '../_constants/badan';
import { DUMMY_PEMBUKAAN } from '../_constants/pembuka';

export type CustomElement = {
  type: 'paragraph' | 'title';
  children: CustomText[];
};
export type CustomText = {
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

export type SmartdocEditorType =
  | 'text_content'
  | 'numbering'
  | 'bullet'
  | 'alphabet'
  | 'bab'
  | 'bagian'
  | 'paragraf'
  | 'pasal'
  | 'ayat'
  | 'judul'
  | 'doa'
  | 'pihak'
  | 'setuju'
  | 'memutuskan';

export type SmartdocPosition =
  // PEMBUKAAN
  | 'pembukaan'
  | 'pembukaan_judul'
  | 'pembukaan_doa'
  | 'pembukaan_menimbang'
  | 'pembukaan_mengingat'
  | 'pembukaan_setuju'
  | 'pembukaan_memutuskan'
  // PEMBUKAAN

  // BADAN
  | 'badan'
  | 'badan_bab'
  | 'badan_bagian'
  | 'badan_paragraf'
  | 'badan_pasal'
  | 'badan_ayat'
  | 'badan_numbering'
  | 'badan_alphabet'
  | 'badan_bullet'
  | 'badan_text_content'
  // BADAN

  // PENUTUP
  | 'penutup'
  // PENUTUP
  | 'idle';

export type Judul = {
  id: string;
  text: CustomElement[];
};

export type Doa = {
  id: string;
  text: CustomElement[];
};

export type Menimbang = {
  id: string;
  text?: CustomElement[];
  data?:
    | {
        id: string;
        type: 'numbering';
        list: Array<Omit<TextContent, 'alphabet' | 'bullet'>>;
      }
    | {
        id: string;
        type: 'alphabet';
        list: Array<Omit<TextContent, 'alphabet' | 'bullet'>>;
      }
    | {
        id: string;
        type: 'bullet';
        list: Array<Omit<TextContent, 'alphabet' | 'bullet'>>;
      };
};

export type Mengingat = {
  id: string;
  text?: CustomElement[];
  data?:
    | {
        id: string;
        type: 'numbering';
        list: Array<Omit<TextContent, 'alphabet' | 'bullet'>>;
      }
    | {
        id: string;
        type: 'alphabet';
        list: Array<Omit<TextContent, 'alphabet' | 'bullet'>>;
      }
    | {
        id: string;
        type: 'bullet';
        list: Array<Omit<TextContent, 'alphabet' | 'bullet'>>;
      };
};

export type Memperhatikan = {
  id: string;
  text?: CustomElement[];
  data?:
    | {
        id: string;
        type: 'numbering';
        list: Array<Omit<TextContent, 'alphabet' | 'bullet'>>;
      }
    | {
        id: string;
        type: 'alphabet';
        list: Array<Omit<TextContent, 'alphabet' | 'bullet'>>;
      }
    | {
        id: string;
        type: 'bullet';
        list: Array<Omit<TextContent, 'alphabet' | 'bullet'>>;
      };
};

export type Setuju = {
  id: string;
  text: CustomElement[];
};

export type Memutuskan = {
  id: string;
  text: CustomElement[];
};

// export type Pembukaan = {
//   judul: Judul;
//   doa?: Doa;
//   menimbang?: Menimbang;
//   mengingat?: Mengingat;
//   setuju?: Setuju;
//   memutuskan?: Memutuskan;
// };

export type CommonPembuka =
  | {
      type: 'numbering' | 'alphabet' | 'bullet';
      list: Array<CustomElement[]>;
    }
  | {
      type: 'text_content';
      text: CustomElement[];
    };

export type Pembukaan = {
  judul: {
    id: string;
    type: 'judul';
    hierarki: string;
    nomor: string | number;
    tahun: string | number;
    tentang: string;
  };
  doa?: {
    id: string;
    type: 'doa';
    text: string;
  };
  pihak: {
    id: string;
    type: 'pihak';
    text: string;
  };
  menimbang: Numbering | Alphabet | Bullet | TextContent;
  mengingat: Numbering | Alphabet | Bullet | TextContent;
  memperhatikan?: Numbering | Alphabet | Bullet | TextContent;
  setuju?: {
    id: string;
    type: 'setuju';
    pihak1: string;
    pihak2: string;
  };
  memutuskan: {
    id: string;
    type: 'memutuskan';
    text: string;
  };
};

export type CommonBlock = {
  ref_id?: string | null;
  seq?: number;
  path?: string;
  raw_content?: string;
  title?: string | null;
};

export type TextContent = CommonBlock & {
  id: string;
  type: 'text_content';
  text: CustomElement[];
  alphabet?: Alphabet;
  bullet?: Bullet;
};

export type Bullet = {
  id: string;
  type: 'bullet';
  list: Array<Omit<TextContent, 'alphabet' | 'bullet'>>;
};

export type Alphabet = {
  id: string;
  type: 'alphabet';
  list: Array<Omit<TextContent, 'alphabet' | 'bullet'>>;
};

export type Numbering = {
  id: string;
  type: 'numbering';
  list: Array<TextContent>;
};

export type Ayat = CommonBlock & {
  id: string;
  type: 'ayat';
  text?: CustomElement[];
  list?: Array<Numbering | Alphabet | Bullet>;
};

export type Pasal = CommonBlock & {
  id: string;
  type: 'pasal';
  title: string;
  text?: CustomElement[];
  list?: Array<Ayat | Numbering | Alphabet | Bullet>;
};

export type Paragraf = CommonBlock & {
  id: string;
  type: 'paragraf';
  title: string;
  text: CustomElement[];
  list?: Array<Pasal>;
};

export type Bagian = CommonBlock & {
  id: string;
  type: 'bagian';
  title: string;
  text: CustomElement[];
  list?: Array<Paragraf | Pasal>;
};

export type Bab = CommonBlock & {
  id: string;
  type: 'bab';
  title: string;
  text: CustomElement[];
  list?: Array<Bagian | Pasal>;
};

export type Badan = Array<Bab | Bagian | Paragraf | Pasal>;

export const SmartdocContext = createContext<{
  pembukaan: Pembukaan;
  setPembukaan: React.Dispatch<React.SetStateAction<Pembukaan>>;

  badan: Badan;
  setBadan: React.Dispatch<React.SetStateAction<Badan>>;

  hoverPosition: string;
  setHoverPosition: React.Dispatch<React.SetStateAction<string>>;
  activePosition: string;
  setActivePosition: React.Dispatch<React.SetStateAction<string>>;
  indexHoverPosition: number;
  setIndexHoverPosition: React.Dispatch<React.SetStateAction<number>>;
  indexActivePosition: number;
  setIndexActivePosition: React.Dispatch<React.SetStateAction<number>>;

  selectedBlock:
    | Bab
    | Bagian
    | Paragraf
    | Pasal
    | Ayat
    | Numbering
    | Alphabet
    | Bullet
    | TextContent;
  getLastElement: () => {
    lastBab?: Bab;
    // lastBagian?: Bagian;
    // lastParagraf?: Paragraf;
    lastPasal?: Pasal;
  };
}>({
  pembukaan: DUMMY_PEMBUKAAN,
  setPembukaan: () => {},
  badan: [],
  setBadan: () => {},
  hoverPosition: 'idle',
  setHoverPosition: () => {},
  activePosition: 'idle',
  setActivePosition: () => {},
  indexHoverPosition: 0,
  setIndexHoverPosition: () => {},
  indexActivePosition: 0,
  setIndexActivePosition: () => {},
  selectedBlock: {
    id: '',
    type: 'text_content',
    text: [],
  },
  getLastElement: () => ({
    lastBab: undefined,
    lastBagian: undefined,
    lastParagraf: undefined,
    lastPasal: undefined,
  }),
});

const SmartdocProvider = ({ children }: { children: React.ReactNode }) => {
  const [pembukaan, setPembukaan] = useState<Pembukaan>(DUMMY_PEMBUKAAN);
  const [badan, setBadan] = useState<Badan>(DUMMY_BADAN);

  const [hoverPosition, setHoverPosition] = useState<string>('');
  const [activePosition, setActivePosition] = useState<string>('');
  const [indexHoverPosition, setIndexHoverPosition] = useState<number>(0);
  const [indexActivePosition, setIndexActivePosition] = useState<number>(0);

  const selectedBlock = useMemo(() => {
    if (activePosition && activePosition !== 'badan') {
      const findObjectById = (data: any, id: any) => {
        for (const item of data) {
          if (item.id === id) {
            return item;
          }
          if (item.list) {
            const result: any = findObjectById(item.list, id);
            if (result) {
              return result;
            }
          }
        }
        return null;
      };

      return findObjectById(badan, activePosition);
    }
    return {
      id: '',
      type: 'text_content',
      text: [],
    };
  }, [activePosition, badan]);

  // // console.log('selectedBlock ==> ', selectedBlock);

  // const latestBab = useMemo((): Bab | undefined => {
  //   const bab = badan.filter((item) => item.type === 'bab');
  //   return bab[bab.length - 1];
  // }, [badan]);

  // // const latestBagian = useMemo((): Bagian | undefined => {
  // //   let bagian: Bagian | undefined;
  // // }, [badan]);

  // console.log('latestBab ==> ', latestBab);
  // // console.log('latestBagian ==> ', latestBagian);

  const getLastElement = useCallback(() => {
    let lastBab: Bab | undefined;
    let lastBagian: Bagian | undefined;
    let lastParagraf: Paragraf | undefined;
    let lastPasal: Pasal | undefined;

    function traverse(list: Badan | Array<Bagian | Paragraf | Pasal>) {
      for (const item of list) {
        switch (item.type) {
          case 'bab':
            lastBab = item as Bab;
            if (item.list) traverse(item.list);
            break;
          case 'bagian':
            lastBagian = item as Bagian;
            if (item.list) traverse(item.list);
            break;
          case 'paragraf':
            lastParagraf = item as Paragraf;
            if (item.list) traverse(item.list);
            break;
          case 'pasal':
            lastPasal = item as Pasal;
            break;
        }
      }
    }

    traverse(badan);

    return {
      lastBab,
      // lastBagian,
      // lastParagraf,
      lastPasal,
    };
  }, [badan]);

  return (
    <SmartdocContext.Provider
      value={{
        pembukaan,
        setPembukaan,

        badan,
        setBadan,

        hoverPosition,
        setHoverPosition,
        activePosition,
        setActivePosition,
        indexHoverPosition,
        setIndexHoverPosition,
        indexActivePosition,
        setIndexActivePosition,

        selectedBlock,
        getLastElement,
      }}
    >
      {children}
    </SmartdocContext.Provider>
  );
};

export const useSmartdocContext = () => React.useContext(SmartdocContext);

export default SmartdocProvider;
