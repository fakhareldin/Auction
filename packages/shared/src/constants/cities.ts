// Array of cities with name and code
export const SUDAN_CITIES = [
  { nameAr: 'الخرطوم', nameEn: 'Khartoum', code: 'khartoum' },
  { nameAr: 'أم درمان', nameEn: 'Omdurman', code: 'omdurman' },
  { nameAr: 'بحري', nameEn: 'Bahri', code: 'bahri' },
  { nameAr: 'بورتسودان', nameEn: 'Port Sudan', code: 'port_sudan' },
  { nameAr: 'نيالا', nameEn: 'Nyala', code: 'nyala' },
  { nameAr: 'الأبيض', nameEn: 'El Obeid', code: 'el_obeid' },
  { nameAr: 'القضارف', nameEn: 'Gedaref', code: 'gedaref' },
  { nameAr: 'كسلا', nameEn: 'Kassala', code: 'kassala' },
  { nameAr: 'الفاشر', nameEn: 'El Fasher', code: 'el_fasher' },
  { nameAr: 'كوستي', nameEn: 'Kosti', code: 'kosti' },
  { nameAr: 'ود مدني', nameEn: 'Wad Madani', code: 'wad_madani' },
  { nameAr: 'الجنينة', nameEn: 'El Geneina', code: 'el_geneina' },
  { nameAr: 'عطبرة', nameEn: 'Atbara', code: 'atbara' },
  { nameAr: 'سنار', nameEn: 'Sennar', code: 'sennar' },
  { nameAr: 'ربك', nameEn: 'Rabak', code: 'rabak' },
  { nameAr: 'الدمازين', nameEn: 'Damazin', code: 'damazin' },
  { nameAr: 'دنقلا', nameEn: 'Dongola', code: 'dongola' },
  { nameAr: 'مروي', nameEn: 'Merowe', code: 'merowe' },
  { nameAr: 'شندي', nameEn: 'Shendi', code: 'shendi' },
  { nameAr: 'الدويم', nameEn: 'Ed Dueim', code: 'ed_dueim' },
] as const;

// Keep SAUDI_CITIES for backward compatibility
export const SAUDI_CITIES = SUDAN_CITIES;

export type CitCode = (typeof SUDAN_CITIES)[number]['code'];

// Simple array of city names (Arabic) for simple dropdowns
export const CITIES = SUDAN_CITIES.map(city => city.nameAr);
