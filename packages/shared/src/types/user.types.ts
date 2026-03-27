export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
}

export interface User {
  id: string;
  email: string;
  phoneNumber?: string;
  phoneVerified: boolean;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: UserRole;
  city: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export interface UserProfile extends Omit<User, 'password'> {
  listingsCount: number;
  memberSince: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  tokens: AuthTokens;
}
