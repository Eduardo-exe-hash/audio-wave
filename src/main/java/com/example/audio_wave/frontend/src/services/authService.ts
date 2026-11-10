
import axios from 'axios';

const API_BASE_URL = '/api';

export interface LoginCredentials {
  email?: string;
  username?: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface RegisterData {
  email: string;
  password: string;
}

export const login = async (credentials: LoginCredentials): Promise<string> => {
  const response = await axios.post<AuthResponse>(
    `${API_BASE_URL}/auth/login`,
    credentials
  );

  const { token } = response.data;

  if (token) {
    localStorage.setItem('token', token);
  }

  return token;
};

export const register = async (data: RegisterData): Promise<void> => {
  await axios.post(`${API_BASE_URL}/auth/register`, data);
};

export const logout = (): void => {
  localStorage.removeItem('token');
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};
