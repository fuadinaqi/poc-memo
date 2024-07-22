import { SmartdocEditorType } from '@/app/_providers/SmartdocProvider';

export default function Add(props: {
  elementType: SmartdocEditorType | 'badan';
  onClick?: (type: SmartdocEditorType) => void;
}) {
  const { elementType, onClick = () => null } = props;

  const renderButtonAddTextContent = () => {
    if (
      elementType === 'numbering' ||
      elementType === 'alphabet' ||
      elementType === 'bullet'
    ) {
      return (
        <button
          className="p-1 border flex items-center justify-center bg-teal-700 text-white border-black cursor-pointer"
          onClick={(event) => {
            event.preventDefault();
            onClick('text_content');
          }}
        >
          +Item
        </button>
      );
    }
    return null;
  };

  const renderButtonAddBullet = () => {
    if (
      elementType === 'text_content' ||
      elementType === 'ayat' ||
      elementType === 'pasal'
    ) {
      return (
        <button
          className="p-1 border flex items-center justify-center bg-teal-700 text-white border-black cursor-pointer"
          onClick={(event) => {
            event.preventDefault();
            onClick('bullet');
          }}
        >
          +Bullet
        </button>
      );
    }
    return null;
  };

  const renderButtonAddAlphabet = () => {
    if (
      elementType === 'text_content' ||
      elementType === 'ayat' ||
      elementType === 'pasal'
    ) {
      return (
        <button
          className="p-1 border flex items-center justify-center bg-teal-700 text-white border-black cursor-pointer"
          onClick={(event) => {
            event.preventDefault();
            onClick('alphabet');
          }}
        >
          +Huruf
        </button>
      );
    }
    return null;
  };

  const renderButtonAddNumbering = () => {
    if (elementType === 'ayat' || elementType === 'pasal') {
      return (
        <button
          className="p-1 border flex items-center justify-center bg-teal-700 text-white border-black cursor-pointer"
          onClick={(event) => {
            event.preventDefault();
            onClick('numbering');
          }}
        >
          +Angka
        </button>
      );
    }
    return null;
  };

  const renderButtonAddAyat = () => {
    if (elementType === 'pasal') {
      return (
        <button
          className="p-1 border flex items-center justify-center bg-teal-700 text-white border-black cursor-pointer"
          onClick={(event) => {
            event.preventDefault();
            onClick('ayat');
          }}
        >
          +Ayat
        </button>
      );
    }
    return null;
  };

  const renderButtonAddPasal = () => {
    if (
      elementType === 'paragraf' ||
      elementType === 'bagian' ||
      elementType === 'bab' ||
      elementType === 'badan'
    ) {
      return (
        <button
          className="p-1 border flex items-center justify-center bg-teal-700 text-white border-black cursor-pointer"
          onClick={(event) => {
            event.preventDefault();
            onClick('pasal');
          }}
        >
          +Pasal
        </button>
      );
    }
    return null;
  };

  const renderButtonAddParagraf = () => {
    if (
      elementType === 'bagian' ||
      elementType === 'bab' ||
      elementType === 'badan'
    ) {
      return (
        <button
          className="p-1 border flex items-center justify-center bg-teal-700 text-white border-black cursor-pointer"
          onClick={(event) => {
            event.preventDefault();
            onClick('paragraf');
          }}
        >
          +Paragraf
        </button>
      );
    }
    return null;
  };

  const renderButtonAddBagian = () => {
    if (elementType === 'bab' || elementType === 'badan') {
      return (
        <button
          className="p-1 border flex items-center justify-center bg-teal-700 text-white border-black cursor-pointer"
          onClick={(event) => {
            event.preventDefault();
            onClick('bagian');
          }}
        >
          +Bagian
        </button>
      );
    }
    return null;
  };

  const renderButtonAddBab = () => {
    if (elementType === 'badan') {
      return (
        <button
          className="p-1 border flex items-center justify-center bg-teal-700 text-white border-black cursor-pointer"
          onClick={(event) => {
            event.preventDefault();
            onClick('bab');
          }}
        >
          +Bab
        </button>
      );
    }
    return null;
  };

  return (
    <div className="absolute -top-9 right-0 flex items-center border border-orange-700">
      {renderButtonAddBab()}
      {renderButtonAddBagian()}
      {renderButtonAddParagraf()}
      {renderButtonAddPasal()}
      {renderButtonAddAyat()}
      {renderButtonAddNumbering()}
      {renderButtonAddAlphabet()}
      {renderButtonAddBullet()}
      {renderButtonAddTextContent()}
    </div>
  );
}
