-- ============================================
-- SCRIPT DE REMPLISSAGE MIS À JOUR
-- ============================================

-- 1. NETTOYAGE
DELETE FROM antecedents;
DELETE FROM medical_records;
DELETE FROM patients;
DELETE FROM users;

ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE patients_id_seq RESTART WITH 1;
ALTER SEQUENCE medical_records_id_seq RESTART WITH 1;
ALTER SEQUENCE antecedents_id_seq RESTART WITH 1;

-- 2. UTILISATEURS
INSERT INTO users (username, password, role, assigned_patients) VALUES
('admin', 'admin123', 'admin', '{}'),
('medecin1', 'user123', 'user', '{}'),
('infirmier1', 'user123', 'user', '{}'),
('medecin2', 'user123', 'user', '{}');

-- 3. PATIENTS (CIN et téléphones en VARCHAR maintenant)
INSERT INTO patients (
  nom_complet, cin, ass_cnss, date_naissance, sexe, groupe_sanguin,
  profession, situation_familiale, telephone, telephone_urgence, adresse,
  date_debut, type_patient, date_fin, cause_fin
) VALUES
-- Patients permanents
('Ahmed Ben Salem', '01234567', 'CNSS123456', '1975-03-15', 'Homme', 'A+',
 'Enseignant', 'Marie(e)', '98765432', '22334455', '12 Rue de la République, Sfax',
 '2020-01-10', 'Permanent', NULL, NULL),

('Fatma Trabelsi', '08765432', 'CNSS789012', '1982-07-22', 'Femme', 'O+',
 'Infirmière', 'Marie(e)', '97123456', '71234567', '45 Avenue Habib Bourguiba, Sfax',
 '2019-05-15', 'Permanent', NULL, NULL),

('Mohamed Jebali', '01122334', 'CNSS345678', '1968-11-30', 'Homme', 'B+',
 'Commerçant', 'Marie(e)', '50123456', '71987654', '8 Rue Mohamed Ali, Sfax',
 '2018-09-20', 'Permanent', NULL, NULL),

-- Patients vacanciers  
('Pierre Martin', '07788990', 'EUR123456', '1972-06-20', 'Homme', 'A+',
 'Médecin', 'Marie(e)', '33612345678', '33687654321', 'Paris, France',
 '2024-07-01', 'Vacancier', '2024-07-31', NULL),

-- Patients fin traitement
('Ali Zghal', '09900112', 'CNSS445566', '1960-05-10', 'Homme', 'A-',
 'Fonctionnaire', 'Marie(e)', '20123456', '75123456', '78 Rue de Gabes, Sfax',
 '2015-01-05', 'Fin Traitement', '2024-03-20', 'Greffe');

-- 4. ASSIGNATION PATIENTS
UPDATE users SET assigned_patients = ARRAY[1, 2, 3] WHERE username = 'medecin1';
UPDATE users SET assigned_patients = ARRAY[4] WHERE username = 'medecin2';
UPDATE users SET assigned_patients = ARRAY[5] WHERE username = 'infirmier1';

-- 5. ANTÉCÉDENTS (NOUVELLE TABLE)
INSERT INTO antecedents (patient_id, type, content, created_by) VALUES
(1, 'Medicaux', 'Diabète type 2 diagnostiqué en 2010. HTA depuis 2015. Traitement: Metformine 1000mg x2/j, Ramipril 10mg/j.', 1),
(1, 'Chirurgicaux', 'Création FAV radio-céphalique gauche (15/06/2019). Maturation satisfaisante en 6 semaines.', 1),
(1, 'Allergies', 'Allergie à la pénicilline (éruption cutanée + œdème de Quincke en 2008). Éviction stricte.', 1),
(2, 'Medicaux', 'IRC stade 5 sur néphropathie diabétique. Anémie chronique. Rétinopathie diabétique non proliférante.', 1),
(2, 'Statut Infectieux', 'VHB: Vacciné, VHC: Négatif, VIH: Négatif. Dernier contrôle: 2024-01-15', 1);

-- 6. DOSSIERS MÉDICAUX (sans sous-catégories antecedents)
INSERT INTO medical_records (patient_id, category, date, details, created_by) VALUES
(1, 'consultations', '2024-01-15', 'Consultation de routine. Patient stable. Pression artérielle 135/85 mmHg.', 1),
(1, 'traitements', '2024-01-10', 'Ajout Eprex 4000 UI 2x/semaine pour anémie. Hb: 10.2 g/dL.', 1),
(2, 'examens_biologiques', '2024-01-12', 'Bilan rénal: Créatinine 450 µmol/L, Urée 18 mmol/L. Hyperkaliémie modérée: 5.3 mmol/L.', 1);