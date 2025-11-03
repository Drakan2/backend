/**
 * Configuration et gestion de la connexion PostgreSQL
 * Utilise le pattern de Connection Pool pour optimiser les performances
 */

import { Pool, PoolConfig, QueryResult, QueryResultRow } from 'pg';
import { env } from './env';

/**
 * Configuration du pool de connexions PostgreSQL
 */
const poolConfig: PoolConfig = {
  connectionString: env.DATABASE_URL,
  max: 20, // Maximum 20 connexions simultanées
  idleTimeoutMillis: 30000, // Fermer les connexions inactives après 30s
  connectionTimeoutMillis: 2000, // Timeout de connexion de 2s
};

/**
 * Pool de connexions PostgreSQL
 * Réutilise les connexions pour de meilleures performances
 */
export const pool = new Pool(poolConfig);

/**
 * Gestion des erreurs du pool
 */
pool.on('error', (err: Error) => {
  console.error('❌ Erreur inattendue dans le pool PostgreSQL:', err);
  process.exit(-1);
});

/**
 * Fonction helper pour exécuter des requêtes SQL
 * @param text - Requête SQL
 * @param params - Paramètres de la requête (protection SQL injection)
 * @returns Les résultats de la requête
 */
export const query = async <T extends QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<T[]> => {
  const start = Date.now();
  try {
    const result: QueryResult<T> = await pool.query<T>(text, params);
    const duration = Date.now() - start;
    
    // Log des requêtes en mode développement
    if (env.NODE_ENV === 'development') {
      console.log('📊 Query exécutée', {
        text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
        duration: `${duration}ms`,
        rows: result.rowCount,
      });
    }
    
    return result.rows;
  } catch (error) {
    console.error('❌ Erreur dans la requête SQL:', { text, error });
    throw error;
  }
};

/**
 * Obtenir une connexion du pool
 * Utilisé pour les transactions
 */
export const getClient = () => pool.connect();

/**
 * Fermer proprement le pool de connexions
 * Appelé lors de l'arrêt du serveur
 */
export const closePool = async (): Promise<void> => {
  await pool.end();
  console.log('🔌 Pool PostgreSQL fermé');
};