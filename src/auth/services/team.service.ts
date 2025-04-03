import { prisma } from '../../prisma';
import log from '../../logger';

/**
 * Team service for handling team-related operations
 */
export class TeamService {
  /**
   * Create a new team
   */
  async createTeam(name: string, description?: string) {
    try {
      // Check if team already exists
      const existingTeam = await prisma.team.findUnique({
        where: { name },
      });

      if (existingTeam) {
        throw new Error('Team already exists');
      }

      // Create team
      const team = await prisma.team.create({
        data: {
          name,
          description,
        },
      });

      return team;
    } catch (error) {
      log.error(`Error creating team: ${error}`);
      throw error;
    }
  }

  /**
   * Get all teams
   */
  async getAllTeams() {
    try {
      const teams = await prisma.team.findMany({
        include: {
          teamMembers: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  role: true,
                },
              },
            },
          },
          deviceAllocations: true,
        },
      });

      return teams;
    } catch (error) {
      log.error(`Error getting teams: ${error}`);
      throw error;
    }
  }

  /**
   * Get team by ID
   */
  async getTeamById(teamId: string) {
    try {
      const team = await prisma.team.findUnique({
        where: { id: teamId },
        include: {
          teamMembers: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  role: true,
                },
              },
            },
          },
          deviceAllocations: true,
        },
      });

      if (!team) {
        throw new Error('Team not found');
      }

      return team;
    } catch (error) {
      log.error(`Error getting team: ${error}`);
      throw error;
    }
  }

  /**
   * Update team
   */
  async updateTeam(teamId: string, name?: string, description?: string) {
    try {
      // Check if team exists
      const team = await prisma.team.findUnique({
        where: { id: teamId },
      });

      if (!team) {
        throw new Error('Team not found');
      }

      // Update team
      const updatedTeam = await prisma.team.update({
        where: { id: teamId },
        data: {
          name: name || team.name,
          description: description !== undefined ? description : team.description,
        },
      });

      return updatedTeam;
    } catch (error) {
      log.error(`Error updating team: ${error}`);
      throw error;
    }
  }

  /**
   * Delete team
   */
  async deleteTeam(teamId: string) {
    try {
      await prisma.team.delete({
        where: { id: teamId },
      });

      return { success: true };
    } catch (error) {
      log.error(`Error deleting team: ${error}`);
      throw error;
    }
  }

  /**
   * Add user to team
   */
  async addUserToTeam(userId: string, teamId: string) {
    try {
      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Check if team exists
      const team = await prisma.team.findUnique({
        where: { id: teamId },
      });

      if (!team) {
        throw new Error('Team not found');
      }

      // Check if user is already in team
      const existingMembership = await prisma.teamMember.findFirst({
        where: {
          userId,
          teamId,
        },
      });

      if (existingMembership) {
        throw new Error('User is already a member of this team');
      }

      // Add user to team
      const teamMember = await prisma.teamMember.create({
        data: {
          userId,
          teamId,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              role: true,
            },
          },
          team: true,
        },
      });

      return teamMember;
    } catch (error) {
      log.error(`Error adding user to team: ${error}`);
      throw error;
    }
  }

  /**
   * Remove user from team
   */
  async removeUserFromTeam(userId: string, teamId: string) {
    try {
      // Check if user is in team
      const teamMember = await prisma.teamMember.findFirst({
        where: {
          userId,
          teamId,
        },
      });

      if (!teamMember) {
        throw new Error('User is not a member of this team');
      }

      // Remove user from team
      await prisma.teamMember.delete({
        where: {
          id: teamMember.id,
        },
      });

      return { success: true };
    } catch (error) {
      log.error(`Error removing user from team: ${error}`);
      throw error;
    }
  }

  /**
   * Get teams for user
   */
  async getTeamsForUser(userId: string) {
    try {
      const teamMembers = await prisma.teamMember.findMany({
        where: {
          userId,
        },
        include: {
          team: {
            include: {
              deviceAllocations: true,
            },
          },
        },
      });

      return teamMembers.map((member) => member.team);
    } catch (error) {
      log.error(`Error getting teams for user: ${error}`);
      throw error;
    }
  }
}

export const teamService = new TeamService();
