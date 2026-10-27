import React from 'react';
import { AssistanceRequest } from '../types';
import { formatPeso, calculatePercentage, getCategoryLabel, getPriorityLabel, getPaymentStatusLabel } from '../utils/formatters';
import { 
  Users, Clock, ArrowUpRight, Heart, FileCheck, Bookmark, BookmarkCheck, 
  AlertCircle, CheckCircle2, ArrowRight 
} from 'lucide-react';

interface RequestCardProps {
  request: AssistanceRequest;
  onSelect: (req: AssistanceRequest) => void;
  onQuickPledge: (req: AssistanceRequest) => void;
  isFollowed: boolean;
  onToggleFollow: (requestId: string) => void;
  onHelpOthersClick: () => void;
}

export const RequestCard: React.FC<RequestCardProps> = ({
  request,
  onSelect,
  onQuickPledge,
  isFollowed,
  onToggleFollow,
  onHelpOthersClick,
}) => {
  const isFullyFunded = request.isFullyFunded || request.raisedAmount >= request.targetAmount;
  const percentage = calculatePercentage(request.raisedAmount, request.targetAmount);

  const getVerificationDisplay = () => {
    switch (request.verificationStatus) {
      case 'barangay_documented':
        return (
          <span className="inline-flex items-center gap-1 text-emerald-800 font-medium">
            <FileCheck className="w-3.5 h-3.5 text-[#14532D]" />
            <span>Barangay Documented</span>
          </span>
        );
      case 'community_endorsed':
        return (
          <span className="inline-flex items-center gap-1 text-stone-700 font-medium">
            <Users className="w-3.5 h-3.5 text-stone-600" />
            <span>Community Endorsed</span>
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Under Review</span>
          </span>
        );
    }
  };

  const getPriorityBadge = () => {
    switch (request.priority) {
      case 'urgent':
        return (
          <span className="text-[11px] font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-sm border border-rose-200">
            Urgent (24-72h)
          </span>
        );
      case 'significant':
        return (
          <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-sm border border-amber-200">
            Significant Need
          </span>
        );
      case 'ongoing':
        return (
          <span className="text-[11px] font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-sm border border-stone-200">
            Ongoing Support
          </span>
        );
    }
  };

  return (
    <div className={`bg-white rounded-xl border transition-all flex flex-col justify-between group shadow-2xs ${
      isFullyFunded ? 'border-emerald-300/80 bg-emerald-50/10' : 'border-stone-200 hover:border-stone-300'
    }`}>
      {/* Optional image thumbnail */}
      {request.imageThumbnail && (
        <div className="relative h-44 w-full bg-stone-100 overflow-hidden border-b border-stone-100">
          <img
            src={request.imageThumbnail}
            alt={request.title}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            {getPriorityBadge()}
            {isFullyFunded && (
              <span className="bg-[#14532D] text-white text-[11px] font-semibold px-2 py-0.5 rounded-sm shadow-xs uppercase tracking-wider">
                Fully Funded
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFollow(request.id);
            }}
            className={`absolute top-3 right-3 p-1.5 rounded-full transition-all cursor-pointer shadow-xs ${
              isFollowed 
                ? 'bg-[#14532D] text-white' 
                : 'bg-white/90 text-stone-700 hover:bg-white hover:text-[#14532D]'
            }`}
            title={isFollowed ? 'Unfollow this request' : 'Follow this request'}
          >
            {isFollowed ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>
      )}

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Header row with Follow button if no image */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-500">
              <span className="font-semibold text-[#14532D]">
                {getCategoryLabel(request.category)}
              </span>
              <span aria-hidden="true">·</span>
              <span>{request.location}</span>
            </div>

            {!request.imageThumbnail && (
              <div className="flex items-center gap-1.5">
                {getPriorityBadge()}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFollow(request.id);
                  }}
                  className={`p-1 rounded-md transition-colors cursor-pointer ${
                    isFollowed ? 'text-[#14532D]' : 'text-stone-400 hover:text-stone-700'
                  }`}
                  title={isFollowed ? 'Following' : 'Follow Request'}
                >
                  {isFollowed ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                </button>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelect(request)}
            className="font-heading text-lg font-bold text-stone-900 hover:text-[#14532D] transition-colors cursor-pointer leading-snug"
          >
            {request.title}
          </h3>

          {/* Beneficiary metadata */}
          <div className="text-xs text-stone-600">
            For <span className="font-semibold text-stone-800">{request.beneficiaryName}</span>
            {request.relation && <span className="text-stone-400"> ({request.relation})</span>}
          </div>

          {/* Story Snippet */}
          <p className="text-sm text-stone-600 line-clamp-2 leading-relaxed">
            {request.story}
          </p>

          {/* Prioritization reasoning callout */}
          <div className="text-[11px] text-stone-500 bg-stone-50/80 p-2 rounded border border-stone-100 flex items-start gap-1.5">
            <span className="font-semibold text-stone-700 shrink-0">Assessed need:</span>
            <span className="line-clamp-1 italic">{request.priorityReason}</span>
          </div>
        </div>

        {/* Verification Status & Progress Meter */}
        <div className="pt-3 border-t border-stone-100 space-y-3">
          <div className="flex items-center justify-between text-xs">
            {getVerificationDisplay()}
            <span className="text-stone-400 font-mono tabular-nums text-[11px]">
              {request.donorsCount} pledges
            </span>
          </div>

          {/* Funding Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between text-xs">
              <span className="font-bold text-stone-900 font-mono tabular-nums">
                {formatPeso(request.raisedAmount)}
              </span>
              <span className="text-stone-500 font-mono tabular-nums">
                of {formatPeso(request.targetAmount)} ({percentage}%)
              </span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isFullyFunded ? 'bg-[#14532D]' : 'bg-[#14532D]'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Funding Limit / Payment Confirmation Status note */}
          {isFullyFunded && (
            <div className="text-[11px] text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 flex items-center justify-between">
              <span className="font-semibold">Goal 100% Reached</span>
              <span className="text-stone-500 text-[10px]">
                {getPaymentStatusLabel(request.paymentConfirmationStatus)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Card Action Buttons */}
      <div className="px-5 py-3.5 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-3">
        <button
          onClick={() => onSelect(request)}
          className="text-xs font-medium text-stone-700 hover:text-[#14532D] transition-colors cursor-pointer inline-flex items-center gap-1"
        >
          <span>View Story & Costs</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>

        {isFullyFunded ? (
          <button
            onClick={onHelpOthersClick}
            className="px-3 py-1.5 text-xs font-semibold text-[#14532D] bg-emerald-100/70 hover:bg-emerald-200/80 rounded-md transition-all cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap"
            title="Goal reached! Direct support to other open requests"
          >
            <span>Help Others Instead</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        ) : (
          <button
            onClick={() => onQuickPledge(request)}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#14532D] hover:bg-[#0F3E22] active:scale-[0.99] rounded-md transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-2xs whitespace-nowrap"
          >
            <Heart className="w-3.5 h-3.5 text-emerald-300" />
            <span>Support</span>
          </button>
        )}
      </div>
    </div>
  );
};
