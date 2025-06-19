export interface User {
    uuid: string;
    username: string;
    fullName: string;
    email: string;
  }

export interface AuthState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
  }

export interface LoginCredentials {
    identifier: string;
    password: string;
  }

export interface SignupCredentials {
    username: string;
    fullName: string;
    email: string;
    password: string;
  }

export interface AuthResponse {
    token: string;
    user: User;
  }
