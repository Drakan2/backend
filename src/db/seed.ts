/**
 * Script de seed (mots de passe en clair)
 */

import { pool, closePool } from '../config/database';

const seed = async (): Promise<void> => {
  try {
    console.log('🌱 Démarrage du seeding de la base de données...\n');

    console.log('👤 Création des utilisateurs...');
    
    // ✅ Mots de passe en clair
    await pool.query(
      `INSERT INTO users (username, password, role, assigned_patients) 
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (username) DO NOTHING`,
      ['admin', 'admin123', 'admin', []]
    );
    console.log('   ✅ Admin créé (username: admin, password: admin123)');

    await pool.query(
      `INSERT INTO users (username, password, role, assigned_patients) 
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (username) DO NOTHING`,
      ['medecin1', 'user123', 'user', []]
    );
    console.log('   ✅ Médecin créé (username: medecin1, password: user123)');

    await pool.query(
      `INSERT INTO users (username, password, role, assigned_patients) 
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (username) DO NOTHING`,
      ['infirmier1', 'user123', 'user', []]
    );
    console.log('   ✅ Infirmier créé (username: infirmier1, password: user123)');

    console.log('\n🔗 Attribution des patients aux utilisateurs...');

    await pool.query(
      `UPDATE users 
       SET assigned_patients = ARRAY[1, 2, 3, 4] 
       WHERE username = 'medecin1'`
    );
    console.log('   ✅ Patients 1-4 assignés à medecin1');

    await pool.query(
      `UPDATE users 
       SET assigned_patients = ARRAY[5, 6, 7, 8] 
       WHERE username = 'infirmier1'`
    );
    console.log('   ✅ Patients 5-8 assignés à infirmier1');

    await pool.query(
      `UPDATE users 
       SET assigned_patients = '{}' 
       WHERE username = 'admin'`
    );
    console.log('   ✅ Admin a accès à tous les patients');

    console.log('\n🎉 Seeding terminé avec succès!\n');
    console.log('📋 Comptes créés:');
    console.log('   - admin / admin123 (Administrateur)');
    console.log('   - medecin1 / user123 (Médecin - Patients 1-4)');
    console.log('   - infirmier1 / user123 (Infirmier - Patients 5-8)\n');

    await closePool();
  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
    process.exit(1);
  }
};

seed();