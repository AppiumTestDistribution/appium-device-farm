import { Router } from 'express';
import authRouter from './auth.router';
import teamRouter from './team.router';
import deviceAllocationRouter from './device-allocation.router';

const router = Router();

// Mount the routers
router.use('/auth', authRouter);
router.use('/teams', teamRouter);
router.use('/device-allocations', deviceAllocationRouter);

export default router;
