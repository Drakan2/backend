/**
 * Middleware de gestion des erreurs
 * Centralise la gestion de toutes les erreurs de l'application
 */

import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

/**
 * Classe pour les erreurs personnalisées de l'application
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Middleware principal de gestion des erreurs
 * Doit être le dernier middleware de l'application
 */
export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Si c'est une AppError (erreur opérationnelle)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(env.NODE_ENV === 'development' && { stack: err.stack }),
    });
    return;
  }

  // Erreur non gérée (erreur de programmation)
  console.error('❌ Erreur non gérée:', err);

  res.status(500).json({
    success: false,
    message: env.NODE_ENV === 'development' 
      ? err.message 
      : 'Une erreur interne du serveur s\'est produite',
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/**
 * Middleware pour les routes non trouvées (404)
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} non trouvée`,
  });
};

/**
 * Wrapper pour les fonctions async
 * Capture automatiquement les erreurs et les passe au errorHandler
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};