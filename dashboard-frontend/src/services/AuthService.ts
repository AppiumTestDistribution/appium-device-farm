import axios from 'axios';
import DeviceFarmApiService from '../api-service';
import apiClient from '../api-service/api-client';

// User interface
export interface User {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  accessKey?: string;
  isActive: boolean;
}

// Auth response interface
export interface AuthResponse {
  token: string;
  user: User;
}

// Auth service class
class AuthService {
  // Store token in localStorage
  private setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Get token from localStorage
  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Remove token from localStorage
  private removeToken(): void {
    localStorage.removeItem('token');
  }

  // Set auth header for axios requests
  public setAuthHeader(): void {
    const token = this.getToken();
    if (token) {
      apiClient.setToken(token);
    } else {
      apiClient.setToken(null);
    }
  }

  // Login user
  public async login(username: string, password: string): Promise<AuthResponse> {
    try {
      const { token, user } = await apiClient.makePOSTRequest(
        '/auth/login',
        {},
        { username, password },
      );
      console.log(token, user);
      if (!token || !user) {
        throw new Error('Invalid credentials');
      }
      this.setToken(token);
      this.setAuthHeader();
      return { token, user };
    } catch (error) {
      console.log(error);
      throw new Error('Invalid credentials');
    }
  }

  // Register user (admin only)
  public async register(
    username: string,
    password: string,
    firstname: string,
    lastname: string,
    role: string,
  ): Promise<User> {
    try {
      const response = await apiClient.makePOSTRequest(
        '/users',
        {},
        { username, password, firstname, lastname, role },
      );
      return response;
    } catch (error) {
      throw new Error('Error registering user');
    }
  }

  // Get current user
  public async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.makeGETRequest('/auth/me', {});
      if (response.status && response.status !== 200) {
        throw new Error('No user found');
      }
      return response;
    } catch (error) {
      throw new Error('Error getting current user');
    }
  }

  public async getAllUsers(): Promise<User[]> {
    try {
      const response = await apiClient.makeGETRequest('/users', {});
      return response;
    } catch (error) {
      throw new Error('Error getting all users');
    }
  }

  // Change password
  public async updateUser(
    userId: string,
    data: {
      password?: string;
      firstname?: string;
      lastname?: string;
      role?: string;
      isActive?: boolean;
    },
  ): Promise<void> {
    try {
      await apiClient.makePUTRequest(`/users/${userId}`, {}, data);
    } catch (error) {
      throw new Error('Error updating user');
    }
  }

  public async activateUser(userId: string): Promise<void> {
    try {
      await apiClient.makePUTRequest(`/auth/users/${userId}/activate`, {}, {});
    } catch (error) {
      throw new Error('Error activating user');
    }
  }

  public async deactivateUser(userId: string): Promise<void> {
    try {
      await apiClient.makePUTRequest(`/auth/users/${userId}/deactivate`, {}, {});
    } catch (error) {
      throw new Error('Error deactivating user');
    }
  }

  public async deleteUser(userId: string): Promise<void> {
    try {
      await apiClient.makeDELETERequest(`/auth/users/${userId}`);
    } catch (error) {
      throw new Error('Error deleting user');
    }
  }

  // Logout user
  public logout(): void {
    this.removeToken();
    this.setAuthHeader();
  }

  // Check if user is authenticated
  public isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Check if user is admin
  public async isAdmin(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return user.role === 'admin';
    } catch (error) {
      return false;
    }
  }

  // Initialize auth header on app load
  public initAuth(): void {
    this.setAuthHeader();
  }
}

export default new AuthService();
