import React from 'react';
import { NOT_ASSESSED_LABEL } from '../../content/criteria';
import type { AssessmentCriterion } from '../../types/domain';

interface CriteriaEvaluatorProps {
  criteria: AssessmentCriterion[];
  ratings: Record<string, string>;
  onChange: (criterionId: string, levelLabel: string) => void;
}

export const CriteriaEvaluator: React.FC<CriteriaEvaluatorProps> = ({
  criteria,
  ratings,
  onChange,
}) => {
  if (criteria.length === 0) return null;

  return (
    <div className="space-y-4">
      {criteria.map((criterion) => {
        const selected = ratings[criterion.id] ?? NOT_ASSESSED_LABEL;
        return (
          <div
            key={criterion.id}
            className="rounded-2xl border border-stone-200 bg-white p-3.5 shadow-xs"
          >
            <h4 className="text-sm font-bold text-stone-800">{criterion.title}</h4>
            <div className="mt-2.5 flex flex-col gap-2">
              {criterion.levels.map((level) => {
                const isSelected = selected === level.label;
                return (
                  <button
                    key={level.id}
                    type="button"
                    onClick={() => onChange(criterion.id, level.label)}
                    className={`w-full rounded-xl border p-2.5 text-right transition ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-200'
                        : 'border-stone-200 bg-stone-50/70 hover:bg-stone-100'
                    }`}
                  >
                    <div className="text-sm font-semibold text-stone-800">{level.label}</div>
                    <div className="mt-0.5 text-xs text-stone-500">{level.description}</div>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => onChange(criterion.id, NOT_ASSESSED_LABEL)}
                className={`w-full rounded-xl border px-3 py-2 text-right text-xs font-semibold transition ${
                  selected === NOT_ASSESSED_LABEL
                    ? 'border-stone-500 bg-stone-200 text-stone-900'
                    : 'border-stone-200 bg-white text-stone-500 hover:bg-stone-50'
                }`}
              >
                {NOT_ASSESSED_LABEL}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
