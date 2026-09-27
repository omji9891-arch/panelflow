/**
 * Availability Routes
 *
 * GET  /  → read current schedule
 * PUT  /  → upsert (create or full-replace) schedule
 *
 * Protected by adminAuth middleware (applied at mount point in index.ts).
 */
import { Router } from 'express';
import { availabilityController } from '../controllers/availability.controller';

const router = Router();

router.get('/', availabilityController.get);
router.put('/', availabilityController.upsert);

export default router;
