/**
 * Constantes spécifiques au backend
 * Importe depuis la source de vérité (shared)
 */

import { 
  SEXE_OPTIONS, 
  GROUPE_SANGUIN_OPTIONS, 
  TYPE_PATIENT_OPTIONS,
  SITUATION_FAMILIALE_OPTIONS 
} from '../shared/constants/patient';

import { CAUSE_FIN_OPTIONS } from '../shared/constants/operations';

/**
 * Re-export des constantes depuis shared
 * Pour utilisation dans le backend
 */
export const VALID_SEXE = SEXE_OPTIONS;
export const VALID_GROUPE_SANGUIN = GROUPE_SANGUIN_OPTIONS;
export const VALID_TYPE_PATIENT = TYPE_PATIENT_OPTIONS;
export const VALID_SITUATION_FAMILIALE = SITUATION_FAMILIALE_OPTIONS;
export const VALID_CAUSE_FIN = CAUSE_FIN_OPTIONS;

/**
 * Constantes spécifiques à l'API
 */
export const API_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 50,
  MAX_PAGE_SIZE: 100,
  TOKEN_HEADER: 'Authorization',
  TOKEN_PREFIX: 'Bearer',
} as const;

/**
 * Constantes de validation pour l'authentification
 */
export const VALIDATION_CONSTANTS = {
  MIN_PASSWORD_LENGTH: 3,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 50,
  BCRYPT_ROUNDS: 10, // Rounds de hashing bcrypt
} as const;