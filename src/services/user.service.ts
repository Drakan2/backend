/**
 * Service pour les utilisateurs (SANS hashage)
 */

import { UserRepository } from '../repositories/user.repository';
import { VALIDATION_CONSTANTS } from '../config/constants';
import type { User, UserRole } from '../shared/types/user';
import type { ID } from '../shared/types/common';

export class UserService {
  private repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  // ✅ MODIFIÉ - Renvoie les users AVEC mot de passe
  async getAllUsers(): Promise<User[]> { // Retirer Omit<User, 'password'>
    const users = await this.repository.findAll();
    return users; // Retirer le map qui supprime le password
  }

  // ✅ MODIFIÉ - Renvoie l'user AVEC mot de passe
  async getUserById(id: ID): Promise<User> { // Retirer Omit<User, 'password'>
    const user = await this.repository.findById(id);
    if (!user) {
      throw new Error(`Utilisateur avec l'ID ${id} non trouvé`);
    }
    return user; // Retirer la suppression du password
  }

  async getUserByUsername(username: string): Promise<Omit<User, 'password'>> {
    const user = await this.repository.findByUsername(username);
    if (!user) {
      throw new Error(`Utilisateur ${username} non trouvé`);
    }
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getUsersByRole(role: UserRole): Promise<User[]> { // Retirer Omit<User, 'password'>
    const users = await this.repository.findByRole(role);
    return users; // Retirer le map qui supprime le password
  }

  /**
   * Crée un utilisateur (mot de passe en clair)
   */
  // ✅ MODIFIÉ - Renvoie l'user AVEC mot de passe
  async createUser(userData: {
    username: string;
    password: string;
    role: UserRole;
    assignedPatients?: ID[];
  }): Promise<User> { // Retirer Omit<User, 'password'>
    console.log('🎯 USER SERVICE - createUser appelé avec:', userData);

    if (!userData.username || userData.username.trim().length < VALIDATION_CONSTANTS.MIN_USERNAME_LENGTH) {
      throw new Error(`Le nom d'utilisateur doit contenir au moins ${VALIDATION_CONSTANTS.MIN_USERNAME_LENGTH} caractères`);
    }

    if (userData.username.length > VALIDATION_CONSTANTS.MAX_USERNAME_LENGTH) {
      throw new Error(`Le nom d'utilisateur ne peut pas dépasser ${VALIDATION_CONSTANTS.MAX_USERNAME_LENGTH} caractères`);
    }

    if (!userData.password || userData.password.length < VALIDATION_CONSTANTS.MIN_PASSWORD_LENGTH) {
      throw new Error(`Le mot de passe doit contenir au moins ${VALIDATION_CONSTANTS.MIN_PASSWORD_LENGTH} caractères`);
    }
console.log('🔍 USER SERVICE - Vérification si username existe...');
    const usernameExists = await this.repository.existsByUsername(userData.username);
    if (usernameExists) {
      throw new Error(`Le nom d'utilisateur ${userData.username} existe déjà`);
    }
console.log('🔍 USER SERVICE - Création de l\'utilisateur...');

    // ✅ Pas de hashage, mot de passe en clair
    const newUser = await this.repository.create({
      username: userData.username,
      password: userData.password, // En clair
      role: userData.role,
      assignedPatients: userData.assignedPatients || [],
    });
console.log('✅ USER SERVICE - Utilisateur créé en DB:', newUser);

    return newUser;
  }

  async updateUser(
    id: ID,
    userData: Partial<User> // Changer pour User au lieu de Omit<User, 'password'>
  ): Promise<User> { // Retirer Omit<User, 'password'>
    const existingUser = await this.repository.findById(id);
    if (!existingUser) {
      throw new Error(`Utilisateur avec l'ID ${id} non trouvé`);
    }

    if (userData.username && userData.username !== existingUser.username) {
      const usernameExists = await this.repository.existsByUsername(userData.username, id);
      if (usernameExists) {
        throw new Error(`Le nom d'utilisateur ${userData.username} existe déjà`);
      }
    }

    const updatedUser = await this.repository.update(id, userData);
    if (!updatedUser) {
      throw new Error(`Échec de la mise à jour de l'utilisateur ${id}`);
    }

    return updatedUser;
  }

  async deleteUser(id: ID): Promise<void> {
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new Error(`Utilisateur avec l'ID ${id} non trouvé`);
    }
  }

  // ✅ MODIFIÉ - Renvoie l'user AVEC mot de passe
  async assignPatients(userId: ID, patientIds: ID[]): Promise<User> { // Retirer Omit<User, 'password'>
    const user = await this.repository.updateAssignedPatients(userId, patientIds);
    if (!user) {
      throw new Error(`Utilisateur avec l'ID ${userId} non trouvé`);
    }

    return user; // Retirer la suppression du password
  }

  // ✅ MODIFIÉ - Renvoie l'user AVEC mot de passe
  async addAssignedPatient(userId: ID, patientId: ID): Promise<User> { // Retirer Omit<User, 'password'>
    const user = await this.repository.addAssignedPatient(userId, patientId);
    if (!user) {
      throw new Error(`Utilisateur avec l'ID ${userId} non trouvé`);
    }

    return user; // Retirer la suppression du password
  }

  // ✅ MODIFIÉ - Renvoie l'user AVEC mot de passe
  async removeAssignedPatient(userId: ID, patientId: ID): Promise<User> { // Retirer Omit<User, 'password'>
    const user = await this.repository.removeAssignedPatient(userId, patientId);
    if (!user) {
      throw new Error(`Utilisateur avec l'ID ${userId} non trouvé`);
    }

    return user; // Retirer la suppression du password
  }
}