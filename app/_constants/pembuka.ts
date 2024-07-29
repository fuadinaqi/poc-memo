import { Pembukaan } from '../_providers/SmartdocProvider';

export const DUMMY_PEMBUKAAN: Pembukaan = {
  judul: {
    id: 'judul',
    type: 'judul',
    hierarki: 'UNDANG-UNDANG REPUBLIK INDONESIA',
    nomor: 40,
    tahun: 2007,
    tentang: 'PERSERO TERBATAS',
  },
  doa: {
    id: 'doa',
    type: 'doa',
    text: 'DENGAN RAHMAT TUHAN YANG MAHA ESA',
  },
  pihak: {
    id: 'pihak',
    type: 'pihak',
    text: 'PRESIDEN REPUBLIK INDONESIA',
  },
  menimbang: {
    id: 'menimbang',
    type: 'alphabet',
    list: [
      {
        id: 'menimbang_alphabet_1',
        type: 'text_content',
        text: [
          {
            type: 'paragraph',
            children: [
              {
                text: 'bahwa perekonomian nasional yang diselenggarakan berdasar atas demokrasi ekonomi dengan prinsip kebersamaan, efisiensi berkeadilan, berkelanjutan, berwawasan lingkungan, kemandirian, serta dengan menjaga keseimbangan kemajuan dan kesatuan ekonomi nasional, perlu didukung oleh kelembagaan perekonomian yang kokoh dalam rangka mewujudkan kesejahteraan masyarakat;',
              },
            ],
          },
        ],
      },
      {
        id: 'menimbang_alphabet_2',
        type: 'text_content',
        text: [
          {
            type: 'paragraph',
            children: [
              {
                text: 'bahwa dalam rangka lebih meningkatkan pembangunan perekonomian nasional dan sekaligus memberikan landasan yang kokoh bagi dunia usaha dalam menghadapi perkembangan perekonomian dunia dan kemajuan ilmu pengetahuan dan teknologi di era globalisasi pada masa mendatang, perlu didukung oleh suatu undang-undang yang mengatur tentang perseroan terbatas yang dapat menjamin terselenggaranya iklim dunia usaha yang kondusif;',
              },
            ],
          },
        ],
      },
      {
        id: 'menimbang_alphabet_3',
        type: 'text_content',
        text: [
          {
            type: 'paragraph',
            children: [
              {
                text: 'bahwa perseroan terbatas sebagai salah satu pilar pembangunan perekonomian nasional perlu diberikan landasan hukum untuk lebih memacu pembangunan nasional yang disusun sebagai usaha bersama berdasar atas asas kekeluargaan;',
              },
            ],
          },
        ],
      },
      {
        id: 'menimbang_alphabet_4',
        type: 'text_content',
        text: [
          {
            type: 'paragraph',
            children: [
              {
                text: 'bahwa Undang-Undang Nomor 1 Tahun 1995 tentang Perseroan Terbatas dipandang sudah tidak sesuai lagi dengan perkembangan hukum dan kebutuhan masyarakat sehingga perlu diganti dengan undang-undang yang baru ',
              },
              {
                text: 'Undang-Undang Nomor 1 Tahun 1995 ',
                underline: true,
                bold: true,
              },
              {
                text: 'tentang Perseroan Terbatas dipandang sudah tidak sesuai lagi dengan perkembangan hukum dan kebutuhan masyarakat sehingga perlu diganti dengan undang-undang yang baru;',
              },
            ],
          },
        ],
      },
    ],
  },
  mengingat: {
    id: 'mengingat',
    type: 'numbering',
    list: [
      {
        id: 'mengingat_numbering_1',
        type: 'text_content',
        text: [
          {
            type: 'paragraph',
            children: [
              {
                text: 'Pasal 5 ayat (1), Pasal 20, dan Pasal 33 ',
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
      },
      {
        id: 'mengingat_numbering_2',
        type: 'text_content',
        text: [
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
      },
    ],
  },
  memperhatikan: {
    id: 'memperhatikan',
    type: 'numbering',
    list: [
      {
        id: 'memperhatikan_numbering_1',
        type: 'text_content',
        text: [
          {
            type: 'paragraph',
            children: [
              {
                text: 'bahwa dalam rangka meningkatkan daya saing dan daya tahan perseroan terbatas dalam menghadapi persaingan global, perlu diatur mengenai perseroan terbatas;',
              },
            ],
          },
        ],
      },
      {
        id: 'memperhatikan_numbering_2',
        type: 'text_content',
        text: [
          {
            type: 'paragraph',
            children: [
              {
                text: 'bahwa dalam rangka mewujudkan perseroan terbatas yang transparan, akuntabel, dan berdaya saing, perlu diatur mengenai perseroan terbatas;',
              },
            ],
          },
        ],
      },
    ],
  },
  setuju: {
    id: 'setuju',
    type: 'setuju',
    intro: 'Dengan Persetujuan Bersama Antara:',
    pihak1: 'DEWAN PERWAKILAN RAKYAT REPUBLIK INDONESIA',
    pihak2: 'PRESIDEN REPUBLIK INDONESIA',
  },
  memutuskan: {
    id: 'memutuskan',
    type: 'memutuskan',
    text: 'UNDANG-UNDANG TENTANG PERSEROAN TERBATAS.',
  },
};

// export const DUMMY_PEMBUKAAN: Pembukaan = {
//   judul: {
//     id: 'judul',
//     text: [
//       {
//         type: 'title',
//         children: [
//           {
//             text: 'UNDANG-UNDANG REPUBLIK INDONESIA NOMOR 40 TAHUN 2007 TENTANG PERSEROAN TERBATAS',
//           },
//         ],
//       },
//     ],
//   },
//   doa: {
//     id: 'doa',
//     text: [
//       {
//         type: 'paragraph',
//         children: [
//           {
//             text: 'DENGAN RAHMAT TUHAN YANG MAHA ESA PRESIDEN REPUBLIK INDONESIA',
//           },
//         ],
//       },
//     ],
//   },
//   menimbang: {
//     id: 'menimbang',
//     data: {
//       id: 'menimbang_alphabet',
//       type: 'alphabet',
//       list: [
//         {
//           id: 'menimbang_1',
//           type: 'text_content',
//           text: [
//             {
//               type: 'paragraph',
//               children: [
//                 {
//                   text: 'bahwa perekonomian nasional yang diselenggarakan berdasar atas demokrasi ekonomi dengan prinsip kebersamaan, efisiensi berkeadilan, berkelanjutan, berwawasan lingkungan, kemandirian, serta dengan menjaga keseimbangan kemajuan dan kesatuan ekonomi nasional, perlu didukung oleh kelembagaan perekonomian yang kokoh dalam rangka mewujudkan kesejahteraan masyarakat;',
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: 'menimbang_2',
//           type: 'text_content',
//           text: [
//             {
//               type: 'paragraph',
//               children: [
//                 {
//                   text: 'bahwa dalam rangka lebih meningkatkan pembangunan perekonomian nasional dan sekaligus memberikan landasan yang kokoh bagi dunia usaha dalam menghadapi perkembangan perekonomian dunia dan kemajuan ilmu pengetahuan dan teknologi di era globalisasi pada masa mendatang, perlu didukung oleh suatu undang-undang yang mengatur tentang perseroan terbatas yang dapat menjamin terselenggaranya iklim dunia usaha yang kondusif;',
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: 'menimbang_3',
//           type: 'text_content',
//           text: [
//             {
//               type: 'paragraph',
//               children: [
//                 {
//                   text: 'bahwa perseroan terbatas sebagai salah satu pilar pembangunan perekonomian nasional perlu diberikan landasan hukum untuk lebih memacu pembangunan nasional yang disusun sebagai usaha bersama berdasar atas asas kekeluargaan;',
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: 'menimbang_4',
//           type: 'text_content',
//           text: [
//             {
//               type: 'paragraph',
//               children: [
//                 {
//                   text: 'bahwa Undang-Undang Nomor 1 Tahun 1995 tentang Perseroan Terbatas dipandang sudah tidak sesuai lagi dengan perkembangan hukum dan kebutuhan masyarakat sehingga perlu diganti dengan undang-undang yang baru ',
//                 },
//                 {
//                   text: 'Undang-Undang Nomor 1 Tahun 1995 ',
//                   underline: true,
//                   bold: true,
//                 },
//                 {
//                   text: 'tentang Perseroan Terbatas dipandang sudah tidak sesuai lagi dengan perkembangan hukum dan kebutuhan masyarakat sehingga perlu diganti dengan undang-undang yang baru;',
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: 'menimbang_5',
//           type: 'text_content',
//           text: [
//             {
//               type: 'paragraph',
//               children: [
//                 {
//                   text: 'Pasal 5 ayat (1), Pasal 20, dan Pasal 33 ',
//                 },
//                 {
//                   text: 'Undang-Undang Dasar Negara Republik Indonesia Tahun 1945.',
//                   underline: true,
//                   bold: true,
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//   },
//   mengingat: {
//     id: 'mengingat',
//     data: {
//       id: 'mengingat_numbering',
//       type: 'numbering',
//       list: [
//         {
//           id: 'mengingat_1',
//           type: 'text_content',
//           text: [
//             {
//               type: 'paragraph',
//               children: [
//                 {
//                   text: 'Pasal 5 ayat (1), Pasal 20 ayat (2), Pasal 27 ayat (2), Pasal 28, dan Pasal 33 ayat (1) ',
//                 },
//                 {
//                   text: 'Undang-Undang Dasar Negara Republik Indonesia Tahun 1945',
//                   underline: true,
//                 },
//                 {
//                   text: '.',
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//   },
//   setuju: {
//     id: 'setuju',
//     text: [
//       {
//         type: 'paragraph',
//         children: [
//           {
//             text: 'Dengan Persetujuan Bersama:',
//           },
//         ],
//       },
//       {
//         type: 'paragraph',
//         children: [
//           {
//             text: 'DEWAN PERWAKILAN RAKYAT REPUBLIK INDONESIA',
//           },
//         ],
//       },
//       {
//         type: 'paragraph',
//         children: [
//           {
//             text: 'DAN',
//           },
//         ],
//       },
//       {
//         type: 'paragraph',
//         children: [
//           {
//             text: 'PRESIDEN REPUBLIK INDONESIA',
//           },
//         ],
//       },
//     ],
//   },
//   memutuskan: {
//     id: 'memutuskan',
//     text: [
//       {
//         type: 'paragraph',
//         children: [
//           {
//             text: 'UNDANG-UNDANG TENTANG PERSEROAN TERBATAS.',
//           },
//         ],
//       },
//     ],
//   },
// };
