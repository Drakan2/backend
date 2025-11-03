/**
 * Utilitaires pour les réponses HTTP
 * Standardise le format des réponses de l'API
 */

import { Response } from 'express';
import type { ApiResponse } from '../shared/types/common';

/**
 * Envoie une réponse de succès
 * @param res - Objet Response Express
 * @param data - Données à retourner
 * @param message - Message optionnel
 * @param statusCode - Code HTTP (défaut: 200)
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode = 200
): void => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    ...(message && { message }),
  };
  res.status(statusCode).json(response);
};

/**
 * Envoie une réponse d'erreur
 * @param res - Objet Response Express
 * @param message - Message d'erreur
 * @param statusCode - Code HTTP (défaut: 400)
 */
export const sendError = (
  res: Response,
  message: string,
  statusCode = 400
): void => {
  res.status(statusCode).json({
    success: false,
    message,
  });
};

/**
 * Envoie une réponse de création réussie (201)
 * @param res - Objet Response Express
 * @param data - Données créées
 * @param message - Message optionnel
 */
export const sendCreated = <T>(
  res: Response,
  data: T,
  message = 'Créé avec succès'
): void => {
  sendSuccess(res, data, message, 201);
};

/**
 * Envoie une réponse sans contenu (204)
 * Utilisé pour les suppressions réussies
 * @param res - Objet Response Express
 */
export const sendNoContent = (res: Response): void => {
  res.status(204).send();
};