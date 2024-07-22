import { SmartdocEditorType } from '@/app/_providers/SmartdocProvider';
import { CustomText } from '@/app/page';

export const SmartdocViewText = (props: {
  text: CustomText;
  elementType?: SmartdocEditorType;
  index?: number;
}) => {
  const { index, text, elementType } = props;

  const renderByElementType = () => {
    switch (elementType) {
      case 'bullet': {
        return <span className="w-6 inline-block">&bull; </span>;
      }
      case 'numbering': {
        if (typeof index === 'number') {
          return <span className="w-6 inline-block">{`${index}. `}</span>;
        }
        return null;
      }
      case 'alphabet': {
        if (typeof index === 'number') {
          return (
            <span className="w-6 inline-block">{`${String.fromCharCode(96 + index)}. `}</span>
          );
        }
        return null;
      }
      case 'ayat': {
        if (typeof index === 'number') {
          return `(${index}) `;
        }
        return null;
      }
      default: {
        return null;
      }
    }
  };

  return (
    <span
      className={`
        ${text.bold ? 'font-bold' : ''}
        ${text.italic ? 'italic' : ''}
        ${text.underline ? 'underline' : ''}
      `}
    >
      {renderByElementType()}
      {text.text}
    </span>
  );
};
