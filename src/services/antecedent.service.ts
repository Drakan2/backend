/**
 * Service pour les antécédents médicaux
 * Gère la logique métier pour les antécédents
 */

import { AntecedentRepository } from '../repositories/antecedent.repository';
import { PatientRepository } from '../repositories/patient.repository';
import type { Antecedent } from '../shared/types/antecedents';
import type { ID } from '../shared/types/common';

/**
 * Service Antecedent
 */
export class AntecedentService {
  private repository: AntecedentRepository;
  private patientRepository: PatientRepository;

  constructor() {
    this.repository = new AntecedentRepository();
    this.patientRepository = new PatientRepository();
  }

  /**
   * Récupère tous les antécédents d'un patient
   * @param patientId - ID du patient
   * @returns Array d'antécédents du patient
   * @throws Error si le patient n'existe pas
   */
async getAntecedentsByPatientId(patientId: ID): Promise<Antecedent[]> {
  console.log("🔍 Service - Recherche antécédents pour patient:", patientId);
  
  const patientExists = await this.patientRepository.findById(patientId);
  if (!patientExists) {
    throw new Error(`Patient avec l'ID ${patientId} non trouvé`);
  }
  
  const antecedents = await this.repository.findByPatientId(patientId);
  console.log("📋 Service - Antécédents trouvés:", antecedents.map(a => ({ 
    id: a.id, 
    type: a.type 
  })));
  
  return antecedents;
}

  /**
   * Récupère les antécédents d'un patient par type
   * @param patientId - ID du patient
   * @param type - Type d'antécédent
   * @returns Array d'antécédents du type demandé
   */
  async getAntecedentsByType(patientId: ID, type: Antecedent['type']): Promise<Antecedent[]> {
    return this.repository.findByType(patientId, type);
  }

  /**
   * Récupère un antécédent par son ID
   * @param id - ID de l'antécédent
   * @returns L'antécédent
   * @throws Error si l'antécédent n'existe pas
   */
  async getAntecedentById(id: ID): Promise<Antecedent> {
    const antecedent = await this.repository.findById(id);
    if (!antecedent) {
      throw new Error(`Antécédent avec l'ID ${id} non trouvé`);
    }
    return antecedent;
  }

  /**
   * Crée un nouvel antécédent médical
   * @param antecedentData - Données de l'antécédent
   * @returns L'antécédent créé
   * @throws Error si validation échoue ou patient n'existe pas
   */
  async createAntecedent(
    antecedentData: Omit<Antecedent, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Antecedent> {
    // Validation
    if (!antecedentData.patientId) {
      throw new Error('L\'ID du patient est obligatoire');
    }

    if (!antecedentData.type || !antecedentData.type.trim()) {
      throw new Error('Le type d\'antécédent est obligatoire');
    }

    if (!antecedentData.content || !antecedentData.content.trim()) {
      throw new Error('Le contenu est obligatoire');
    }

    // Vérifier que le patient existe
    const patientExists = await this.patientRepository.findById(antecedentData.patientId);
    if (!patientExists) {
      throw new Error(`Patient avec l'ID ${antecedentData.patientId} non trouvé`);
    }

    // Créer l'antécédent
    return this.repository.create(antecedentData);
  }

  /**
   * Met à jour un antécédent médical
   * @param id - ID de l'antécédent
   * @param antecedentData - Données à mettre à jour
   * @returns L'antécédent mis à jour
   * @throws Error si l'antécédent n'existe pas
   */
  async updateAntecedent(id: ID, antecedentData: Partial<Antecedent>): Promise<Antecedent> {
    // Vérifier que l'antécédent existe
    const existingAntecedent = await this.repository.findById(id);
    if (!existingAntecedent) {
      throw new Error(`Antécédent avec l'ID ${id} non trouvé`);
    }

    // Mettre à jour
    const updatedAntecedent = await this.repository.update(id, antecedentData);
    if (!updatedAntecedent) {
      throw new Error(`Échec de la mise à jour de l'antécédent ${id}`);
    }

    return updatedAntecedent;
  }

  /**
   * Supprime un antécédent médical
   * @param id - ID de l'antécédent
   * @throws Error si l'antécédent n'existe pas
   */
  async deleteAntecedent(id: ID): Promise<void> {
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new Error(`Antécédent avec l'ID ${id} non trouvé`);
    }
  }

  /**
   * Supprime tous les antécédents d'un patient
   * Utilisé lors de la suppression d'un patient
   * @param patientId - ID du patient
   * @returns Nombre d'antécédents supprimés
   */
  async deleteAntecedentsByPatientId(patientId: ID): Promise<number> {
    return this.repository.deleteByPatientId(patientId);
  }
}