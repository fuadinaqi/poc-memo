'use client';

import { useState } from 'react';
import { Descendant } from 'slate';
import MemoExample from './_Memo';

const init = [
  {
    'type': 'paragraph',
    'children': [
      {
        'text': 'Memorandum',
        'bold': true,
      },
    ],
  },
  {
    'type': 'paragraph',
    'children': [
      {
        'text': ' ',
      },
    ],
  },
  {
    'type': 'paragraph',
    'children': [
      {
        'text': 'Tanggal    : 03-02-2025',
      },
    ],
  },
  {
    'type': 'paragraph',
    'children': [
      {
        'text':
          'Tentang    : Implementasi UU Cipta Kerja dan Legalitas Perceraian di Indonesia',
      },
    ],
  },
  {
    'type': 'paragraph',
    'children': [
      {
        'text': ' ',
      },
    ],
  },
  {
    'type': 'paragraph',
    'children': [
      {
        'text': '___________________________________________',
        'bold': true,
      },
    ],
  },
  {
    'type': 'paragraph',
    'children': [
      {
        'text': ' ',
      },
    ],
  },
  {
    'type': 'paragraph',
    'children': [
      {
        'text': 'I.   PENDAHULUAN',
        'bold': true,
      },
    ],
  },
  {
    'type': 'paragraph',
    'children': [
      {
        'text': ' ',
      },
    ],
  },
  {
    'type': 'paragraph',
    'children': [
      {
        'text':
          'Memorandum ini membahas dua isu hukum penting di Indonesia: status terkini implementasi Undang-Undang Cipta Kerja dan legalitas perceraian tanpa melaporkan ke negara. UU Cipta Kerja telah disahkan dan beberapa peraturan pelaksana telah diterbitkan, namun masih menghadapi tantangan implementasi. Sementara itu, perceraian di Indonesia hanya sah jika dilakukan melalui prosedur pengadilan yang resmi, dengan konsekuensi hukum yang signifikan jika tidak dipatuhi.',
      },
    ],
  },
  {
    'type': 'paragraph',
    'children': [
      {
        'text': ' ',
      },
    ],
  },
  {
    'type': 'paragraph',
    'children': [
      {
        'text': 'II.   PEMBAHASAN',
        'bold': true,
      },
    ],
  },
  {
    'type': 'paragraph',
    'children': [
      {
        'text': ' ',
      },
    ],
  },
  {
    'type': 'paragraph',
    'children': [
      {
        'text':
          'Berikut adalah pembahasan rinci mengenai kedua isu hukum tersebut:',
      },
    ],
  },
  {
    'type': 'paragraph',
    'children': [
      {
        'text': '',
      },
    ],
  },
  {
    'type': 'paragraph',
    'children': [
      {
        'text': 'a. Status Implementasi UU Cipta Kerja',
        'bold': true,
      },
    ],
  },
  {
    'type': 'paragraph',
    'children': [
      {
        'text':
          'UU Cipta Kerja telah melalui beberapa tahap implementasi sejak disahkan pada 5 Oktober 2020:',
      },
    ],
  },
  {
    'type': 'numbering',
    'children': [
      {
        'type': 'list-item',
        'children': [
          {
            'text':
              'Pengesahan: UU Nomor 11 Tahun 2020 tentang Cipta Kerja telah disahkan oleh DPR.',
          },
        ],
      },
      {
        'type': 'list-item',
        'children': [
          {
            'text':
              'Peraturan Pelaksana: Pemerintah telah menerbitkan beberapa peraturan pelaksana, termasuk:\n- PP No. 35 Tahun 2021 tentang PKWT, Alih Daya, Waktu Kerja dan Istirahat, dan PHK.\n- PP No. 36 Tahun 2021 tentang Pengupahan.',
          },
        ],
      },
      {
        'type': 'list-item',
        'children': [
          {
            'text':
              'Pedoman Pelaksanaan: Kemenaker telah menerbitkan Kepmen No. 104 Tahun 2021 tentang Pedoman Hubungan Kerja selama Pandemi COVID-19.',
          },
        ],
      },
    ],
  },
  {
    'type': 'paragraph',
    'children': [
      {
        'text':
          'Meskipun demikian, implementasi UU ini masih menghadapi tantangan, termasuk adanya permohonan uji materi ke Mahkamah Konstitusi.',
      },
    ],
  },
  {
    'type': 'paragraph',
    'children': [
      {
        'text': 'b. Legalitas Perceraian Tanpa Melapor ke Negara',
        'bold': true,
      },
    ],
  },
  {
    'type': 'paragraph',
    'children': [
      {
        'text':
          'Perceraian di Indonesia diatur secara ketat oleh hukum negara:',
      },
    ],
  },
  {
    'type': 'numbering',
    'children': [
      {
        'type': 'list-item',
        'children': [
          {
            'text':
              'Dasar Hukum: UU No. 1 Tahun 1974 tentang Perkawinan, Pasal 39 ayat (1) menyatakan bahwa perceraian hanya sah jika dilakukan di depan sidang pengadilan.',
          },
        ],
      },
      {
        'type': 'list-item',
        'children': [
          {
            'text':
              'Konsekuensi Hukum: Perceraian tanpa melalui pengadilan dianggap tidak sah, dengan implikasi:\n- Status perkawinan tetap dianggap sah oleh negara.\n- Tidak ada pembagian harta gono-gini yang sah.\n- Hak-hak anak tidak terjamin secara hukum.',
          },
        ],
      },
      {
        'type': 'list-item',
        'children': [
          {
            'text':
              'Prosedur yang Benar: Perceraian harus diajukan ke Pengadilan Agama (Islam) atau Pengadilan Negeri (non-Muslim) sesuai UU No. 7 Tahun 1989 tentang Peradilan Agama.',
          },
        ],
      },
      {
        'type': 'list-item',
        'children': [
          {
            'text':
              'Sanksi: Meskipun tidak ada sanksi pidana langsung, perceraian di luar pengadilan dapat menimbulkan masalah hukum di kemudian hari.',
          },
        ],
      },
    ],
  },
  {
    'type': 'paragraph',
    'children': [
      {
        'text': ' ',
      },
    ],
  },
  {
    'type': 'paragraph',
    'children': [
      {
        'text': 'III.  KESIMPULAN',
        'bold': true,
      },
    ],
  },
  {
    'type': 'paragraph',
    'children': [
      {
        'text': ' ',
      },
    ],
  },
  {
    'type': 'paragraph',
    'children': [
      {
        'text': 'Berdasarkan pembahasan di atas, dapat disimpulkan:',
      },
    ],
  },
  {
    'type': 'numbering',
    'children': [
      {
        'type': 'list-item',
        'children': [
          {
            'text':
              'UU Cipta Kerja telah memasuki tahap implementasi dengan diterbitkannya beberapa peraturan pelaksana. Namun, masih diperlukan pengawasan dan evaluasi berkelanjutan terhadap implementasinya.',
          },
        ],
      },
      {
        'type': 'list-item',
        'children': [
          {
            'text':
              'Perceraian di Indonesia hanya sah jika dilakukan melalui prosedur pengadilan yang resmi. Perceraian tanpa melapor ke negara tidak memiliki kekuatan hukum dan dapat menimbulkan masalah hukum di kemudian hari.',
          },
        ],
      },
    ],
  },
  {
    'type': 'paragraph',
    'children': [
      {
        'text': 'Rekomendasi:',
      },
    ],
  },
  {
    'type': 'numbering',
    'children': [
      {
        'type': 'list-item',
        'children': [
          {
            'text':
              'Pemerintah perlu terus mensosialisasikan dan mengevaluasi implementasi UU Cipta Kerja serta peraturan turunannya untuk memastikan efektivitas dan kepatuhan.',
          },
        ],
      },
      {
        'type': 'list-item',
        'children': [
          {
            'text':
              'Masyarakat harus diedukasi tentang pentingnya melakukan perceraian melalui jalur hukum yang sah untuk melindungi hak-hak semua pihak yang terlibat.',
          },
        ],
      },
      {
        'type': 'list-item',
        'children': [
          {
            'text':
              'Penegak hukum dan lembaga peradilan perlu memastikan proses perceraian yang efisien dan adil sesuai dengan ketentuan hukum yang berlaku.',
          },
        ],
      },
    ],
  },
  {
    'type': 'paragraph',
    'children': [
      {
        'text': ' ',
      },
    ],
  },
  {
    'type': 'paragraph',
    'children': [
      {
        'text': 'LAMPIRAN DASAR HUKUM',
        'bold': true,
      },
    ],
  },
  {
    'type': 'paragraph',
    'children': [
      {
        'text': ' ',
      },
    ],
  },
  {
    'type': 'paragraph',
    'children': [
      {
        'text':
          'Berikut adalah daftar peraturan perundang-undangan yang dirujuk dalam memorandum ini:',
      },
    ],
  },
  {
    'type': 'bullets',
    'children': [
      {
        'type': 'list-item',
        'children': [
          {
            'text': '',
          },
          {
            'type': 'link',
            'url': 'https://en.wikipedia.org/wiki/Hypertext',
            'children': [
              {
                'text': 'Undang-Undang Nomor 11 Tahun 2020 tentang Cipta Kerja',
              },
            ],
          },
          {
            'text': '',
          },
        ],
      },
      {
        'type': 'list-item',
        'children': [
          {
            'text': '',
          },
          {
            'type': 'link',
            'url': 'https://en.wikipedia.org/wiki/Hypertext',
            'children': [
              {
                'text': 'Undang-Undang Nomor 1 Tahun 1974 tentang Perkawinan',
              },
            ],
          },
          {
            'text': '',
          },
        ],
      },
      {
        'type': 'list-item',
        'children': [
          {
            'text': '',
          },
          {
            'type': 'link',
            'url': 'https://en.wikipedia.org/wiki/Hypertext',
            'children': [
              {
                'text':
                  'Undang-Undang Nomor 7 Tahun 1989 tentang Peradilan Agama',
              },
            ],
          },
          {
            'text': '',
          },
        ],
      },
      {
        'type': 'list-item',
        'children': [
          {
            'text': '',
          },
          {
            'type': 'link',
            'url': 'https://en.wikipedia.org/wiki/Hypertext',
            'children': [
              {
                'text':
                  'Peraturan Pemerintah Nomor 35 Tahun 2021 tentang Perjanjian Kerja Waktu Tertentu, Alih Daya, Waktu Kerja dan Waktu Istirahat, dan Pemutusan Hubungan Kerja',
              },
            ],
          },
          {
            'text': '',
          },
        ],
      },
      {
        'type': 'list-item',
        'children': [
          {
            'text': '',
          },
          {
            'type': 'link',
            'url': 'https://en.wikipedia.org/wiki/Hypertext',
            'children': [
              {
                'text':
                  'Peraturan Pemerintah Nomor 36 Tahun 2021 tentang Pengupahan',
              },
            ],
          },
          {
            'text': '',
          },
        ],
      },
      {
        'type': 'list-item',
        'children': [
          {
            'text': '',
          },
          {
            'type': 'link',
            'url': 'https://en.wikipedia.org/wiki/Hypertext',
            'children': [
              {
                'text':
                  'Keputusan Menteri Ketenagakerjaan Nomor 104 Tahun 2021 tentang Pedoman Pelaksanaan Hubungan Kerja Selama Masa Pandemi Corona Virus Disease 2019 (COVID-19)',
              },
            ],
          },
          {
            'text': '',
          },
        ],
      },
    ],
  },
] as any;

export default function Page() {
  const [jsonValue, setJsonValue] = useState<string>(
    JSON.stringify(init, null, 2)
  );

  const [value, setValue] = useState<Descendant[]>(init);

  return (
    <div className="mt-8 mx-auto w-[1096px] flex gap-2">
      <form className="w-[384px] h-[712px] sticky top-8">
        <textarea
          placeholder="Type json memo here start with array... [];"
          className="w-full p-2 border border-blue-500"
          defaultValue={jsonValue}
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
