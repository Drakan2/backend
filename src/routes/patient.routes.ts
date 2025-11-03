/**
 * Routes pour les patients
 * Définit tous les endpoints liés aux patients
 */

import { Router, Response } from 'express';
import { PatientService } from '../services/patient.service';
import { UserService } from '../services/user.service';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.middleware';
import { asyncHandler } from '../middleware/error.middleware';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/response';
import type { Patient } from '../shared/types/patient';
import type { User } from '../shared/types/user';
import type { ID } from '../shared/types/common';

const router = Router();
const patientService = new PatientService();
const userService = new UserService();

/**
 * GET /patients
 * Récupère tous les patients ou filtre selon les query params
 */
router.get(
  '/',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { search, sexe, type, groupeSanguin } = req.query;

    // Construire les filtres
    const filters = {
      ...(search && { search: search as string }),
      ...(sexe && sexe !== 'tous' && { sexe: sexe as Patient['sexe'] }),
      ...(type && type !== 'tous' && { type: type as Patient['type_patient'] }),
      ...(groupeSanguin && groupeSanguin !== 'tous' && { 
        groupeSanguin: groupeSanguin as Patient['groupe_sanguin'] 
      }),
    };

    // Récupérer les patients
    const patients = Object.keys(filters).length > 0
      ? await patientService.searchPatients(filters)
      : await patientService.getAllPatients();

    // Si c'est un user (pas admin), filtrer par patients assignés
    if (req.user?.role === 'user') {
      // TODO: Implémenter le filtrage par assignedPatients
      // Pour l'instant, retourner tous les patients
    }

    sendSuccess(res, patients);
  })
);

/**
 * GET /patients/statistics
 * Récupère les statistiques des patients
 * Réservé aux admins
 */
router.get(
  '/statistics',
  authenticate,
  authorize('admin'),
  asyncHandler(async (_req: AuthRequest, res: Response) => {
    const stats = await patientService.getStatistics();
    sendSuccess(res, stats);
  })
);

/**
 * GET /patients/:id
 * Récupère un patient par son ID
 */
router.get(
  '/:id',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const patient = await patientService.getPatientById(id);
    sendSuccess(res, patient);
  })
);

/**
 * POST /patients
 * Crée un nouveau patient
 * Réservé aux admins
 */
router.post(
  '/',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const patientData = req.body;
    const patient = await patientService.createPatient(patientData);
    sendCreated(res, patient, 'Patient créé avec succès');
  })
);

/**
 * PUT /patients/:id
 * Met à jour un patient
 * Réservé aux admins
 */
router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const patientData = req.body;
    const patient = await patientService.updatePatient(id, patientData);
    sendSuccess(res, patient, 'Patient modifié avec succès');
  })
);

/**
 * DELETE /patients/:id
 * Supprime un patient
 * Réservé aux admins
 */
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id, 10);
    
    console.log(`🗑️ Suppression du patient ${id} - Nettoyage des assignations...`);
    
    // 1. D'abord, trouver tous les utilisateurs qui ont ce patient assigné
    const allUsers: User[] = await userService.getAllUsers();
    const usersWithPatient = allUsers.filter((user: User) => 
      user.assignedPatients.includes(id)
    );
    
    console.log(`📋 ${usersWithPatient.length} utilisateur(s) avec ce patient assigné`);
    
    // 2. Retirer le patient de chaque utilisateur
    for (const user of usersWithPatient) {
      console.log(`🔄 Retrait du patient ${id} de l'utilisateur ${user.username}`);
      
      const updatedAssignedPatients = user.assignedPatients.filter((patientId: ID) => patientId !== id);
      
      await userService.updateUser(user.id!, {
        ...user,
        assignedPatients: updatedAssignedPatients
      });
      
      console.log(`✅ Patient ${id} retiré de ${user.username}`);
    }
    
    // 3. Maintenant supprimer le patient
    console.log(`🗑️ Suppression définitive du patient ${id}`);
    await patientService.deletePatient(id);
    
    console.log(`✅ Patient ${id} supprimé et retiré de ${usersWithPatient.length} utilisateur(s)`);
    sendNoContent(res);
  })
);

export default router;