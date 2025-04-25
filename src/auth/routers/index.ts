import { Router } from 'express';
import authRouter from './auth.router';
import teamRouter from './team.router';
import deviceAllocationRouter from './device-allocation.router';
import usersRouter from './users.router';

export function resigsterAuthenticationRoutes(router: Router) {
  router.use('/auth', authRouter);
  router.use('/users', usersRouter);
  router.use('/teams', teamRouter);
  router.use('/device-allocations', deviceAllocationRouter);
}
