import apiClient from '../api-service/api-client';

// API Token interface
export interface ApiToken {
  id: string;
  name: string;
  token: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Create API Token request interface
export interface CreateApiTokenRequest {
  name: string;
  expiresAt?: string;
}

class ApiTokenService {
  /**
   * Create a new API token
   */
  public async createApiToken(data: CreateApiTokenRequest): Promise<ApiToken> {
    try {
      const response = await apiClient.makePOSTRequest('/api-tokens', {}, data);
      return response;
    } catch (error) {
      throw new Error('Error creating API token');
    }
  }

  /**
   * Delete an API token
   */
  public async deleteApiToken(tokenId: string): Promise<void> {
    try {
      await apiClient.makeDELETERequest(`/api-tokens/${tokenId}`);
    } catch (error) {
      throw new Error('Error deleting API token');
    }
  }

  /**
   * List all API tokens for the current user
   */
  public async listApiTokens(): Promise<ApiToken[]> {
    try {
      const response = await apiClient.makeGETRequest('/api-tokens', {});
      return response;
    } catch (error) {
      throw new Error('Error listing API tokens');
    }
  }
}

export default new ApiTokenService();
