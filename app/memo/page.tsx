'use client';

import { useState } from 'react';
import { Descendant } from 'slate';
import MemoExample from './_Memo';

export default function Page() {
  const [jsonValue, setJsonValue] = useState<string>('');

  const [value, setValue] = useState<Descendant[]>([]);

  return (
    <div className="mt-8 mx-auto w-[1096px] flex gap-2">
      <form className="w-[384px] h-[712px]">
        <textarea
          placeholder="Type json memo here start with array... [];"
          className="w-full p-2 border border-blue-500"
          onChange={(e) => {
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
              setValue(a);
            } catch (e) {
              alert('Invalid JSON');
              return console.error(e); // error in the above string (in this case, yes)!
            }
          }}
        >
          Submit
        </button>
      </form>
      <div className="w-[712px]">
        <MemoExample value={value} />
      </div>
    </div>
  );
}
