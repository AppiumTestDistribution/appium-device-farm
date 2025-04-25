import { Router } from 'express';
import { teamController } from '../controllers/team.controller';
import { authMiddleware, adminOnly } from '../middleware/auth.middleware';

const router = Router();

// Team management routes (admin only)
router.post('/', authMiddleware, adminOnly, teamController.createTeam.bind(teamController));
router.get('/', authMiddleware, teamController.getAllTeams.bind(teamController));
router.get('/:id', authMiddleware, teamController.getTeamById.bind(teamController));
router.put('/:id', authMiddleware, adminOnly, teamController.updateTeam.bind(teamController));
router.delete('/:id', authMiddleware, adminOnly, teamController.deleteTeam.bind(teamController));

// Team membership routes
router.post(
  '/:id/members',
  authMiddleware,
  adminOnly,
  teamController.addUserToTeam.bind(teamController),
);
router.delete(
  '/:id/members',
  authMiddleware,
  adminOnly,
  teamController.removeUserFromTeam.bind(teamController),
);

// Get teams for user
router.get('/user/:userId', authMiddleware, teamController.getTeamsForUser.bind(teamController));

export default router;
