import axios from 'axios';
import DeviceFarmApiService from '../api-service';
import apiClient from '../api-service/api-client';
import { User } from './AuthService';

export interface TeamMember {
  id: string;
  userId: string;
  teamId: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    username: string;
    role: string;
  };
}

export interface TeamDevice {
  id: string;
  deviceId: string;
  teamId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  teamMembers: TeamMember[];
  teamDevices: TeamDevice[];
}

class TeamsService {
  public async getAll(): Promise<Team[]> {
    try {
      const response = await apiClient.makeGETRequest('/teams', {});
      return response;
    } catch (error) {
      throw new Error('Error getting all teams');
    }
  }

  public async create(team: Pick<Team, 'name' | 'description'>): Promise<Team> {
    try {
      const response = await apiClient.makePOSTRequest('/teams', {}, team);
      return response;
    } catch (error) {
      throw new Error('Error Saving teams');
    }
  }

  public async updateTeam(teamId: string, team: Partial<Team>): Promise<Team> {
    try {
      const response = await apiClient.makePUTRequest(`/teams/${teamId}`, {}, team);
      return response;
    } catch (error) {
      throw new Error('Error updating team');
    }
  }

  public async manageMembers(teamId: string, add: string[], remove: string[]): Promise<Team> {
    try {
      const response = await apiClient.makePOSTRequest(
        `/teams/${teamId}/members`,
        {},
        { add, remove },
      );
      return response;
    } catch (error) {
      throw new Error('Error Saving teams');
    }
  }

  public async manageDevices(teamId: string, add: string[], remove: string[]): Promise<Team> {
    try {
      const response = await apiClient.makePOSTRequest(
        `/teams/${teamId}/devices`,
        {},
        { add, remove },
      );
      return response;
    } catch (error) {
      throw new Error('Error Saving teams');
    }
  }

  public async deleteTeam(teamId: string): Promise<void> {
    try {
      await apiClient.makeDELETERequest(`/teams/${teamId}`);
    } catch (error) {
      throw new Error(
        `Error deleting team: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}

export default new TeamsService();
