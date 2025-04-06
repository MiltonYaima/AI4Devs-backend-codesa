import { Router } from 'express';
import { getPositionCandidatesController } from '../presentation/controllers/positionController';
import { updateCandidateStageController } from '../presentation/controllers/positionController';

const router = Router();

// GET /positions/:id/candidates - Get all candidates for a position
router.get('/:id/candidates', getPositionCandidatesController);

export default router; 