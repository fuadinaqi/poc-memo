import { Badan } from '../_providers/SmartdocProvider';

export const DUMMY_BADAN: Badan = [
  {
    type: 'bab',
    id: 'bab1',
    title: 'BAB I',
    text: [
      {
        type: 'title',
        children: [
          {
            text: 'KETENTUAN UMUM',
            bold: true,
          },
        ],
      },
    ],
    list: [
      {
        type: 'bagian',
        id: 'bab1-bag1',
        title: 'Bagian Kesatu',
        text: [
          {
            type: 'paragraph',
            children: [
              {
                text: 'Anggaran Dasar dan Perubahan Anggaran Dasar',
                bold: true,
              },
            ],
          },
        ],
        list: [
          {
            type: 'paragraf',
            id: 'bab1-bag1-par1',
            title: 'Paragraf 1',
            text: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: 'Anggaran Dasar',
                    bold: true,
                  },
                ],
              },
            ],
            list: [
              {
                type: 'pasal',
                id: 'bab1-bag1-par1-pas1',
                title: 'Pasal 1',
                text: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        text: 'Dalam Undang-Undang ini yang dimaksud dengan:',
                      },
                    ],
                  },
                ],
                list: [
                  {
                    type: 'ayat',
                    id: 'bab1-bag1-par1-pas1-ayat1',
                    text: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: 'Anggaran Dasar adalah anggaran dasar suatu perseroan terbatas yang memuat ketentuan-ketentuan mengenai susunan dan kepengurusan perseroan terbatas serta hak dan kewajiban pemegang saham.',
                          },
                        ],
                      },
                    ],
                    list: [
                      {
                        type: 'bullet',
                        id: 'bab1-bag1-par1-pas1-ayat1-bullet1',
                        list: [
                          {
                            type: 'text_content',
                            id: 'bab1-bag1-par1-pas1-ayat1-bullet1-1',
                            text: [
                              {
                                type: 'paragraph',
                                children: [
                                  {
                                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                                  },
                                ],
                              },
                            ],
                          },
                          {
                            type: 'text_content',
                            id: 'bab1-bag1-par1-pas1-ayat1-bullet1-2',
                            text: [
                              {
                                type: 'paragraph',
                                children: [
                                  {
                                    text: 'Sit amet, consectetur adipiscing elit.',
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'ayat',
                    id: 'bab1-bag1-par1-pas1-ayat2',
                    text: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: 'Anggaran Dasar dapat diubah dengan memperhatikan ketentuan dalam Undang-Undang ini dan peraturan pelaksanaannya.',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'ayat',
                    id: 'bab1-bag1-par1-pas1-ayat3',
                    text: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: 'Perubahan Anggaran Dasar harus mendapat persetujuan dari Menteri.',
                          },
                        ],
                      },
                    ],
                    list: [
                      {
                        type: 'numbering',
                        id: 'bab1-bag1-par1-pas1-ayat3-numbering1',
                        list: [
                          {
                            type: 'text_content',
                            id: 'bab1-bag1-par1-pas1-ayat3-numbering1-1',
                            text: [
                              {
                                type: 'paragraph',
                                children: [
                                  {
                                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                                  },
                                ],
                              },
                            ],
                          },
                          {
                            type: 'text_content',
                            id: 'bab1-bag1-par1-pas1-ayat3-numbering1-2',
                            text: [
                              {
                                type: 'paragraph',
                                children: [
                                  {
                                    text: 'Sit amet, consectetur adipiscing elit.',
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'ayat',
                    id: 'bab1-bag1-par1-pas1-ayat4',
                    text: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: 'Perubahan Anggaran Dasar harus mendapat persetujuan dari Menteri.',
                          },
                        ],
                      },
                    ],
                    list: [
                      {
                        type: 'alphabet',
                        id: 'bab1-bag1-par1-pas1-ayat4-alphabet1',
                        list: [
                          {
                            type: 'text_content',
                            id: 'bab1-bag1-par1-pas1-ayat4-alphabet1-1',
                            text: [
                              {
                                type: 'paragraph',
                                children: [
                                  {
                                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                                  },
                                ],
                              },
                            ],
                          },
                          {
                            type: 'text_content',
                            id: 'bab1-bag1-par1-pas1-ayat4-alphabet1-2',
                            text: [
                              {
                                type: 'paragraph',
                                children: [
                                  {
                                    text: 'Sit amet, consectetur adipiscing elit.',
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'ayat',
                    id: 'bab1-bag1-par1-pas1-ayat5',
                    text: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: 'Perubahan Anggaran Dasar harus mendapat persetujuan dari Menteri menurut ',
                          },
                          {
                            text: 'Undang-Undang Nomor 40 Tahun 2007 tentang Perseroan Terbatas',
                            italic: true,
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
            ],
          },
        ],
      },
      {
        type: 'bagian',
        id: 'bab1-bag2',
        title: 'Bagian Kedua',
        text: [
          {
            type: 'paragraph',
            children: [
              {
                text: 'Pendirian Perseroan Terbatas',
                bold: true,
              },
            ],
          },
        ],
        list: [
          {
            type: 'paragraf',
            id: 'bab1-bag2-par1',
            title: 'Paragraf 1',
            text: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: 'Perseroan Terbatas didirikan oleh dua orang atau lebih dengan membuat Anggaran Dasar yang dibuat dalam akta notaris.',
                    bold: true,
                  },
                ],
              },
            ],
            list: [
              {
                type: 'pasal',
                id: 'bab1-bag2-par1-pas1',
                title: 'Pasal 2',
                text: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        text: 'Dalam Undang-Undang ini yang dimaksud dengan:',
                      },
                    ],
                  },
                ],
                list: [
                  {
                    type: 'ayat',
                    id: 'bab1-bag2-par1-pas1-ayat1',
                    text: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: 'Perseroan Terbatas adalah perseroan terbatas yang saham-sahamnya diperdagangkan di bursa efek.',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: 'paragraf',
            id: 'bab1-bag2-par2',
            title: 'Paragraf 2',
            text: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: 'Perseroan Terbatas yang didirikan oleh dua orang atau lebih dengan membuat Anggaran Dasar yang dibuat dalam akta notaris.',
                    bold: true,
                  },
                ],
              },
            ],
            list: [
              {
                type: 'pasal',
                id: 'bab1-bag2-par2-pas1',
                title: 'Pasal 3',
                text: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        text: 'Perseroan Terbatas yang didirikan oleh dua orang atau lebih dengan membuat Anggaran Dasar yang dibuat dalam akta notaris.',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    type: 'bab',
    id: 'bab2',
    title: 'BAB II',
    text: [
      {
        type: 'title',
        children: [
          {
            text: 'PERUSAHAAN TERBUKA',
            bold: true,
          },
        ],
      },
    ],
    list: [
      {
        type: 'bagian',
        id: 'bab2-bag1',
        title: 'Bagian Kesatu',
        text: [
          {
            type: 'title',
            children: [
              {
                text: 'Pendirian Perseroan Terbatas',
                bold: true,
              },
            ],
          },
        ],
        list: [
          {
            type: 'paragraf',
            id: 'bab2-bag1-par1',
            title: 'Paragraf 1',
            text: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: 'Perusahaan Terbuka',
                    bold: true,
                  },
                ],
              },
            ],
            list: [
              {
                type: 'pasal',
                id: 'bab2-bag1-par1-pas1',
                title: 'Pasal 4',
                text: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        text: 'Dalam Undang-Undang ini yang dimaksud dengan:',
                      },
                    ],
                  },
                ],
                list: [
                  {
                    type: 'ayat',
                    id: 'bab2-bag1-par1-pas1-ayat1',
                    text: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: 'Perusahaan Terbuka adalah perseroan terbatas yang saham-sahamnya diperdagangkan di bursa efek.',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'ayat',
                    id: 'bab2-bag1-par1-pas1-ayat2',
                    text: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: 'Perusahaan Terbuka wajib menyampaikan laporan keuangan tahunan dan laporan tahunan kegiatan usaha kepada pemegang saham.',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                type: 'pasal',
                id: 'bab2-bag1-par1-pas2',
                title: 'Pasal 5',
                text: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        text: 'Perusahaan Terbuka wajib menyampaikan laporan keuangan tahunan dan laporan tahunan kegiatan usaha kepada pemegang saham.',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: 'paragraf',
            id: 'bab2-par2',
            title: 'Paragraf 2',
            text: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: 'Pencatatan Saham',
                    bold: true,
                  },
                ],
              },
            ],
            list: [
              {
                type: 'pasal',
                id: 'bab2-par2-pas1',
                title: 'Pasal 6',
                // text: [
                //   {
                //     type: 'paragraph',
                //     children: [
                //       {
                //         text: 'Pencatatan saham Perusahaan Terbuka dilakukan oleh Bursa Efek.',
                //       },
                //     ],
                //   },
                // ],
                list: [
                  {
                    type: 'ayat',
                    id: 'bab2-par2-pas1-ayat1',
                    text: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: 'Pencatatan saham Perusahaan Terbuka dilakukan oleh Bursa Efek.',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'ayat',
                    id: 'bab2-par2-pas1-ayat2',
                    text: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            text: 'Pencatatan saham Perusahaan Terbuka dilakukan oleh Bursa Efek.',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    type: 'bab',
    id: 'bab3',
    title: 'BAB III',
    text: [
      {
        type: 'title',
        children: [
          {
            text: 'PERUSAHAAN TERTUTUP',
            bold: true,
          },
        ],
      },
    ],
    list: [
      {
        type: 'pasal',
        id: 'bab3-pas1',
        title: 'Pasal 7',
        text: [
          {
            type: 'paragraph',
            children: [
              {
                text: 'lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
              },
            ],
          },
        ],
      },
    ],
  },
];
