-- ============================================
-- MIGRATION 002: Données de Test
-- Remplit la base avec des données réalistes
-- ============================================

-- ⚠️ IMPORTANT: Les mots de passe sont hashés avec bcrypt
-- Ils seront générés par le script seed.ts
-- Ce fichier insère uniquement les données patients et medical records

-- ============================================
-- PATIENTS PERMANENTS
-- ============================================

INSERT INTO patients (
  nom_complet, cin, ass_cnss, date_naissance, sexe, groupe_sanguin,
  profession, situation_familiale, telephone, telephone_urgence, adresse,
  date_debut, type_patient, date_fin, cause_fin
) VALUES
('Ahmed Ben Salem', 12345678, 'CNSS123456', '1975-03-15', 'Homme', 'A+',
 'Enseignant', 'Marié(e)', 98765432, 22334455, '12 Rue de la République, Sfax',
 '2020-01-10', 'Permanent', NULL, NULL),

('Fatma Trabelsi', 87654321, 'CNSS789012', '1982-07-22', 'Femme', 'O+',
 'Infirmière', 'Marié(e)', 97123456, 71234567, '45 Avenue Habib Bourguiba, Sfax',
 '2019-05-15', 'Permanent', NULL, NULL),

('Mohamed Jebali', 11223344, 'CNSS345678', '1968-11-30', 'Homme', 'B+',
 'Commerçant', 'Marié(e)', 50123456, 71987654, '8 Rue Mohamed Ali, Sfax',
 '2018-09-20', 'Permanent', NULL, NULL),

('Amira Gharbi', 99887766, 'CNSS901234', '1990-04-18', 'Femme', 'AB+',
 'Pharmacienne', 'Célibataire', 24567890, 73456789, '23 Avenue de la Liberté, Sfax',
 '2021-02-28', 'Permanent', NULL, NULL),

('Karim Mansour', 55667788, 'CNSS567890', '1955-08-05', 'Homme', 'A-',
 'Retraité', 'Veuf(ve)', 29876543, 74567890, '67 Rue des Martyrs, Sfax',
 '2017-06-12', 'Permanent', NULL, NULL),

('Salma Bouazizi', 44556677, 'CNSS234567', '1978-12-25', 'Femme', 'O-',
 'Comptable', 'Divorcé(e)', 52345678, 72345678, '34 Rue de Tunis, Sfax',
 '2020-11-08', 'Permanent', NULL, NULL),

('Youssef Mejri', 33445566, 'CNSS678901', '1985-02-14', 'Homme', 'B-',
 'Ingénieur', 'Marié(e)', 58765432, 73210987, '19 Avenue Majida Boulila, Sfax',
 '2019-08-03', 'Permanent', NULL, NULL),

('Houda Dridi', 22334455, 'CNSS123789', '1970-09-09', 'Femme', 'A+',
 'Secrétaire', 'Marié(e)', 98123456, 71456789, '56 Rue Mongi Slim, Sfax',
 '2018-03-17', 'Permanent', NULL, NULL);

-- ============================================
-- PATIENTS VACANCIERS
-- ============================================

INSERT INTO patients (
  nom_complet, cin, ass_cnss, date_naissance, sexe, groupe_sanguin,
  profession, situation_familiale, telephone, telephone_urgence, adresse,
  date_debut, type_patient, date_fin, cause_fin
) VALUES
('Pierre Martin', 77889900, 'EUR123456', '1972-06-20', 'Homme', 'A+',
 'Médecin', 'Marié(e)', 33612345678, 33687654321, 'Paris, France',
 '2024-07-01', 'Vacancier', '2024-07-31', NULL),

('Maria Garcia', 66778899, 'ESP789012', '1980-03-12', 'Femme', 'O+',
 'Professeur', 'Marié(e)', 34623456789, 34698765432, 'Madrid, Espagne',
 '2024-08-10', 'Vacancier', '2024-08-25', NULL),

('Hans Schmidt', 55668899, 'DEU345678', '1965-11-05', 'Homme', 'B+',
 'Ingénieur', 'Marié(e)', 49151234567, 49178901234, 'Berlin, Allemagne',
 '2024-06-15', 'Vacancier', '2024-06-30', NULL);

-- ============================================
-- PATIENTS FIN DE TRAITEMENT
-- ============================================

INSERT INTO patients (
  nom_complet, cin, ass_cnss, date_naissance, sexe, groupe_sanguin,
  profession, situation_familiale, telephone, telephone_urgence, adresse,
  date_debut, type_patient, date_fin, cause_fin
) VALUES
('Ali Zghal', 99001122, 'CNSS445566', '1960-05-10', 'Homme', 'A-',
 'Fonctionnaire', 'Marié(e)', 20123456, 75123456, '78 Rue de Gabes, Sfax',
 '2015-01-05', 'Fin Traitement', '2024-03-20', 'Greffe'),

('Leila Hamdi', 88990011, 'CNSS778899', '1975-08-22', 'Femme', 'O-',
 'Enseignante', 'Marié(e)', 23456789, 74890123, '90 Avenue Hédi Chaker, Sfax',
 '2016-04-12', 'Fin Traitement', '2024-01-15', 'Transféré'),

('Nabil Kallel', 77880099, 'CNSS112233', '1958-12-30', 'Homme', 'B+',
 'Retraité', 'Veuf(ve)', 27890123, 73567890, '45 Rue de Sousse, Sfax',
 '2014-09-08', 'Fin Traitement', '2023-11-05', 'Décès');

-- ============================================
-- MEDICAL RECORDS
-- Les IDs des patients et users seront automatiques
-- On utilise les IDs générés par SERIAL
-- ============================================

-- Antécédents Médicaux
INSERT INTO medical_records (patient_id, category, sub_category, date, details, created_by) VALUES
(1, 'antecedents', 'Médicaux', '2020-01-10', 'Diabète type 2 depuis 2010. Hypertension artérielle depuis 2015.', 1),
(2, 'antecedents', 'Médicaux', '2019-05-15', 'Insuffisance rénale chronique stade 5. Anémie chronique.', 1),
(3, 'antecedents', 'Médicaux', '2018-09-20', 'Hypertension artérielle. Cardiopathie ischémique.', 1),
(4, 'antecedents', 'Médicaux', '2021-02-28', 'Lupus érythémateux systémique. Néphropathie lupique.', 1);

-- Antécédents Chirurgicaux
INSERT INTO medical_records (patient_id, category, sub_category, date, details, created_by) VALUES
(1, 'antecedents', 'Chirurgicaux', '2019-06-15', 'Création fistule artério-veineuse bras gauche.', 1),
(2, 'antecedents', 'Chirurgicaux', '2018-11-20', 'Appendicectomie (2005). Cholécystectomie (2015).', 1),
(5, 'antecedents', 'Chirurgicaux', '2017-03-10', 'Pose cathéter tunnellisé jugulaire droit.', 1);

-- Allergies
INSERT INTO medical_records (patient_id, category, sub_category, date, details, created_by) VALUES
(1, 'antecedents', 'Allergies', '2020-01-10', 'Allergie à la pénicilline (éruption cutanée).', 1),
(4, 'antecedents', 'Allergies', '2021-02-28', 'Allergie aux produits de contraste iodés.', 1),
(6, 'antecedents', 'Allergies', '2020-11-08', 'Pas d''allergie connue.', 1);

-- Statut Infectieux
INSERT INTO medical_records (patient_id, category, sub_category, date, details, created_by) VALUES
(1, 'antecedents', 'Statut Infectieux', '2024-01-15', 'HBs Ag: négatif. Anti-HCV: négatif. HIV: négatif.', 1),
(2, 'antecedents', 'Statut Infectieux', '2024-02-20', 'HBs Ag: négatif. Anti-HCV: négatif. HIV: négatif.', 1),
(3, 'antecedents', 'Statut Infectieux', '2024-03-10', 'HBs Ag: négatif. Anti-HCV: négatif. HIV: négatif.', 1);

-- Accès Vasculaire
INSERT INTO medical_records (patient_id, category, sub_category, date, details, created_by) VALUES
(1, 'acces_vasculaire', NULL, '2020-01-10', 'FAV radio-céphalique gauche, fonctionnelle. Débit satisfaisant.', 1),
(2, 'acces_vasculaire', NULL, '2019-05-15', 'FAV brachio-céphalique droite. Bon débit (>600ml/min).', 1),
(3, 'acces_vasculaire', NULL, '2018-09-20', 'Cathéter tunnellisé jugulaire droit. Fonctionnel.', 1);

-- Traitements
INSERT INTO medical_records (patient_id, category, sub_category, date, details, created_by) VALUES
(1, 'traitements', NULL, '2024-01-01', 'HD 3x/sem (L-M-V). Durée: 4h. Débit: 300ml/min. UFnet: 2-3L.', 1),
(2, 'traitements', NULL, '2024-01-01', 'HD 3x/sem (M-J-S). EPO 4000UI/sem. Fer IV mensuel.', 1),
(3, 'traitements', NULL, '2024-01-01', 'HD 3x/sem. Insuline Lantus 20UI/j. Amlodipine 10mg/j.', 1);

-- Examens Biologiques
INSERT INTO medical_records (patient_id, category, sub_category, date, details, created_by) VALUES
(1, 'examens_biologiques', NULL, '2024-09-15', 'Hb: 11.2g/dl. Urée pré: 135mg/dl. Créat: 8.5mg/dl. K+: 5.2mmol/l.', 1),
(2, 'examens_biologiques', NULL, '2024-09-20', 'Hb: 10.8g/dl. Urée pré: 142mg/dl. PTH: 450pg/ml. Ca: 9.2mg/dl.', 1),
(3, 'examens_biologiques', NULL, '2024-09-25', 'Hb: 9.5g/dl. Fer: 45µg/dl. Albumine: 38g/l. CRP: 12mg/l.', 1);

-- Imagerie et Bilans
INSERT INTO medical_records (patient_id, category, sub_category, date, details, created_by) VALUES
(1, 'imagerie_bilans', NULL, '2024-06-10', 'Echo-doppler FAV: Perméable. Débit 800ml/min. Pas de sténose.', 1),
(2, 'imagerie_bilans', NULL, '2024-07-15', 'Radio thorax: Cardiomégalie modérée. Pas d''épanchement.', 1),
(3, 'imagerie_bilans', NULL, '2024-08-20', 'Echo cardiaque: FEVG 55%. Pas d''anomalie valvulaire.', 1);

-- Vaccinations
INSERT INTO medical_records (patient_id, category, sub_category, date, details, created_by) VALUES
(1, 'vaccinations', NULL, '2023-10-01', 'Hépatite B: 3 doses complètes (2020-2021). Sérologie protectrice.', 1),
(2, 'vaccinations', NULL, '2023-09-15', 'Grippe saisonnière 2023. Hépatite B à jour.', 1),
(3, 'vaccinations', NULL, '2023-11-20', 'Pneumocoque 23-valent. Rappel prévu dans 5 ans.', 1),
(4, 'vaccinations', NULL, '2024-01-10', 'COVID-19: 3 doses. Dernière dose: décembre 2023.', 1);

-- ============================================
-- FIN DU SCRIPT
-- ============================================