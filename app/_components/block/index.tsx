import { CustomText } from '@/app/page';
import SmartdocEditor from '../editor';
import { SmartdocViewText } from '../view';

export default function SmartdocBlock() {
  return (
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
      </fieldset>
    </div>
  );
}
