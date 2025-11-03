/**
 * Point d'entrée de toutes les routes
 * Agrège toutes les routes de l'application
 */

import { Router } from 'express';
import authRoutes from './auth.routes';
import patientRoutes from './patient.routes';
import userRoutes from './user.routes';
import medicalRecordRoutes from './medical-record.routes';
import antecedentRoutes from './antecedent.routes'; // ← AJOUTER


const router = Router();

// Monter les routes sur leurs chemins respectifs
router.use('/auth', authRoutes);           // ✅ /api/auth/login
router.use('/patients', patientRoutes);
router.use('/users', userRoutes);
router.use('/medical-records', medicalRecordRoutes);
router.use('/antecedents', antecedentRoutes); // ← AJOUTER


export default router;