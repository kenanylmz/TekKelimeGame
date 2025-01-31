import dortKelime from '../Kelimeler/4Kelime';
import besKelime from '../Kelimeler/5Kelime';

// Sadece harf kontrolü için regex
const letterPattern = /^[a-zçğıöşüA-ZÇĞIİÖŞÜ]+$/;

export const isValidWord = word => {
  // Boş veya undefined kontrolü
  if (!word || word.trim().length === 0) return false;

  // Kelime uzunluğu kontrolü
  const length = word.trim().length;
  if (length !== 4 && length !== 5) return false;

  // Sadece harf içeriyor mu kontrolü
  return letterPattern.test(word);
};

export const normalizeTurkish = text => {
  return text
    .replace(/İ/g, 'i')
    .replace(/I/g, 'ı')
    .replace(/Ğ/g, 'ğ')
    .replace(/Ü/g, 'ü')
    .replace(/Ş/g, 'ş')
    .replace(/Ö/g, 'ö')
    .replace(/Ç/g, 'ç')
    .toLowerCase()
    .trim();
};
