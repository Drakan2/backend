/**
 * Routes pour les utilisateurs et l'authentification
 * Définit tous les endpoints liés aux users et au login
 */

import { Router, Response } from 'express';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.middleware';
import { asyncHandler } from '../middleware/error.middleware';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/response';

const router = Router();
const userService = new UserService();
const authService = new AuthService();

/**
 * POST /users/change-password
 * Change le mot de passe de l'utilisateur connecté
 */
router.post(
  '/change-password',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      res.status(400).json({
        success: false,
        message: 'Ancien et nouveau mot de passe requis',
      });
      return;
    }

    await authService.changePassword(req.user!.userId, oldPassword, newPassword);
    sendSuccess(res, null, 'Mot de passe modifié avec succès');
  })
);

/**
 * GET /users
 * Récupère tous les utilisateurs
 * Réservé aux admins
 */
router.get(
  '/',
  authenticate,
  authorize('admin'),
  asyncHandler(async (_req: AuthRequest, res: Response) => {
    const users = await userService.getAllUsers();
    sendSuccess(res, users);
  })
);

/**
 * GET /users/me
 * Récupère le profil de l'utilisateur connecté
 */
router.get(
  '/me',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await userService.getUserById(req.user!.userId);
    sendSuccess(res, user);
  })
);

/**
 * GET /users/:id
 * Récupère un utilisateur par son ID
 * Réservé aux admins
 */
router.get(
  '/:id',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const user = await userService.getUserById(id);
    sendSuccess(res, user);
  })
);

/**
 * POST /users
 * Crée un nouvel utilisateur
 * Réservé aux admins
 */
router.post(
  '/',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    console.log('🔍 CREATE USER ROUTE - Données reçues:', req.body);
    console.log('🔍 CREATE USER ROUTE - User making request:', req.user);
    
    try {
      const user = await userService.createUser(req.body);
      console.log('✅ CREATE USER ROUTE - Utilisateur créé avec succès:', user);
      sendCreated(res, user, 'Utilisateur créé avec succès');
    } catch (error) {
      console.error('❌ CREATE USER ROUTE - Erreur:', error);
      throw error;
    }
  })
);

/**
 * PUT /users/:id
 * Met à jour un utilisateur
 * Réservé aux admins
 */
router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id, 10);
    console.log('🔍 UPDATE USER ROUTE - ID:', id, 'Données:', req.body);
    
    try {
      const user = await userService.updateUser(id, req.body);
      console.log('✅ UPDATE USER ROUTE - Utilisateur modifié avec succès:', user);
      sendSuccess(res, user, 'Utilisateur modifié avec succès');
    } catch (error) {
      console.error('❌ UPDATE USER ROUTE - Erreur:', error);
      throw error;
    }
  })
);

/**
 * DELETE /users/:id
 * Supprime un utilisateur
 * Réservé aux admins
 */
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id, 10);
    console.log('🔍 DELETE USER ROUTE - ID:', id);
    
    try {
      await userService.deleteUser(id);
      console.log('✅ DELETE USER ROUTE - Utilisateur supprimé avec succès');
      sendNoContent(res);
    } catch (error) {
      console.error('❌ DELETE USER ROUTE - Erreur:', error);
      throw error;
    }
  })
);

/**
 * POST /users/:id/assign-patients
 * Assigne des patients à un utilisateur
 * Réservé aux admins
 */
router.post(
  '/:id/assign-patients',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const { patientIds } = req.body;

    if (!Array.isArray(patientIds)) {
      res.status(400).json({
        success: false,
        message: 'patientIds doit être un tableau',
      });
      return;
    }

    const user = await userService.assignPatients(id, patientIds);
    sendSuccess(res, user, 'Patients assignés avec succès');
  })
);

export default router;