🏥 Backend API - Gestion Patients Dialyse
API REST complète pour la gestion des patients en dialyse.

📋 Technologies
Node.js 18+
Express.js - Framework web
TypeScript - Langage typé
PostgreSQL - Base de données
JWT - Authentification
bcryptjs - Hashing des mots de passe
🚀 Installation
Prérequis
Node.js 18+
PostgreSQL 13+
npm ou yarn
Étapes
bash

# 1. Installer les dépendances

npm install

# 2. Créer le fichier .env

cp .env.example .env

# Éditer .env avec vos paramètres

# 3. Créer la base de données

createdb gestion_patients

# 4. Exécuter les migrations

psql -d gestion_patients -f src/db/migrations/001_initial_schema.sql
psql -d gestion_patients -f src/db/migrations/002_seed_data.sql

# 5. Créer les utilisateurs de test

npm run seed

# 6. Démarrer en mode développement

npm run dev
📁 Structure
backend/
├── src/
│ ├── shared/ # Types et constantes partagés (copie de src/shared)
│ ├── config/ # Configuration (env, database, constants)
│ ├── db/ # Base de données (schema, migrations, seed)
│ ├── repositories/ # Accès aux données (pattern Repository)
│ ├── services/ # Logique métier
│ ├── routes/ # Endpoints API
│ ├── middleware/ # Middleware Express (auth, errors)
│ ├── utils/ # Utilitaires
│ └── server.ts # Point d'entrée
└── package.json
🔐 Authentification
L'API utilise JWT pour l'authentification. Tous les endpoints (sauf /api/users/login) nécessitent un token.

Header requis
Authorization: Bearer <votre_token_jwt>
📡 Endpoints
Authentification
POST /api/users/login - Connexion
POST /api/users/change-password - Changer le mot de passe
Patients
GET /api/patients - Liste des patients
GET /api/patients/:id - Détails d'un patient
POST /api/patients - Créer un patient (admin)
PUT /api/patients/:id - Modifier un patient (admin)
DELETE /api/patients/:id - Supprimer un patient (admin)
GET /api/patients/statistics - Statistiques (admin)
Utilisateurs
GET /api/users - Liste des utilisateurs (admin)
GET /api/users/me - Profil actuel
GET /api/users/:id - Détails utilisateur (admin)
POST /api/users - Créer utilisateur (admin)
PUT /api/users/:id - Modifier utilisateur (admin)
DELETE /api/users/:id - Supprimer utilisateur (admin)
POST /api/users/:id/assign-patients - Assigner patients (admin)
Dossiers Médicaux
GET /api/medical-records - Liste des dossiers
GET /api/medical-records/:id - Détails d'un dossier
POST /api/medical-records - Créer un dossier
PUT /api/medical-records/:id - Modifier un dossier
DELETE /api/medical-records/:id - Supprimer un dossier
👥 Utilisateurs de test
Après npm run seed:

Username Password Rôle Patients assignés
admin admin123 admin Tous
medecin1 user123 user 1-4
infirmier1 user123 user 5-8
⚠️ Changez ces mots de passe en production !

🗄️ Base de données
Tables
users - Utilisateurs du système
patients - Informations des patients
medical_records - Dossiers médicaux
Types ENUM
sexe_type: Homme, Femme
groupe_sanguin_type: A+, A-, B+, B-, AB+, AB-, O+, O-
type_patient_type: Permanent, Vacancier, Fin Traitement
cause_fin_type: Transféré, Décès, Greffe
situation_familiale_type: Célibataire, Marié(e), Divorcé(e), Veuf(ve)
user_role_type: admin, user
🛠️ Scripts npm
bash
npm run dev # Démarrage en mode développement
npm run build # Compilation TypeScript
npm start # Démarrage en production
npm run seed # Peupler la DB avec données de test
📝 Variables d'environnement
Voir .env.example pour la configuration complète.

🔒 Sécurité
✅ Mots de passe hashés avec bcrypt (10 rounds)
✅ JWT avec expiration configurable
✅ Helmet.js pour headers sécurisés
✅ CORS configuré
✅ Prepared statements (protection SQL injection)
✅ Validation stricte TypeScript (no any)
📄 License
MIT
