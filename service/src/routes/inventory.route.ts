import express, { Router } from 'express';
import triggerInventoryMonitor from '@controllers/inventory/inventory-monitor.controller.js';
import { authenticateUser } from '@middlewares/auth.middleware.js';

const router: Router = express.Router();

router.post('/monitor/reorders', authenticateUser, triggerInventoryMonitor);

export default router;
