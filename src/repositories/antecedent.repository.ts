/**
 * Repository pour les antécédents médicaux
 * Gère toutes les opérations de base de données pour les antécédents
 */

import { BaseRepository } from './base.repository';
import { AntecedentRow, rowToAntecedent } from '../db/schema';
import type { Antecedent } from '../shared/types/antecedents';
import type { ID } from '../shared/types/common';

/**
 * Repository Antecedent
 */
export class AntecedentRepository extends BaseRepository<Antecedent, AntecedentRow> {
  constructor() {
    super('antecedents', rowToAntecedent);
  }

  /**
   * Crée un nouvel antécédent médical
   * @param antecedent - Données de l'antécédent (sans ID)
   * @returns L'antécédent créé avec son ID
   */
  async create(antecedent: Omit<Antecedent, 'id' | 'createdAt' | 'updatedAt'>): Promise<Antecedent> {
    const { text, values } = this.buildInsertQuery({
      patient_id: antecedent.patientId,
      type: antecedent.type,
      content: antecedent.content,
      created_by: antecedent.createdBy,
    });

    const rows = await this.executeQuery<AntecedentRow>(text, values);
    return this.rowMapper(rows[0]);
  }

  /**
   * Met à jour un antécédent médical
   * @param id - ID de l'antécédent
   * @param antecedent - Données à mettre à jour (partielles)
   * @returns L'antécédent mis à jour ou null
   */
  async update(id: ID, antecedent: Partial<Antecedent>): Promise<Antecedent | null> {
    const fields: Record<string, unknown> = {};

    if (antecedent.type !== undefined) fields.type = antecedent.type;
    if (antecedent.content !== undefined) fields.content = antecedent.content;

    if (Object.keys(fields).length === 0) {
      return this.findById(id);
    }

    const { text, values } = this.buildUpdateQuery(fields, id);
    const rows = await this.executeQuery<AntecedentRow>(text, values);
    return rows.length > 0 ? this.rowMapper(rows[0]) : null;
  }

  /**
   * Trouve tous les antécédents d'un patient
   * @param patientId - ID du patient
   * @returns Array d'antécédents triés par date de création décroissante
   */
  async findByPatientId(patientId: ID): Promise<Antecedent[]> {
    const rows = await this.executeQuery<AntecedentRow>(
      `SELECT * FROM ${this.tableName} WHERE patient_id = $1 ORDER BY created_at DESC`,
      [patientId]
    );
    return rows.map(this.rowMapper);
  }

  /**
   * Trouve les antécédents d'un patient par type
   * @param patientId - ID du patient
   * @param type - Type d'antécédent (Médicaux, Chirurgicaux, Allergies, Statut Infectieux)
   * @returns Array d'antécédents du type demandé
   */
  async findByType(patientId: ID, type: Antecedent['type']): Promise<Antecedent[]> {
    const rows = await this.executeQuery<AntecedentRow>(
      `SELECT * FROM ${this.tableName} WHERE patient_id = $1 AND type = $2 ORDER BY created_at DESC`,
      [patientId, type]
    );
    return rows.map(this.rowMapper);
  }

  /**
   * Supprime tous les antécédents d'un patient
   * Utilisé lors de la suppression d'un patient
   * @param patientId - ID du patient
   * @returns Nombre d'antécédents supprimés
   */
  async deleteByPatientId(patientId: ID): Promise<number> {
    const result = await this.executeQuery<{ count: number }>(
      `DELETE FROM ${this.tableName} WHERE patient_id = $1`,
      [patientId]
    );
    return result.length;
  }
}