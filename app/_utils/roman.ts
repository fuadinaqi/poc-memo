// Function to convert number to Roman numeral
export function numberToRoman(num: number): string {
  const romanNumerals: [number, string][] = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ];

  let result = '';

  for (const [value, symbol] of romanNumerals) {
    while (num >= value) {
      result += symbol;
      num -= value;
    }
  }

  return result;
}

// Function to convert Roman numeral to number
export function romanToNumber(roman: string): number {
  const romanToNumberMap: { [key: string]: number } = {
    'M': 1000,
    'CM': 900,
    'D': 500,
    'CD': 400,
    'C': 100,
    'XC': 90,
    'L': 50,
    'XL': 40,
    'X': 10,
    'IX': 9,
    'V': 5,
    'IV': 4,
    'I': 1,
  };

  let result = 0;
  let i = 0;

  while (i < roman.length) {
    const twoChar = roman.slice(i, i + 2);
    if (romanToNumberMap[twoChar] != null) {
      result += romanToNumberMap[twoChar];
      i += 2;
    } else {
      result += romanToNumberMap[roman[i]];
      i += 1;
    }
  }

  return result;
}
