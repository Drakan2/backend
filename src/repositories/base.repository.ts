/**
 * Repository de base
 * Implémente les opérations CRUD communes à toutes les entités
 * Utilise les génériques TypeScript pour la réutilisabilité
 */

import { query } from '../config/database';
import { QueryResultRow } from 'pg';
import type { ID, BaseEntity } from '../shared/types/common';

/**
 * Classe abstraite de base pour tous les repositories
 * @template TEntity - Type de l'entité (ex: Patient, User)
 * @template TRow - Type de la ligne de la DB (ex: PatientRow)
 */
export abstract class BaseRepository<TEntity extends BaseEntity, TRow extends QueryResultRow> {
  /**
   * @param tableName - Nom de la table dans la DB
   * @param rowMapper - Fonction qui convertit une Row DB en Entity
   */
  constructor(
    protected readonly tableName: string,
    protected readonly rowMapper: (row: TRow) => TEntity
  ) {}

  /**
   * Récupère toutes les entités
   * @returns Array de toutes les entités
   */
  async findAll(): Promise<TEntity[]> {
    const rows = await query<TRow>(`SELECT * FROM ${this.tableName}`);
    return rows.map(this.rowMapper);
  }

  /**
   * Récupère une entité par son ID
   * @param id - ID de l'entité
   * @returns L'entité ou null si non trouvée
   */
  async findById(id: ID): Promise<TEntity | null> {
    const rows = await query<TRow>(
      `SELECT * FROM ${this.tableName} WHERE id = $1`,
      [id]
    );
    return rows.length > 0 ? this.rowMapper(rows[0]) : null;
  }

  /**
   * Supprime une entité par son ID
   * @param id - ID de l'entité à supprimer
   * @returns true si supprimé, false sinon
   */
  async delete(id: ID): Promise<boolean> {
    const result = await query<TRow>(
      `DELETE FROM ${this.tableName} WHERE id = $1 RETURNING id`,
      [id]
    );
    return result.length > 0;
  }

  /**
   * Exécute une requête SQL personnalisée
   * @param text - Requête SQL
   * @param params - Paramètres de la requête
   * @returns Résultats de la requête
   */
  protected async executeQuery<T extends QueryResultRow>(text: string, params?: unknown[]): Promise<T[]> {
    return query<T>(text, params);
  }

  /**
   * Construit une requête UPDATE dynamique
   * @param fields - Champs à mettre à jour
   * @param id - ID de l'entité
   * @returns Object avec la requête SQL et les valeurs
   */
// DANS base.repository.ts - CORRECTION DE LA MÉTHODE buildUpdateQuery
protected buildUpdateQuery(
  fields: Record<string, unknown>,
  id: ID
): { text: string; values: unknown[] } {
  const entries = Object.entries(fields).filter(([_, value]) => value !== undefined);
  
  if (entries.length === 0) {
    throw new Error('Aucun champ à mettre à jour');
  }

  // ✅ REMETTRE COMME ÇA (sans les console.log)
  const setClauses = entries.map(([key], index) => `${key} = $${index + 1}`);
  
  const values = entries.map(([_, value]) => value);
  values.push(id);

  const text = `UPDATE ${this.tableName} SET ${setClauses.join(', ')} WHERE id = $${values.length} RETURNING *`;

  return {
    text,
    values,
  };
}

  /**
   * Construit une requête INSERT dynamique
   * @param fields - Champs à insérer
   * @returns Object avec la requête SQL et les valeurs
   */
// Dans base.repository.ts - méthode buildInsertQuery
protected buildInsertQuery(
  fields: Record<string, unknown>
): { text: string; values: unknown[] } {
  const entries = Object.entries(fields).filter(([_, value]) => value !== undefined);
  
  // 🚨 VÉRIFIER SI assigned_patients EST BIEN TRAITÉ
  console.log('🔍 BUILD INSERT - Fields:', fields);
  console.log('🔍 BUILD INSERT - Entries:', entries);
  
  const columns = entries.map(([key]) => key);
  const placeholders = entries.map((_, index) => '$' + (index + 1));
  const values = entries.map(([_, value]) => value);

  const text = `INSERT INTO ${this.tableName} (${columns.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`;
  
  console.log('🔍 BUILD INSERT - SQL:', text);
  console.log('🔍 BUILD INSERT - Values:', values);
  
  return { text, values };
}

}