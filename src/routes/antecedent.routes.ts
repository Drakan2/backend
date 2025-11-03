/**
 * Routes pour les antécédents médicaux
 * Définit tous les endpoints liés aux antécédents
 */

import { Router, Response } from 'express';
import { AntecedentService } from '../services/antecedent.service';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { asyncHandler } from '../middleware/error.middleware';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/response';
import type { Antecedent } from '../shared/types/antecedents'; // ✅ AJOUTER l'import


const router = Router();
const antecedentService = new AntecedentService();

/**
 * GET /antecedents
 * Récupère les antécédents médicaux
 * Doit inclure patientId comme query param
 */
router.get(
  '/',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { patientId, type } = req.query;

    if (!patientId) {
      res.status(400).json({
        success: false,
        message: 'Le paramètre patientId est requis',
      });
      return;
    }

    const id = parseInt(patientId as string, 10);

    // Filtrer par type si spécifié
    if (type) {
      const antecedents = await antecedentService.getAntecedentsByType(
        id,
        type as Antecedent['type']
      );
      sendSuccess(res, antecedents);
      return;
    }

    // Tous les antécédents du patient
    const antecedents = await antecedentService.getAntecedentsByPatientId(id);
    sendSuccess(res, antecedents);
  })
);

/**
 * GET /antecedents/:id
 * Récupère un antécédent par son ID
 */
router.get(
  '/',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { patientId } = req.query;

    if (!patientId) {
      res.status(400).json({
        success: false,
        message: 'Le paramètre patientId est requis',
      });
      return;
    }

    const id = parseInt(patientId as string, 10);

    // 🚨 CORRECTION: Toujours retourner tous les antécédents du patient
    // sans filtrer par type dans la requête principale
    const antecedents = await antecedentService.getAntecedentsByPatientId(id);
    
    console.log("📋 Backend - Antécédents retournés:", antecedents.map(a => ({ 
      id: a.id, 
      type: a.type, 
      patientId: a.patientId 
    }))); // 🔥 LOG BACKEND
    
    sendSuccess(res, antecedents);
  })
);

/**
 * POST /antecedents
 * Crée un nouvel antécédent médical
 */
router.post(
  '/',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const antecedentData = {
      ...req.body,
      createdBy: req.user!.userId,
    };

    const antecedent = await antecedentService.createAntecedent(antecedentData);
    sendCreated(res, antecedent, 'Antécédent créé avec succès');
  })
);

/**
 * PUT /antecedents/:id
 * Met à jour un antécédent médical
 */
router.put(
  '/:id',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const antecedentData = req.body;

    const antecedent = await antecedentService.updateAntecedent(id, antecedentData);
    sendSuccess(res, antecedent, 'Antécédent modifié avec succès');
  })
);

/**
 * DELETE /antecedents/:id
 * Supprime un antécédent médical
 */
router.delete(
  '/:id',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id, 10);
    await antecedentService.deleteAntecedent(id);
    sendNoContent(res);
  })
);

export default router;