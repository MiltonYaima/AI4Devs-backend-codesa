import { PrismaClient } from '@prisma/client';
import { Position } from '../../domain/models/Position';

const prisma = new PrismaClient();

export const findPositionById = async (id: number): Promise<Position | null> => {
  try {
    return await Position.findOne(id);
  } catch (error) {
    console.error('Error finding position:', error);
    throw new Error('Error retrieving position');
  }
};

export const getPositionCandidates = async (positionId: number) => {
  try {
    // Check if position exists
    const position = await Position.findOne(positionId);
    if (!position) {
      throw new Error('Position not found');
    }

    // Get all applications for this position with their candidates and interviews
    const applications = await prisma.application.findMany({
      where: {
        positionId: positionId,
      },
      include: {
        candidate: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        interviewStep: {
          select: {
            id: true,
            name: true,
          },
        },
        interviews: {
          select: {
            score: true,
          },
        },
      },
    });

    // Transform the data to match the requirements
    return applications.map((app) => {
      // Calculate average score from interviews
      const scores = app.interviews.map((interview) => interview.score).filter(Boolean) as number[];
      const averageScore = scores.length > 0 
        ? scores.reduce((acc, score) => acc + score, 0) / scores.length 
        : null;

      return {
        candidateId: app.candidate.id,
        fullName: `${app.candidate.firstName} ${app.candidate.lastName}`,
        email: app.candidate.email,
        current_interview_step: app.interviewStep.name,
        average_score: averageScore ? parseFloat(averageScore.toFixed(2)) : null,
      };
    });
  } catch (error) {
    console.error('Error fetching candidates for position:', error);
    throw error;
  }
};

export const updateCandidateStage = async (candidateId: number, stageId: number) => {
  try {
    // Find the application for this candidate
    const application = await prisma.application.findFirst({
      where: {
        candidateId: candidateId,
      },
    });

    if (!application) {
      throw new Error('No application found for this candidate');
    }

    // Check if the new stage exists
    const stageExists = await prisma.interviewStep.findUnique({
      where: {
        id: stageId,
      },
    });

    if (!stageExists) {
      throw new Error('Interview stage not found');
    }

    // Update the application's current interview step
    const updatedApplication = await prisma.application.update({
      where: {
        id: application.id,
      },
      data: {
        currentInterviewStep: stageId,
      },
      include: {
        interviewStep: {
          select: {
            name: true,
          },
        },
      },
    });

    return {
      candidateId,
      currentStage: {
        id: stageId,
        name: updatedApplication.interviewStep.name,
      },
    };
  } catch (error) {
    console.error('Error updating candidate stage:', error);
    throw error;
  }
}; 