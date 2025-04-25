import { Request, Response } from 'express';
import { teamService } from '../services/team.service';
import log from '../../logger';

/**
 * Team controller
 */
export class TeamController {
  /**
   * Create a new team
   */
  async createTeam(req: Request, res: Response) {
    try {
      const { name, description } = req.body;

      if (!name) {
        return res.status(400).json({ message: 'Team name is required' });
      }

      const team = await teamService.createTeam(name, description);
      return res.status(201).json(team);
    } catch (error: any) {
      log.error(`Error creating team: ${error}`);
      return res.status(400).json({ message: error.message || 'Error creating team' });
    }
  }

  /**
   * Get all teams
   */
  async getAllTeams(req: Request, res: Response) {
    try {
      const teams = await teamService.getAllTeams();
      return res.status(200).json(teams);
    } catch (error: any) {
      log.error(`Error getting teams: ${error}`);
      return res.status(400).json({ message: error.message || 'Error getting teams' });
    }
  }

  /**
   * Get team by ID
   */
  async getTeamById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: 'Team ID is required' });
      }

      const team = await teamService.getTeamById(id);
      return res.status(200).json(team);
    } catch (error: any) {
      log.error(`Error getting team: ${error}`);
      return res.status(400).json({ message: error.message || 'Error getting team' });
    }
  }

  /**
   * Update team
   */
  async updateTeam(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      if (!id) {
        return res.status(400).json({ message: 'Team ID is required' });
      }

      const team = await teamService.updateTeam(id, name, description);
      return res.status(200).json(team);
    } catch (error: any) {
      log.error(`Error updating team: ${error}`);
      return res.status(400).json({ message: error.message || 'Error updating team' });
    }
  }

  /**
   * Delete team
   */
  async deleteTeam(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: 'Team ID is required' });
      }

      await teamService.deleteTeam(id);
      return res.status(200).json({ message: 'Team deleted successfully' });
    } catch (error: any) {
      log.error(`Error deleting team: ${error}`);
      return res.status(400).json({ message: error.message || 'Error deleting team' });
    }
  }

  /**
   * Add user to team
   */
  async addUserToTeam(req: Request, res: Response) {
    try {
      const { id: teamId } = req.params;
      const { add, remove } = req.body;

      if (!teamId || !add || !remove) {
        return res.status(400).json({ message: 'Team ID and User ID are required' });
      }

      await teamService.removeUserFromTeam(remove, teamId);
      const teamMember = await teamService.addUserToTeam(add, teamId);
      return res.status(201).json(teamMember);
    } catch (error: any) {
      log.error(`Error adding user to team: ${error}`);
      return res.status(400).json({ message: error.message || 'Error adding user to team' });
    }
  }

  /**
   * Remove user from team
   */
  async removeUserFromTeam(req: Request, res: Response) {
    try {
      const { teamId, userId } = req.body;

      if (!teamId || !userId) {
        return res.status(400).json({ message: 'Team ID and User ID are required' });
      }

      await teamService.removeUserFromTeam(userId, teamId);
      return res.status(200).json({ message: 'User removed from team successfully' });
    } catch (error: any) {
      log.error(`Error removing user from team: ${error}`);
      return res.status(400).json({ message: error.message || 'Error removing user from team' });
    }
  }

  /**
   * Get teams for user
   */
  async getTeamsForUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }

      const teams = await teamService.getTeamsForUser(userId);
      return res.status(200).json(teams);
    } catch (error: any) {
      log.error(`Error getting teams for user: ${error}`);
      return res.status(400).json({ message: error.message || 'Error getting teams for user' });
    }
  }
}

export const teamController = new TeamController();
