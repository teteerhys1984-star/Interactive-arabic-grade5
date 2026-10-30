import React from 'react';
import { Lesson, Unit } from '../../types/curriculum';
import { LessonShell } from './LessonShell';
import { StepRenderer } from './StepRenderer';

/**
 * LessonFlow — the concrete lesson pipeline: LessonShell → StepRenderer.
 * Navigation context is passed through without duplicating lesson logic here.
 */
export const LessonFlow: React.FC<{
  lesson: Lesson;
  unit?: Unit;
  onOpenTest?: () => void;
  onExit?: () => void;
  onGoHome?: () => void;
  onSelectLesson?: (lessonId: string) => void;
}> = ({ lesson, unit, onOpenTest, onExit, onGoHome, onSelectLesson }) => (
  <LessonShell
    lesson={lesson}
    unit={unit}
    onOpenTest={onOpenTest}
    onExit={onExit}
    onGoHome={onGoHome}
    onSelectLesson={onSelectLesson}
    renderStepContent={(step) => <StepRenderer step={step} />}
  />
);
