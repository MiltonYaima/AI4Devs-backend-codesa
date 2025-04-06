import { Request, Response } from 'express';
import { getPositionCandidates, updateCandidateStage } from '../../application/services/positionService';

export const getPositionCandidatesController = async (req: Request, res: Response) => {
  try {
    const positionId = parseInt(req.params.id);
    
    if (isNaN(positionId)) {
      return res.status(400).json({ error: 'Invalid position ID format' });
    }
    
    const candidates = await getPositionCandidates(positionId);
    res.json(candidates);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Position not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

export const updateCandidateStageController = async (req: Request, res: Response) => {
  try {
    const candidateId = parseInt(req.params.id);
    const { stageId } = req.body;
    
    if (isNaN(candidateId)) {
      return res.status(400).json({ error: 'Invalid candidate ID format' });
    }
    
    if (!stageId || isNaN(parseInt(String(stageId)))) {
      return res.status(400).json({ error: 'Invalid or missing stageId in request body' });
    }
    
    const result = await updateCandidateStage(candidateId, parseInt(String(stageId)));
    res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'No application found for this candidate' || 
          error.message === 'Interview stage not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}; 