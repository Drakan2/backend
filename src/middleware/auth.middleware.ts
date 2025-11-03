/**
 * Middleware d'authentification
 * Vérifie les tokens JWT et les autorisations par rôle
 */

import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import type { UserRole } from '../shared/types/user';
import type { ID } from '../shared/types/common';

/**
 * Interface pour les requêtes authentifiées
 * Ajoute les infos de l'utilisateur à la requête
 */
export interface AuthRequest extends Request {
  user?: {
    userId: ID;
    username: string;
    role: UserRole;
  };
}

const authService = new AuthService();

/**
 * Middleware d'authentification
 * Vérifie le token JWT et ajoute les infos user à la requête
 */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Récupérer le header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Token d\'authentification manquant',
      });
      return;
    }

    // Extraire le token
    const token = authHeader.substring(7); // Retire "Bearer "

    // Vérifier et décoder le token
    const payload = authService.verifyToken(token);

    // Vérifier que l'utilisateur existe toujours
    await authService.validateUser(payload.userId);

    // Ajouter les infos user à la requête
    req.user = payload;
    
    next();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Authentification échouée';

    res.status(401).json({
      success: false,
      message: errorMessage,
    });
  }
};

/**
 * Middleware d'autorisation par rôle
 * Vérifie que l'utilisateur a un des rôles autorisés
 * @param allowedRoles - Rôles autorisés pour cette route
 */
export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    // Vérifier que l'utilisateur est authentifié
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Non authentifié',
      });
      return;
    }

    // Vérifier que l'utilisateur a un rôle autorisé
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Accès refusé - Permissions insuffisantes',
      });
      return;
    }

    next();
  };
};