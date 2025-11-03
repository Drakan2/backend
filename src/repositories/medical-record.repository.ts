/**
 * Repository pour les dossiers médicaux
 * Gère toutes les opérations de base de données pour les medical records
 */

import { BaseRepository } from './base.repository';
import { MedicalRecordRow, rowToMedicalRecord } from '../db/schema';
import type { MedicalRecord } from '../shared/types/medical';
import type { ID } from '../shared/types/common';

/**
 * Repository MedicalRecord
 */
export class MedicalRecordRepository extends BaseRepository<MedicalRecord, MedicalRecordRow> {
  constructor() {
    super('medical_records', rowToMedicalRecord);
  }

  /**
   * Crée un nouveau dossier médical
   * @param record - Données du dossier (sans ID)
   * @returns Le dossier créé avec son ID
   */
  async create(record: Omit<MedicalRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<MedicalRecord> {
    const { text, values } = this.buildInsertQuery({
      patient_id: record.patientId,
      category: record.category,
      date: record.date,
      details: record.details ?? null,
      created_by: record.createdBy,
    });

    const rows = await this.executeQuery<MedicalRecordRow>(text, values);
    return this.rowMapper(rows[0]);
  }

  /**
   * Met à jour un dossier médical
   * @param id - ID du dossier
   * @param record - Données à mettre à jour (partielles)
   * @returns Le dossier mis à jour ou null
   */
  async update(id: ID, record: Partial<MedicalRecord>): Promise<MedicalRecord | null> {
    const fields: Record<string, unknown> = {};

    if (record.category !== undefined) fields.category = record.category;
    if (record.date !== undefined) fields.date = record.date;
    if (record.details !== undefined) fields.details = record.details ?? null;

    if (Object.keys(fields).length === 0) {
      return this.findById(id);
    }

    const { text, values } = this.buildUpdateQuery(fields, id);
    const rows = await this.executeQuery<MedicalRecordRow>(text, values);
    return rows.length > 0 ? this.rowMapper(rows[0]) : null;
  }

  /**
   * Trouve tous les dossiers d'un patient
   * @param patientId - ID du patient
   * @returns Array de dossiers médicaux triés par date décroissante
   */
  async findByPatientId(patientId: ID): Promise<MedicalRecord[]> {
    const rows = await this.executeQuery<MedicalRecordRow>(
      `SELECT * FROM ${this.tableName} WHERE patient_id = $1 ORDER BY date DESC`,
      [patientId]
    );
    return rows.map(this.rowMapper);
  }

  /**
   * Trouve les dossiers d'un patient par catégorie
   * @param patientId - ID du patient
   * @param category - Catégorie (ex: 'antecedents', 'traitements')
   * @returns Array de dossiers de cette catégorie
   */
  async findByCategory(patientId: ID, category: string): Promise<MedicalRecord[]> {
    const rows = await this.executeQuery<MedicalRecordRow>(
      `SELECT * FROM ${this.tableName} 
       WHERE patient_id = $1 AND category = $2 
       ORDER BY date DESC`,
      [patientId, category]
    );
    return rows.map(this.rowMapper);
  }

  /**
   * Trouve les dossiers par catégorie ET sous-catégorie
   * @param patientId - ID du patient
   * @param category - Catégorie principale
   * @param subCategory - Sous-catégorie (ex: 'Médicaux', 'Chirurgicaux')
   * @returns Array de dossiers correspondants
   */
  async findByCategoryAndSubCategory(
    patientId: ID,
    category: string,
  ): Promise<MedicalRecord[]> {
    const rows = await this.executeQuery<MedicalRecordRow>(
      `SELECT * FROM ${this.tableName} 
       WHERE patient_id = $1 AND category = $2 
       ORDER BY date DESC`,
      [patientId, category]
    );
    return rows.map(this.rowMapper);
  }

  /**
   * Trouve les dossiers dans une plage de dates
   * @param patientId - ID du patient
   * @param startDate - Date de début
   * @param endDate - Date de fin
   * @returns Array de dossiers dans la plage
   */
  async findByDateRange(
    patientId: ID,
    startDate: Date,
    endDate: Date
  ): Promise<MedicalRecord[]> {
    const rows = await this.executeQuery<MedicalRecordRow>(
      `SELECT * FROM ${this.tableName} 
       WHERE patient_id = $1 AND date BETWEEN $2 AND $3 
       ORDER BY date DESC`,
      [patientId, startDate, endDate]
    );
    return rows.map(this.rowMapper);
  }

  /**
   * Supprime tous les dossiers d'un patient
   * Utilisé lors de la suppression d'un patient
   * @param patientId - ID du patient
   * @returns Nombre de dossiers supprimés
   */
  async deleteByPatientId(patientId: ID): Promise<number> {
    const result = await this.executeQuery<{ count: number }>(
      `DELETE FROM ${this.tableName} WHERE patient_id = $1`,
      [patientId]
    );
    return result.length;
  }
}