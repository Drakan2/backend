/**
 * Constantes pour les patients
 * SOURCE DE VÉRITÉ - Copie de src/shared/constants/patient.ts
 */

// Options pour les sélections
export const SEXE_OPTIONS = ['Homme', 'Femme'] as const;
export const GROUPE_SANGUIN_OPTIONS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
export const TYPE_PATIENT_OPTIONS = ['Permanent', 'Vacancier', 'Fin Traitement'] as const;
export const SITUATION_FAMILIALE_OPTIONS = ['Célibataire', 'Marié(e)', 'Divorcé(e)', 'Veuf(ve)'] as const;