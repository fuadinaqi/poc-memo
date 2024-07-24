const sentences = [
  'Kesatu',
  'Kedua',
  'Ketiga',
  'Keempat',
  'Kelima',
  'Keenam',
  'Ketujuh',
  'Kedelapan',
  'Kesembilan',
  'Kesepuluh',
  'Kesebelas',
  'Kedua belas',
  'Ketiga belas',
  'Keempat belas',
];

export function numberToSentence(num: number): string {
  return sentences[num - 1];
}

export function sentenceToNumber(sentence: string): number {
  return sentences.indexOf(sentence) + 1;
}
