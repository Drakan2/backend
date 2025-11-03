/**
 * Service d'authentification
 * Gère le login et changement de mot de passe (SANS hashage)
 */

import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';
import { env } from '../config/env';
import { VALIDATION_CONSTANTS } from '../config/constants';
import type { User } from '../shared/types/user';
import type { ID } from '../shared/types/common';

interface AuthPayload {
  userId: ID;
  username: string;
  role: User['role'];
}

interface LoginResponse {
  user: Omit<User, 'password'>;
  token: string;
}

export class AuthService {
  private repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  /**
   * Authentifie un utilisateur (SANS hashage)
   */
  async login(username: string, password: string): Promise<LoginResponse> {
    const user = await this.repository.findByUsername(username);
    
    if (!user) {
      throw new Error('Nom d\'utilisateur ou mot de passe incorrect');
    }

    // ✅ Comparaison directe sans hashage
    if (user.password !== password) {
      throw new Error('Nom d\'utilisateur ou mot de passe incorrect');
    }

    const token = this.generateToken({
      userId: user.id!,
      username: user.username,
      role: user.role,
    });

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  /**
   * Change le mot de passe (SANS hashage)
   */
  async changePassword(userId: ID, oldPassword: string, newPassword: string): Promise<void> {
    const user = await this.repository.findById(userId);
    
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    // ✅ Comparaison directe
    if (user.password !== oldPassword) {
      throw new Error('Ancien mot de passe incorrect');
    }

    if (newPassword.length < VALIDATION_CONSTANTS.MIN_PASSWORD_LENGTH) {
      throw new Error(`Le mot de passe doit contenir au moins ${VALIDATION_CONSTANTS.MIN_PASSWORD_LENGTH} caractères`);
    }

    // ✅ Stocker en clair
    await this.repository.update(userId, { password: newPassword });
  }

  generateToken(payload: AuthPayload): string {
  const secret = env.JWT_SECRET as jwt.Secret;

  // Hack typage TS pour expiresIn (évite erreur 2322)
  const options: jwt.SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as unknown as jwt.SignOptions['expiresIn'],
  };

  return jwt.sign(payload, secret, options);
}


  verifyToken(token: string): AuthPayload {
    try {
      return jwt.verify(token, env.JWT_SECRET) as AuthPayload;
    } catch (error) {
      console.error('❌ JWT Verification failed:', error);
      throw new Error('Token invalide ou expiré');
    }
  }

  async validateUser(userId: ID): Promise<User> {
    const user = await this.repository.findById(userId);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
    return user;
  }
}