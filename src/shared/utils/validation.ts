/**
 * Utilitaires de validation
 * SOURCE DE VÉRITÉ - Copie de src/shared/utils/validation.ts
 */

import { Patient } from '../types/patient';

/**
 * Valide les données d'un patient
 * Retourne un tableau d'erreurs (vide si tout est valide)
 */
export const validatePatientData = (patient: Partial<Patient>): string[] => {
  const errors: string[] = [];
  
  // Vérifications des champs obligatoires
  if (!patient.nom_complet?.trim()) {
    errors.push('Le nom complet est obligatoire');
  }
  
  if (!patient.cin) {
    errors.push('Le CIN est obligatoire');
  }
  
  if (!patient.ass_cnss?.trim()) {
    errors.push('L\'Ass/CNSS est obligatoire');
  }
  
  if (!patient.date_naissance) {
    errors.push('La date de naissance est obligatoire');
  }
  
  if (!patient.sexe) {
    errors.push('Le sexe est obligatoire');
  }
  
  if (!patient.groupe_sanguin) {
    errors.push('Le groupe sanguin est obligatoire');
  }
  
  if (!patient.date_debut) {
    errors.push('La date de début est obligatoire');
  }
  
  if (!patient.type_patient) {
    errors.push('Le type de patient est obligatoire');
  }
  
  return errors;
};

/**
 * Génère un ID unique basé sur le timestamp
 */
export const generatePatientId = (): number => {
  return Date.now();
};