import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { LessonFlow } from '../components/curriculum/LessonFlow';
import { getLessonById } from '../data/curriculumRegistry';
import { LESSON2_STEPS } from '../data/lesson2/content';
import { clearLearningLocation, readLearningLocation } from '../utils/learningProgress';

afterEach(() => { cleanup(); clearLearningLocation(); });

describe('Lesson 2 presentation pilot', () => {
  it('keeps the ordered navigation, reports position rather than completion, and saves the selected step', () => {
    clearLearningLocation();
    const { container } = render(<LessonFlow lesson={getLessonById('lesson2')!.lesson} />);
    const rail = container.querySelector('.lesson-navigation-rail') as HTMLElement;
    expect(container.querySelector('.lesson2-pilot')).toBeTruthy();
    expect(within(rail).getAllByRole('button').map(button => button.querySelector('.lesson-step-name')?.textContent)).toEqual(LESSON2_STEPS.map(step => step.title));
    fireEvent.click(within(rail).getByRole('button', { name: /الخطوة 5:/ }));
    expect(readLearningLocation()?.stepId).toBe('l2-s5');
    expect(rail.querySelectorAll('.is-earlier')).toHaveLength(4);
    expect(rail.querySelectorAll('.is-later')).toHaveLength(4);
    expect(rail.querySelectorAll('[aria-current="step"]')).toHaveLength(1);
    expect(rail.textContent).not.toMatch(/مكتمل|منجز/);
    expect(screen.getByRole('button', { name: 'الانتقال إلى الخطوة 6' })).toHaveTextContent(LESSON2_STEPS[5].title);
    const body = container.querySelector('.lesson2-step-renderer')!;
    const sections = Array.from(body.children);
    expect(sections.findIndex(el => el.classList.contains('block-source-sentences'))).toBeLessThan(sections.findIndex(el => el.classList.contains('block-rule')));
    expect(sections.findIndex(el => el.classList.contains('block-rule'))).toBeLessThan(sections.findIndex(el => el.classList.contains('block-explanation')));
  });

  it('does not enable pilot presentation for another lesson', () => {
    clearLearningLocation();
    const { container } = render(<LessonFlow lesson={getLessonById('lesson3')!.lesson} />);
    expect(container.querySelector('.lesson2-pilot')).toBeNull();
    expect(container.querySelector('.lesson-step-order')).toBeNull();
    expect(container.querySelector('.step-content-kicker')).toHaveTextContent('محتوى الخطوة');
  });
});
