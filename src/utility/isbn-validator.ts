export function isValidIsbn(value: string): boolean {
  const normalized = value.replace(/[-\s]/g, '');

  if (/^\d{9}[\dX]$/i.test(normalized)) {
    const chars = normalized.toUpperCase().split('');
    const checksum = chars.reduce((sum, char, index) => {
      const digit = char === 'X' ? 10 : Number(char);
      return sum + digit * (10 - index);
    }, 0);

    return checksum % 11 === 0;
  }

  if (/^\d{13}$/.test(normalized)) {
    const digits = normalized.split('').map((char) => Number(char));
    const checksum = digits.slice(0, 12).reduce((sum, digit, index) => {
      return sum + digit * (index % 2 === 0 ? 1 : 3);
    }, 0);
    const checkDigit = (10 - (checksum % 10)) % 10;

    return checkDigit === digits[12];
  }

  return false;
}
