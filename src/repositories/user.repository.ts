/**
 * Repository pour les utilisateurs
 * Gère toutes les opérations de base de données pour les users
 */

import { BaseRepository } from './base.repository';
import { UserRow, rowToUser } from '../db/schema';
import type { User, UserRole } from '../shared/types/user';
import type { ID } from '../shared/types/common';

/**
 * Repository User
 */
export class UserRepository extends BaseRepository<User, UserRow> {
  constructor() {
    super('users', rowToUser);
  }

  /**
   * Crée un nouvel utilisateur
   * @param user - Données de l'utilisateur (sans ID)
   * @returns L'utilisateur créé avec son ID
   */
  async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const { text, values } = this.buildInsertQuery({
      username: user.username,
      password: user.password,
      role: user.role,
      assigned_patients: user.assignedPatients || [],
    });
console.log('📝 USER REPOSITORY - Requête SQL:', text);
  console.log('🔢 USER REPOSITORY - Paramètres:', values);
    const rows = await this.executeQuery<UserRow>(text, values);
    console.log('✅ USER REPOSITORY - Résultat création:', rows[0]);
    return this.rowMapper(rows[0]);
  }

  /**
   * Met à jour un utilisateur
   * @param id - ID de l'utilisateur
   * @param user - Données à mettre à jour (partielles)
   * @returns L'utilisateur mis à jour ou null
   */
  async update(id: ID, user: Partial<User>): Promise<User | null> {
    const fields: Record<string, unknown> = {};

    if (user.username !== undefined) fields.username = user.username;
    if (user.password !== undefined) fields.password = user.password;
    if (user.role !== undefined) fields.role = user.role;
    if (user.assignedPatients !== undefined) fields.assigned_patients = user.assignedPatients;

    if (Object.keys(fields).length === 0) {
      return this.findById(id);
    }

    const { text, values } = this.buildUpdateQuery(fields, id);
    const rows = await this.executeQuery<UserRow>(text, values);
    return rows.length > 0 ? this.rowMapper(rows[0]) : null;
  }

  /**
   * Trouve un utilisateur par son username
   * @param username - Nom d'utilisateur
   * @returns L'utilisateur ou null
   */
  async findByUsername(username: string): Promise<User | null> {
    const rows = await this.executeQuery<UserRow>(
      `SELECT * FROM ${this.tableName} WHERE username = $1`,
      [username]
    );
    return rows.length > 0 ? this.rowMapper(rows[0]) : null;
  }

  /**
   * Trouve tous les utilisateurs d'un certain rôle
   * @param role - Rôle (admin ou user)
   * @returns Array d'utilisateurs
   */
  async findByRole(role: UserRole): Promise<User[]> {
    const rows = await this.executeQuery<UserRow>(
      `SELECT * FROM ${this.tableName} WHERE role = $1`,
      [role]
    );
    return rows.map(this.rowMapper);
  }

  /**
   * Vérifie si un username existe déjà
   * @param username - Username à vérifier
   * @param excludeId - ID à exclure (pour les updates)
   * @returns true si le username existe
   */
  async existsByUsername(username: string, excludeId?: ID): Promise<boolean> {
    const queryText = excludeId
      ? `SELECT id FROM ${this.tableName} WHERE username = $1 AND id != $2`
      : `SELECT id FROM ${this.tableName} WHERE username = $1`;
    
    const params = excludeId ? [username, excludeId] : [username];
    const rows = await this.executeQuery<{ id: ID }>(queryText, params);
    return rows.length > 0;
  }

  /**
   * Met à jour la liste complète des patients assignés
   * @param userId - ID de l'utilisateur
   * @param patientIds - Array des IDs de patients
   * @returns L'utilisateur mis à jour
   */
  async updateAssignedPatients(userId: ID, patientIds: ID[]): Promise<User | null> {
    const rows = await this.executeQuery<UserRow>(
      `UPDATE ${this.tableName} SET assigned_patients = $1 WHERE id = $2 RETURNING *`,
      [patientIds, userId]
    );
    return rows.length > 0 ? this.rowMapper(rows[0]) : null;
  }

  /**
   * Ajoute un patient à la liste assignée (si pas déjà présent)
   * @param userId - ID de l'utilisateur
   * @param patientId - ID du patient à ajouter
   * @returns L'utilisateur mis à jour
   */
  async addAssignedPatient(userId: ID, patientId: ID): Promise<User | null> {
    const rows = await this.executeQuery<UserRow>(
      `UPDATE ${this.tableName} 
       SET assigned_patients = array_append(assigned_patients, $1)
       WHERE id = $2 AND NOT ($1 = ANY(assigned_patients))
       RETURNING *`,
      [patientId, userId]
    );
    return rows.length > 0 ? this.rowMapper(rows[0]) : null;
  }

  /**
   * Retire un patient de la liste assignée
   * @param userId - ID de l'utilisateur
   * @param patientId - ID du patient à retirer
   * @returns L'utilisateur mis à jour
   */
  async removeAssignedPatient(userId: ID, patientId: ID): Promise<User | null> {
    const rows = await this.executeQuery<UserRow>(
      `UPDATE ${this.tableName} 
       SET assigned_patients = array_remove(assigned_patients, $1)
       WHERE id = $2
       RETURNING *`,
      [patientId, userId]
    );
    return rows.length > 0 ? this.rowMapper(rows[0]) : null;
  }
}