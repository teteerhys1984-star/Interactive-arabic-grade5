import React from 'react';
import { Lesson } from '../../types/curriculum';
import { LessonShell } from './LessonShell';
import { StepRenderer } from './StepRenderer';

/**
 * LessonFlow — the concrete lesson pipeline: LessonShell → StepRenderer.
 * Keeps the foundation LessonShell generic by injecting the step renderer.
 */
export const LessonFlow: React.FC<{
  lesson: Lesson;
  onOpenTest?: () => void;
  onExit?: () => void;
}> = ({ lesson, onOpenTest, onExit }) => (
  <LessonShell
    lesson={lesson}
    onOpenTest={onOpenTest}
    onExit={onExit}
    renderStepContent={(step) => <StepRenderer step={step} />}
  />
);
