/**
 * Configuration des variables d'environnement
 * Charge et valide toutes les variables nécessaires
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Charger le fichier .env
config({ path: resolve(__dirname, '../../.env') });

/**
 * Interface pour la configuration de l'environnement
 */
interface EnvConfig {
  readonly NODE_ENV: string;
  readonly PORT: number;
  readonly DATABASE_URL: string;
  readonly JWT_SECRET: string;
  readonly JWT_EXPIRES_IN: string;
  readonly CORS_ORIGIN: string;
}

/**
 * Récupère une variable d'environnement avec validation
 * @param key - Nom de la variable
 * @param defaultValue - Valeur par défaut (optionnel)
 * @returns La valeur de la variable
 * @throws Error si la variable est requise et non définie
 */
const getEnvVariable = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`❌ Variable d'environnement ${key} non définie dans .env`);
  }
  return value;
};

/**
 * Configuration de l'environnement
 * Exportée comme constante pour l'utiliser partout
 */
export const env: EnvConfig = {
  NODE_ENV: getEnvVariable('NODE_ENV', 'development'),
  PORT: parseInt(getEnvVariable('PORT', '3000'), 10),
  DATABASE_URL: getEnvVariable('DATABASE_URL'),
  JWT_SECRET: getEnvVariable('JWT_SECRET'),
  JWT_EXPIRES_IN: getEnvVariable('JWT_EXPIRES_IN', '24h'),
  CORS_ORIGIN: getEnvVariable('CORS_ORIGIN', 'http://localhost:8080'),
} as const;

// Log de la configuration au démarrage (sans secrets)
console.log('📋 Configuration chargée:');
console.log(`   - Environment: ${env.NODE_ENV}`);
console.log(`   - Port: ${env.PORT}`);
console.log(`   - CORS Origin: ${env.CORS_ORIGIN}`);
console.log(`   - JWT Expires: ${env.JWT_EXPIRES_IN}`);