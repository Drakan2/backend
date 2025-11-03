/**
 * Service pour les dossiers médicaux
 * Gère la logique métier pour les medical records
 */

import { MedicalRecordRepository } from '../repositories/medical-record.repository';
import { PatientRepository } from '../repositories/patient.repository';
import type { MedicalRecord } from '../shared/types/medical';
import type { ID } from '../shared/types/common';

/**
 * Service MedicalRecord
 */
export class MedicalRecordService {
  private repository: MedicalRecordRepository;
  private patientRepository: PatientRepository;

  constructor() {
    this.repository = new MedicalRecordRepository();
    this.patientRepository = new PatientRepository();
  }

  /**
   * Récupère tous les dossiers médicaux
   * @returns Array de tous les dossiers
   */
  async getAllRecords(): Promise<MedicalRecord[]> {
    return this.repository.findAll();
  }

  /**
   * Récupère un dossier par son ID
   * @param id - ID du dossier
   * @returns Le dossier médical
   * @throws Error si le dossier n'existe pas
   */
  async getRecordById(id: ID): Promise<MedicalRecord> {
    const record = await this.repository.findById(id);
    if (!record) {
      throw new Error(`Enregistrement médical avec l'ID ${id} non trouvé`);
    }
    return record;
  }

  /**
   * Récupère tous les dossiers d'un patient
   * @param patientId - ID du patient
   * @returns Array de dossiers du patient
   * @throws Error si le patient n'existe pas
   */
  async getRecordsByPatientId(patientId: ID): Promise<MedicalRecord[]> {
    // Vérifier que le patient existe
    const patientExists = await this.patientRepository.findById(patientId);
    if (!patientExists) {
      throw new Error(`Patient avec l'ID ${patientId} non trouvé`);
    }
    
    return this.repository.findByPatientId(patientId);
  }

  /**
   * Récupère les dossiers d'un patient par catégorie
   * @param patientId - ID du patient
   * @param category - Catégorie (ex: 'antecedents')
   * @returns Array de dossiers de cette catégorie
   */
  async getRecordsByCategory(patientId: ID, category: string): Promise<MedicalRecord[]> {
    return this.repository.findByCategory(patientId, category);
  }

  /**
   * Récupère les dossiers par catégorie et sous-catégorie
   * @param patientId - ID du patient
   * @param category - Catégorie principale
   * @param subCategory - Sous-catégorie
   * @returns Array de dossiers correspondants
   */
  async getRecordsByCategoryAndSubCategory(
    patientId: ID,
    category: string,
  ): Promise<MedicalRecord[]> {
    return this.repository.findByCategoryAndSubCategory(patientId, category);
  }

  /**
   * Récupère les dossiers dans une plage de dates
   * @param patientId - ID du patient
   * @param startDate - Date de début
   * @param endDate - Date de fin
   * @returns Array de dossiers dans la plage
   */
  async getRecordsByDateRange(
    patientId: ID,
    startDate: Date,
    endDate: Date
  ): Promise<MedicalRecord[]> {
    return this.repository.findByDateRange(patientId, startDate, endDate);
  }

  /**
   * Crée un nouveau dossier médical
   * @param recordData - Données du dossier
   * @returns Le dossier créé
   * @throws Error si validation échoue ou patient n'existe pas
   */
async createRecord(
  recordData: Omit<MedicalRecord, 'id' | 'createdAt' | 'updatedAt'>
): Promise<MedicalRecord> {
  console.log('📝 Données reçues pour création:', recordData);
  
  // Validation de base
  if (!recordData.patientId) {
    throw new Error('L\'ID du patient est obligatoire');
  }

  if (!recordData.category || !recordData.category.trim()) {
    throw new Error('La catégorie est obligatoire');
  }

  if (!recordData.date) {
    throw new Error('La date est obligatoire');
  }

  // Vérifier que le patient existe
  const patientExists = await this.patientRepository.findById(recordData.patientId);
  console.log('👥 Patient existe:', patientExists);
  if (!patientExists) {
    throw new Error(`Patient avec l'ID ${recordData.patientId} non trouvé`);
  }

  // ✅ La contrainte SQL unique_patient_category_date fera le reste
  const result = await this.repository.create(recordData);
  console.log('✅ Enregistrement créé:', result);

  return result;
}



  /**
   * Met à jour un dossier médical
   * @param id - ID du dossier
   * @param recordData - Données à mettre à jour
   * @returns Le dossier mis à jour
   * @throws Error si le dossier n'existe pas
   */
  async updateRecord(id: ID, recordData: Partial<MedicalRecord>): Promise<MedicalRecord> {
    // Vérifier que le dossier existe
    const existingRecord = await this.repository.findById(id);
    if (!existingRecord) {
      throw new Error(`Enregistrement médical avec l'ID ${id} non trouvé`);
    }

    // Mettre à jour
    const updatedRecord = await this.repository.update(id, recordData);
    if (!updatedRecord) {
      throw new Error(`Échec de la mise à jour de l'enregistrement ${id}`);
    }

    return updatedRecord;
  }

  /**
   * Supprime un dossier médical
   * @param id - ID du dossier
   * @throws Error si le dossier n'existe pas
   */
// Dans medical-record.service.ts - CORRECTION
async deleteRecord(id: ID): Promise<void> {
  // ✅ CORRECTION: Vérifier d'abord si l'enregistrement existe
  const existingRecord = await this.repository.findById(id);
  if (!existingRecord) {
    throw new Error(`Enregistrement médical avec l'ID ${id} non trouvé`);
  }

  // ✅ CORRECTION: Utiliser la méthode delete du repository
  const deleted = await this.repository.delete(id);
  if (!deleted) {
    throw new Error(`Échec de la suppression de l'enregistrement ${id}`);
  }
}

  /**
   * Supprime tous les dossiers d'un patient
   * Utilisé lors de la suppression d'un patient
   * @param patientId - ID du patient
   * @returns Nombre de dossiers supprimés
   */
  async deleteRecordsByPatientId(patientId: ID): Promise<number> {
    return this.repository.deleteByPatientId(patientId);
  }
}