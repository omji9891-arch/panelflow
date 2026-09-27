/**
 * Event Types Routes
 *
 * Thin route definitions — all logic lives in the controller/service layers.
 * Protected by adminAuth middleware (applied at mount point in index.ts).
 */
import { Router } from 'express';
import { eventTypesController } from '../controllers/eventTypes.controller';

const router = Router();

router.get('/', eventTypesController.getAll);
router.post('/', eventTypesController.create);
router.put('/:id', eventTypesController.update);
router.delete('/:id', eventTypesController.remove);

export default router;
