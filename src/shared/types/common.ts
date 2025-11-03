/**
 * Types communs utilisés dans toute l'application
 * SOURCE DE VÉRITÉ - Copie de src/shared/types/common.ts
 */

// Type centralisé pour tous les IDs
export type ID = number;

// Interface de base pour toutes les entités
export interface BaseEntity {
  id?: ID;
  createdAt?: Date;
  updatedAt?: Date;
}

// Réponse API standard
export type ApiResponse<T> = {
  data: T;
  message?: string;
  success: boolean;
};

// Réponse paginée
export type PaginatedResponse<T> = ApiResponse<T> & {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};