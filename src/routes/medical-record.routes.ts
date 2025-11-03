/**
 * Routes pour les dossiers médicaux
 * Définit tous les endpoints liés aux medical records
 */

import { Router, Response } from 'express';
import { MedicalRecordService } from '../services/medical-record.service';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { asyncHandler } from '../middleware/error.middleware';
import { sendSuccess, sendCreated } from '../utils/response';

const router = Router();
const medicalRecordService = new MedicalRecordService();

/**
 * GET /medical-records
 * Récupère les dossiers médicaux
 * Peut filtrer par patientId, category, subCategory, dates
 */
router.get(
  '/',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { patientId, category, startDate, endDate } = req.query;

    // Si patientId fourni, filtrer par patient
    if (patientId) {
      const id = parseInt(patientId as string, 10);

      // Filtrer par plage de dates
      if (startDate && endDate) {
        const records = await medicalRecordService.getRecordsByDateRange(
          id,
          new Date(startDate as string),
          new Date(endDate as string)
        );
        sendSuccess(res, records);
        return;
      }

      // Filtrer par catégorie et sous-catégorie
      if (category) {
        const records = await medicalRecordService.getRecordsByCategoryAndSubCategory(
          id,
          category as string
                );
        sendSuccess(res, records);
        return;
      }

      // Filtrer par catégorie seulement
      if (category) {
        const records = await medicalRecordService.getRecordsByCategory(
          id,
          category as string
        );
        sendSuccess(res, records);
        return;
      }

      // Tous les dossiers du patient
      const records = await medicalRecordService.getRecordsByPatientId(id);
      sendSuccess(res, records);
      return;
    }

    // Tous les dossiers
    const records = await medicalRecordService.getAllRecords();
    sendSuccess(res, records);
  })
);

/**
 * GET /medical-records/:id
 * Récupère un dossier médical par son ID
 */
router.get(
  '/:id',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const record = await medicalRecordService.getRecordById(id);
    sendSuccess(res, record);
  })
);

/**
 * POST /medical-records
 * Crée un nouveau dossier médical
 */
router.post(
  '/',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    // Convertir la date et ajouter createdBy
    let date: Date;
    try {
      date = new Date(req.body.date);
      if (isNaN(date.getTime())) {
        throw new Error('Date invalide');
      }
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Format de date invalide',
      });
      return;
    }

    const recordData = {
      ...req.body,
      date: date,
      createdBy: req.user!.userId,
    };

    const record = await medicalRecordService.createRecord(recordData);
    sendCreated(res, record, 'Enregistrement médical créé avec succès');
  })
);

/**
 * PUT /medical-records/:id
 * Met à jour un dossier médical
 */
router.put(
  '/:id',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id, 10);
    
    // Convertir la date si présente
    const recordData = {
      ...req.body,
      ...(req.body.date && { date: new Date(req.body.date) }),
    };

    const record = await medicalRecordService.updateRecord(id, recordData);
    sendSuccess(res, record, 'Enregistrement médical modifié avec succès');
  })
);

/**
 * DELETE /medical-records/:id
 * Supprime un dossier médical
 */
router.delete(
  '/:id',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id, 10);
    await medicalRecordService.deleteRecord(id);
    
    // ✅ CORRECTION: Retourner une réponse JSON valide
    res.status(200).json({
      success: true,
      message: 'Enregistrement médical supprimé avec succès'
    });
  })
);

export default router;