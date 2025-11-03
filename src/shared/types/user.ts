/**
 * Types pour les utilisateurs
 * SOURCE DE VÉRITÉ - Copie de src/shared/types/user.ts
 */

import { BaseEntity, ID } from './common';

// Rôles utilisateurs
export type UserRole = 'admin' | 'user';

// Interface User
export interface User extends BaseEntity {
  username: string;
  password: string;
  role: UserRole;
  assignedPatients: ID[];
}