/**
 * Repository pour les patients
 * Gère toutes les opérations de base de données pour les patients
 */

import { BaseRepository } from './base.repository';
import { PatientRow, rowToPatient } from '../db/schema';
import type { Patient, TypePatient, Sexe, GroupeSanguin } from '../shared/types/patient';
import type { ID } from '../shared/types/common';

/**
 * Repository Patient
 * Hérite de BaseRepository et ajoute des méthodes spécifiques
 */
export class PatientRepository extends BaseRepository<Patient, PatientRow> {
  constructor() {
    super('patients', rowToPatient);
  }

  /**
   * Crée un nouveau patient dans la DB
   * @param patient - Données du patient (sans ID)
   * @returns Le patient créé avec son ID
   */
async create(patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Promise<Patient> {
  const { text, values } = this.buildInsertQuery({
    nom_complet: patient.nom_complet,
    cin: patient.cin,
    ass_cnss: patient.ass_cnss,
    date_naissance: patient.date_naissance,
    sexe: patient.sexe,
    groupe_sanguin: patient.groupe_sanguin,
    profession: patient.profession || null,  // ✅ Convertir "" en null
    situation_familiale: patient.situation_familiale || null,  // ✅ Convertir "" en null
    telephone: patient.telephone || null,
    telephone_urgence: patient.telephone_urgence || null,
    adresse: patient.adresse || null,
    date_debut: patient.date_debut,
    type_patient: patient.type_patient,
    date_fin: patient.date_fin || null,
    cause_fin: patient.cause_fin || null,
  });

  const rows = await this.executeQuery<PatientRow>(text, values);
  return this.rowMapper(rows[0]);
}


  /**
   * Met à jour un patient existant
   * @param id - ID du patient
   * @param patient - Données à mettre à jour (partielles)
   * @returns Le patient mis à jour ou null
   */
async update(id: ID, patient: Partial<Patient>): Promise<Patient | null> {
  const fields: Record<string, unknown> = {};

  // Construire l'objet fields avec seulement les champs fournis
  if (patient.nom_complet !== undefined) fields.nom_complet = patient.nom_complet;
  if (patient.cin !== undefined) fields.cin = patient.cin;
  if (patient.ass_cnss !== undefined) fields.ass_cnss = patient.ass_cnss;
  if (patient.date_naissance !== undefined) fields.date_naissance = patient.date_naissance;
  if (patient.sexe !== undefined) fields.sexe = patient.sexe;
  if (patient.groupe_sanguin !== undefined) fields.groupe_sanguin = patient.groupe_sanguin;

if (patient.profession !== undefined) fields.profession = patient.profession || null;
if (patient.situation_familiale !== undefined) fields.situation_familiale = patient.situation_familiale || null;
if (patient.telephone !== undefined) fields.telephone = patient.telephone || null;
if (patient.telephone_urgence !== undefined) fields.telephone_urgence = patient.telephone_urgence || null;
if (patient.adresse !== undefined) fields.adresse = patient.adresse || null;
  if (patient.date_debut !== undefined) fields.date_debut = patient.date_debut;

  if (patient.type_patient !== undefined) fields.type_patient = patient.type_patient;
  if (patient.date_fin !== undefined) fields.date_fin = patient.date_fin ?? null;
  if (patient.cause_fin !== undefined) fields.cause_fin = patient.cause_fin ?? null;

  // Si aucun champ à mettre à jour, retourner le patient actuel
  if (Object.keys(fields).length === 0) {
    return this.findById(id);
  }

  const { text, values } = this.buildUpdateQuery(fields, id);
  const rows = await this.executeQuery<PatientRow>(text, values);
  return rows.length > 0 ? this.rowMapper(rows[0]) : null;
}


  /**
   * Trouve les patients par type
   * @param type - Type de patient (Permanent, Vacancier, Fin Traitement)
   * @returns Array de patients du type demandé
   */
  async findByType(type: TypePatient): Promise<Patient[]> {
    const rows = await this.executeQuery<PatientRow>(
      `SELECT * FROM ${this.tableName} WHERE type_patient = $1`,
      [type]
    );
    return rows.map(this.rowMapper);
  }

  /**
   * Recherche de patients avec filtres multiples
   * @param filters - Filtres de recherche
   * @returns Array de patients correspondant aux filtres
   */
  async findByFilters(filters: {
    search?: string;
    sexe?: Sexe;
    type?: TypePatient;
    groupeSanguin?: GroupeSanguin;
  }): Promise<Patient[]> {
    const conditions: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    // Filtre par nom (recherche partielle insensible à la casse)
    if (filters.search) {
      conditions.push(`nom_complet ILIKE $${paramIndex}`);
      values.push(`%${filters.search}%`);
      paramIndex++;
    }

    // Filtre par sexe
    if (filters.sexe) {
      conditions.push(`sexe = $${paramIndex}`);
      values.push(filters.sexe);
      paramIndex++;
    }

    // Filtre par type
    if (filters.type) {
      conditions.push(`type_patient = $${paramIndex}`);
      values.push(filters.type);
      paramIndex++;
    }

    // Filtre par groupe sanguin
    if (filters.groupeSanguin) {
      conditions.push(`groupe_sanguin = $${paramIndex}`);
      values.push(filters.groupeSanguin);
      paramIndex++;
    }

    // Construire la clause WHERE
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    
    const rows = await this.executeQuery<PatientRow>(
      `SELECT * FROM ${this.tableName} ${whereClause} ORDER BY nom_complet`,
      values
    );

    return rows.map(this.rowMapper);
  }

  /**
   * Trouve plusieurs patients par leurs IDs
   * @param ids - Array d'IDs de patients
   * @returns Array de patients
   */
  async findByIds(ids: ID[]): Promise<Patient[]> {
    if (ids.length === 0) return [];
    
    const placeholders = ids.map((_, index) => `$${index + 1}`).join(',');
    const rows = await this.executeQuery<PatientRow>(
      `SELECT * FROM ${this.tableName} WHERE id IN (${placeholders})`,
      ids
    );
    return rows.map(this.rowMapper);
  }

  /**
   * Vérifie si un CIN existe déjà
   * @param cin - Numéro CIN à vérifier
   * @param excludeId - ID à exclure de la recherche (pour les updates)
   * @returns true si le CIN existe déjà
   */
  async existsByCin(cin: string, excludeId?: ID): Promise<boolean> {
    const queryText = excludeId
      ? `SELECT id FROM ${this.tableName} WHERE cin = $1 AND id != $2`
      : `SELECT id FROM ${this.tableName} WHERE cin = $1`;
    
    const params = excludeId ? [cin, excludeId] : [cin];
    const rows = await this.executeQuery<{ id: ID }>(queryText, params);
    return rows.length > 0;
  }
}