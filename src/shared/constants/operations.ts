/**
 * Constantes pour les opérations
 * SOURCE DE VÉRITÉ - Copie de src/shared/constants/operations.ts
 */

// Options de cause de fin de traitement
export const CAUSE_FIN_OPTIONS = ['Transféré', 'Décès', 'Greffe'] as const;

export type CauseFinOption = typeof CAUSE_FIN_OPTIONS[number];