import React from 'react';
import { AssistanceRequest } from '../types';
import { formatPeso, calculatePercentage, getCategoryLabel } from '../utils/formatters';
import { Heart, ArrowRight, ShieldAlert, Sparkles, Clock, CheckCircle2 } from 'lucide-react';

interface HelpOthersInsteadSectionProps {
  requests: AssistanceRequest[];
  onSelectRequest: (req: AssistanceRequest) => void;
  onPledge: (req: AssistanceRequest) => void;
}

export const HelpOthersInsteadSection: React.FC<HelpOthersInsteadSectionProps> = ({
  requests,
  onSelectRequest,
  onPledge,
}) => {
  // Filter requests that still urgently need support (e.g. <40% funded or isUrgent)
  const lowFundedRequests = requests
    .filter((r) => calculatePercentage(r.raisedAmount, r.targetAmount) < 50 || r.isUrgent)
    .sort((a, b) => {
      const aPct = calculatePercentage(a.raisedAmount, a.targetAmount);
      const bPct = calculatePercentage(b.raisedAmount, b.targetAmount);
      return aPct - bPct;
    })
    .slice(0, 3);

  if (lowFundedRequests.length === 0) return null;

  return (
    <section className="bg-[#F4F1EA] rounded-2xl p-6 sm:p-8 border border-stone-300/80 shadow-2xs">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#14532D]">
            <Heart className="w-3.5 h-3.5 fill-[#14532D]" />
            <span>Balanseng Bayanihan · Leave No One Behind</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Help Others Instead
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            In our community circle, we give special attention to neighbors whose requests have received fewer pledges or face pressing deadlines. Your modest pledge here has immediate, transformative impact.
          </p>
        </div>

        <div className="text-xs text-stone-500 bg-white/70 px-3.5 py-2 rounded-lg border border-stone-200/80 shrink-0">
          Showing <span className="font-bold text-stone-800 tabular-nums">{lowFundedRequests.length}</span> urgent requests needing boost
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {lowFundedRequests.map((req) => {
          const pct = calculatePercentage(req.raisedAmount, req.targetAmount);
          const remainingAmount = req.targetAmount - req.raisedAmount;

          return (
            <div
              key={req.id}
              className="bg-white rounded-xl border border-stone-200 p-5 flex flex-col justify-between hover:border-[#14532D]/40 transition-all shadow-xs group"
            >
              <div className="space-y-3">
                {/* Zero-pill metadata */}
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span className="font-medium text-[#14532D]">
                    {getCategoryLabel(req.category)}
                  </span>
                  {req.urgentDeadlineDays && (
                    <span className="text-amber-800 font-medium">
                      {req.urgentDeadlineDays} days left
                    </span>
                  )}
                </div>

                <h4 
                  onClick={() => onSelectRequest(req)}
                  className="font-heading text-base font-bold text-stone-900 hover:text-[#14532D] cursor-pointer transition-colors line-clamp-2"
                >
                  {req.title}
                </h4>

                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {req.story}
                </p>

                {/* Remaining amount callout */}
                <div className="text-xs text-stone-700 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                  <span className="text-stone-500">Still needs: </span>
                  <span className="font-bold font-mono text-stone-900 tabular-nums">
                    {formatPeso(remainingAmount)}
                  </span>
                  <span className="text-stone-400"> to reach goal</span>
                </div>
              </div>

              {/* Progress and actions */}
              <div className="pt-4 mt-4 border-t border-stone-100 space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono tabular-nums">
                    <span className="text-stone-600">{formatPeso(req.raisedAmount)}</span>
                    <span className="font-bold text-stone-900">{pct}%</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-amber-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => onPledge(req)}
                    className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-[#14532D] hover:bg-[#0F3E22] rounded-md transition-all cursor-pointer text-center"
                  >
                    Pledge Now
                  </button>
                  <button
                    onClick={() => onSelectRequest(req)}
                    className="py-2 px-2.5 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors cursor-pointer"
                    title="View Full Story"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
