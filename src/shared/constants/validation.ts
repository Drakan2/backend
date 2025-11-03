/**
 * Constantes de validation
 * SOURCE DE VÉRITÉ - Copie de src/shared/constants/validation.ts
 */

export const VALIDATION_REGEX = {
  PHONE: /^[0-9]{8}$/,
  CIN: /^[0-9]{8}$/,
};

export const VALIDATION_LIMITS = {
  CIN_MAX_LENGTH: 8,
  CIN_MNI_LENGTH: 8,
  PHONE_MAX_LENGTH: 8,
  PHONE_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
};

export const ERROR_MESSAGES = {
  REQUIRED: 'Ce champ est obligatoire',
  INVALID_PHONE: 'Numéro de téléphone invalide',
  INVALID_CIN: 'Format CIN invalide',
};

// Fonctions de validation supplémentaires
export const validatePhone = (phone: string): boolean => {
  return VALIDATION_REGEX.PHONE.test(phone.replace(/\s/g, ''));
};

export const validateCIN = (cin: string): boolean => {
  return VALIDATION_REGEX.CIN.test(cin.replace(/\s/g, ''));
};

// Fonctions de formatage
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.slice(0, 8); // Garde seulement les 8 premiers chiffres
};

export const formatCIN = (cin: string): string => {
  const cleaned = cin.replace(/\D/g, '');
  return cleaned.slice(0, 8); // Garde seulement les 8 premiers chiffres
};

// Exemples de numéros valides :
// CIN : "01234567", "12345678", "00000001", "99999999"
// Téléphone : "06123456", "05123456", "07123456", "01234567"