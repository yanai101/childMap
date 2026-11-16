import { describe, expect, it } from 'vitest';
import { STORY_SEQUENCES } from '../content/storyHouse';
import { evaluateSequenceOrder } from '../services/sequencingLogic';

describe('Story sequencing logic', () => {
  it('validates Level A (3-picture) expected order vs shuffled order', () => {
    const levelA = STORY_SEQUENCES.sequencing_a;
    expect(evaluateSequenceOrder(levelA.expectedOrder, levelA.expectedOrder)).toBe(true);
    expect(evaluateSequenceOrder(levelA.initialShuffledOrder, levelA.expectedOrder)).toBe(false);
    expect(evaluateSequenceOrder(['seq-a-1', 'seq-a-2'], levelA.expectedOrder)).toBe(false);
  });

  it('validates Level B (4-picture) expected order vs shuffled order', () => {
    const levelB = STORY_SEQUENCES.sequencing_b;
    expect(evaluateSequenceOrder(levelB.expectedOrder, levelB.expectedOrder)).toBe(true);
    expect(evaluateSequenceOrder(levelB.initialShuffledOrder, levelB.expectedOrder)).toBe(false);
  });
});
