import type { 
  Patient, 
  Sexe, 
  GroupeSanguin, 
  TypePatient, 
  CauseFin, 
  SituationFamiliale 
} from '../shared/types/patient';
import type { User, UserRole } from '../shared/types/user';
import type { MedicalRecord } from '../shared/types/medical';
import type { Antecedent } from '../shared/types/antecedents';
import type { ID } from '../shared/types/common';

export interface PatientRow {
  id: ID;
  nom_complet: string;
  cin: string; // ← CHANGÉ EN STRING
  ass_cnss: string;
  date_naissance: string; // Format 'YYYY-MM-DD'
  sexe: Sexe;
  groupe_sanguin: GroupeSanguin;
  profession: string | null;
  situation_familiale: SituationFamiliale | null;
  telephone: string | null; // ← CHANGÉ EN STRING
  telephone_urgence: string | null; // ← CHANGÉ EN STRING
  adresse: string | null;
  date_debut: string; // Format 'YYYY-MM-DD'
  type_patient: TypePatient;
  date_fin: string | null; // Format 'YYYY-MM-DD'
  cause_fin: CauseFin | null;
  created_at: string;
  updated_at: string;
}

export interface UserRow {
  id: ID;
  username: string;
  password: string;
  role: UserRole;
  assigned_patients: ID[];
  created_at: string;
  updated_at: string;
}

export interface MedicalRecordRow {
  id: ID;
  patient_id: ID;
  category: string;
  date: string; // Format 'YYYY-MM-DD'
  details: string | null;
  created_by: ID;
  created_at: string;
  updated_at: string;
}

export interface AntecedentRow {
  id: number;
  patient_id: number;
  type: string;
  content: string;
  created_by: number;
  created_at: Date;
  updated_at: Date;
}

// Fonctions de conversion
export const rowToPatient = (row: PatientRow): Patient => ({
  id: row.id,
  nom_complet: row.nom_complet,
  cin: row.cin,
  ass_cnss: row.ass_cnss,
  date_naissance: new Date(row.date_naissance),
  sexe: row.sexe,
  groupe_sanguin: row.groupe_sanguin,
  profession: row.profession ?? undefined,
  situation_familiale: row.situation_familiale ?? undefined,
  telephone: row.telephone ?? undefined,
  telephone_urgence: row.telephone_urgence ?? undefined,
  adresse: row.adresse ?? undefined,
  date_debut: new Date(row.date_debut),
  type_patient: row.type_patient,
  date_fin: row.date_fin ? new Date(row.date_fin) : null,
  cause_fin: row.cause_fin ?? undefined,
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at),
});

export const rowToUser = (row: UserRow): User => ({
  id: row.id,
  username: row.username,
  password: row.password,
  role: row.role,
  assignedPatients: row.assigned_patients,
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at),
});

export const rowToMedicalRecord = (row: MedicalRecordRow): MedicalRecord => ({
  id: row.id,
  patientId: row.patient_id,
  category: row.category,
  date: new Date(row.date),
  details: row.details ?? undefined,
  createdBy: row.created_by,
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at),
});

export const rowToAntecedent = (row: AntecedentRow): Antecedent => ({
  id: row.id,
  patientId: row.patient_id,
  type: row.type as Antecedent['type'],
  content: row.content,
  createdBy: row.created_by,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});




