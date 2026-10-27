import React, { useState } from 'react';
import { AssistanceRequest, UserProfile } from '../types';
import { 
  formatPeso, calculatePercentage, getCategoryLabel, getPriorityLabel, 
  getPriorityDescription, getPaymentStatusLabel 
} from '../utils/formatters';
import { 
  X, Heart, ShieldCheck, FileCheck, Share2, MessageSquare, Check, 
  AlertCircle, Info, Sparkles, Bookmark, BookmarkCheck, ArrowRight, Receipt, CheckCircle2 
} from 'lucide-react';
import { BayanihanImage } from './BayanihanImage';

interface RequestDetailModalProps {
  request: AssistanceRequest | null;
  onClose: () => void;
  onPledgeSubmit: (requestId: string, amount: number, supporterName: string, message: string) => void;
  currentUser: UserProfile | null;
  isFollowed: boolean;
  onToggleFollow: (requestId: string) => void;
  onHelpOthersClick: () => void;
  onConfirmPayment: (requestId: string, referenceNote: string) => void;
}

export const RequestDetailModal: React.FC<RequestDetailModalProps> = ({
  request,
  onClose,
  onPledgeSubmit,
  currentUser,
  isFollowed,
  onToggleFollow,
  onHelpOthersClick,
  onConfirmPayment,
}) => {
  if (!request) return null;

  const isFullyFunded = request.isFullyFunded || request.raisedAmount >= request.targetAmount;
  const remainingNeeded = Math.max(0, request.targetAmount - request.raisedAmount);
  const percentage = calculatePercentage(request.raisedAmount, request.targetAmount);

  const [pledgeAmount, setPledgeAmount] = useState<number>(Math.min(500, remainingNeeded || 500));
  const [customAmount, setCustomAmount] = useState<string>('');
  const [supporterName, setSupporterName] = useState<string>(currentUser?.name || '');
  const [supporterMessage, setSupporterMessage] = useState<string>('');
  const [pledgeSuccess, setPledgeSuccess] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Payment confirmation form state
  const [showConfirmPaymentModal, setShowConfirmPaymentModal] = useState(false);
  const [paymentReceiptNote, setPaymentReceiptNote] = useState('');

  const presetAmounts = [100, 250, 500, 1000].filter((amt) => amt <= remainingNeeded || remainingNeeded === 0);

  const handlePledge = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFullyFunded) {
      alert('This request is already fully funded. Additional contributions are closed to ensure fair community distribution.');
      return;
    }

    const rawAmount = customAmount ? parseFloat(customAmount) : pledgeAmount;
    if (rawAmount > 0) {
      // Enforce funding limit
      const finalAmount = Math.min(rawAmount, remainingNeeded);
      
      onPledgeSubmit(
        request.id,
        finalAmount,
        supporterName.trim() || 'A Generous Kababayan',
        supporterMessage.trim() || 'Tulong-tulong tayo! Kaya niyo po ito.'
      );
      setPledgeSuccess(true);
      setTimeout(() => {
        setPledgeSuccess(false);
      }, 4000);
      setSupporterMessage('');
      setCustomAmount('');
    }
  };

  const handleCopyShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentReceiptNote.trim()) return;
    onConfirmPayment(request.id, paymentReceiptNote.trim());
    setShowConfirmPaymentModal(false);
    setPaymentReceiptNote('');
  };

  // Determine if current user can confirm payment (Beneficiary of this request, or Admin)
  const canConfirmPayment = 
    currentUser?.role === 'admin' || 
    currentUser?.id === request.authorId || 
    request.authorId === 'usr-danilo';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 my-8 text-stone-900"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Floating Action Controls */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleFollow(request.id)}
            className={`p-2 rounded-full transition-colors cursor-pointer shadow-xs ${
              isFollowed
                ? 'bg-[#14532D] text-white'
                : 'bg-white/90 text-stone-600 hover:bg-stone-100 hover:text-[#14532D]'
            }`}
            title={isFollowed ? 'Following request' : 'Follow request'}
          >
            {isFollowed ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
          </button>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 bg-white/90 hover:bg-stone-100 rounded-full transition-colors cursor-pointer shadow-xs"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Resilient Image Banner with graceful fallback */}
        <div className="relative h-60 w-full bg-stone-100 overflow-hidden">
          <BayanihanImage
            src={request.imageThumbnail}
            alt={request.title}
            category={request.category}
            className="w-full h-full object-cover"
            containerClassName="relative h-60 w-full overflow-hidden"
            fallbackKicker={getCategoryLabel(request.category)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/30 to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-6 right-6 text-white space-y-1 z-10 pointer-events-none">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-emerald-200">
                {getCategoryLabel(request.category)} · {request.location}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-sm bg-white/20 text-white">
                {getPriorityLabel(request.priority)}
              </span>
            </div>
            <h2 className="font-heading text-2xl font-bold text-white text-balance">
              {request.title}
            </h2>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-7">

          {/* Fully Funded Banner & "Help Others Instead" */}
          {isFullyFunded && (
            <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-300 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#14532D] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-heading text-base font-bold text-emerald-950">
                      Request is Fully Funded!
                    </h4>
                    <p className="text-xs text-emerald-800 leading-relaxed mt-0.5">
                      This goal of <strong>{formatPeso(request.targetAmount)}</strong> has been 100% pledged by generous kababayans. Additional pledges are closed to direct aid where it is still urgent.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onHelpOthersClick();
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#14532D] hover:bg-[#0F3E22] rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 shadow-xs inline-flex items-center gap-1.5"
                >
                  <span>Help Others Instead</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Payment Confirmation Disclaimer */}
              <div className="pt-3 border-t border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="text-stone-700">
                  <span className="font-semibold">Payment Settlement Status:</span>{' '}
                  <span className={`font-mono font-medium ${request.paymentConfirmationStatus === 'confirmed_paid' ? 'text-[#14532D]' : 'text-amber-800'}`}>
                    {getPaymentStatusLabel(request.paymentConfirmationStatus)}
                  </span>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Funding limits are reached, but the bill is NOT marked as paid unless payment is separately verified with receipt.
                  </p>
                </div>

                {canConfirmPayment && request.paymentConfirmationStatus === 'pending_confirmation' && (
                  <button
                    type="button"
                    onClick={() => setShowConfirmPaymentModal(true)}
                    className="px-3 py-1.5 text-xs font-medium text-emerald-900 bg-white border border-emerald-300 hover:bg-emerald-100 rounded-md transition-colors cursor-pointer inline-flex items-center gap-1 shrink-0"
                  >
                    <Receipt className="w-3.5 h-3.5 text-[#14532D]" />
                    <span>Confirm Payment / Receipt</span>
                  </button>
                )}
              </div>

              {request.paymentConfirmationDetails && (
                <div className="text-[11px] text-emerald-900 bg-white/70 p-2.5 rounded border border-emerald-200 space-y-0.5">
                  <span className="font-semibold block">Receipt Audit Confirmation:</span>
                  <span>{request.paymentConfirmationDetails.referenceNote} (Confirmed by {request.paymentConfirmationDetails.confirmedBy} on {request.paymentConfirmationDetails.confirmedAt})</span>
                </div>
              )}
            </div>
          )}

          {/* Need-Based Prioritization Details Box */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold uppercase tracking-wider text-stone-700">
                Need-Based Prioritization Assessment
              </span>
              <span className="text-[11px] text-stone-500">
                Evaluation Demonstration
              </span>
            </div>
            <div className="text-xs text-stone-800">
              <strong className="text-[#14532D]">{getPriorityLabel(request.priority)}:</strong>{' '}
              {request.priorityReason || getPriorityDescription(request.priority)}
            </div>
          </div>

          {/* Verification Status Banner */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#14532D]">
              <FileCheck className="w-4 h-4 text-[#14532D]" />
              <span className="uppercase tracking-wider">Verification & Evidence Records</span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed font-medium">
              {request.verificationDetails}
            </p>
            {request.evidenceType && (
              <div className="text-[11px] text-stone-500">
                Attached Proof: <span className="text-stone-800 font-semibold">{request.evidenceType}</span> ({request.evidenceDetails})
              </div>
            )}
          </div>

          {/* Funding Meter */}
          <div className="bg-[#FAF8F5] p-5 rounded-xl border border-stone-200 space-y-3">
            <div className="flex items-baseline justify-between text-sm">
              <div>
                <span className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
                  {formatPeso(request.raisedAmount)}
                </span>
                <span className="text-xs text-stone-500 ml-1">
                  pledged of <span className="font-semibold font-mono tabular-nums">{formatPeso(request.targetAmount)}</span> goal limit
                </span>
              </div>
              <span className="text-sm font-bold text-[#14532D] font-mono tabular-nums">
                {percentage}%
              </span>
            </div>
            <div className="w-full bg-stone-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-[#14532D] h-full rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
              <span>{request.donorsCount} neighbors pledged</span>
              <span>
                {isFullyFunded
                  ? 'Goal completely satisfied'
                  : `Needs ${formatPeso(remainingNeeded)} more to close`}
              </span>
            </div>
          </div>

          {/* The Story & Beneficiary */}
          <div className="space-y-3">
            <h3 className="font-heading text-lg font-bold text-stone-900">
              The Story & Context
            </h3>
            <div className="text-sm text-stone-700 leading-relaxed space-y-3 whitespace-pre-line">
              <p>{request.story}</p>
            </div>
            <div className="text-xs text-stone-500 pt-1">
              Beneficiary: <span className="font-medium text-stone-800">{request.beneficiaryName}</span> (Barangay {request.barangay}, {request.location})
            </div>
          </div>

          {/* Itemized Cost Breakdown */}
          <div className="space-y-3">
            <h3 className="font-heading text-lg font-bold text-stone-900">
              Itemized Cost Breakdown
            </h3>
            <div className="border border-stone-200 rounded-lg overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold">
                  <tr>
                    <th className="py-2.5 px-4">Item or Procedure</th>
                    <th className="py-2.5 px-4 text-right">Estimated Cost (₱)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {request.costBreakdown.map((item, idx) => (
                    <tr key={idx} className="hover:bg-stone-50/50">
                      <td className="py-2.5 px-4 text-stone-800">{item.item}</td>
                      <td className="py-2.5 px-4 text-right font-mono font-medium text-stone-900 tabular-nums">
                        {formatPeso(item.amount)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-stone-50/80 font-bold border-t border-stone-200">
                    <td className="py-2.5 px-4 text-stone-900">Approved Goal Limit</td>
                    <td className="py-2.5 px-4 text-right font-mono text-[#14532D] tabular-nums">
                      {formatPeso(request.targetAmount)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive Pledge Form (Only if NOT fully funded) */}
          {!isFullyFunded ? (
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-lg font-bold text-stone-900">
                    Pledge Mutual Aid Support
                  </h3>
                  <p className="text-xs text-stone-600">
                    Simulate sending direct assistance. Capped at remaining needed amount: {formatPeso(remainingNeeded)}.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyShare}
                  className="text-xs font-medium text-[#14532D] hover:bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Link Copied!' : 'Share Story'}</span>
                </button>
              </div>

              {pledgeSuccess && (
                <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#14532D] shrink-0" />
                  <span>
                    Maraming salamat! Your simulated pledge of{' '}
                    <strong className="font-mono">{formatPeso(pledgeAmount || parseFloat(customAmount) || 0)}</strong> has been recorded and added to the community total.
                  </span>
                </div>
              )}

              <form onSubmit={handlePledge} className="space-y-4">
                {/* Preset Amounts */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-stone-700 block">
                    Select Pledge Amount (₱):
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {presetAmounts.map((amt) => {
                      const isSelected = !customAmount && pledgeAmount === amt;
                      return (
                        <button
                          type="button"
                          key={amt}
                          onClick={() => {
                            setPledgeAmount(amt);
                            setCustomAmount('');
                          }}
                          className={`px-3.5 py-2 text-xs font-mono font-medium rounded-lg border transition-all cursor-pointer tabular-nums ${
                            isSelected
                              ? 'bg-[#14532D] text-white border-[#14532D] shadow-xs'
                              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          {formatPeso(amt)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom amount */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-stone-700 block mb-1">
                      Or Enter Amount (Max {formatPeso(remainingNeeded)}):
                    </label>
                    <input
                      type="number"
                      min="10"
                      max={remainingNeeded}
                      placeholder={`e.g. ${Math.min(300, remainingNeeded)}`}
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full text-xs font-mono py-2 px-3 bg-white border border-stone-200 rounded-lg text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#14532D]/20 focus:border-[#14532D]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-stone-700 block mb-1">
                      Your Name or Alias:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Kuya Carlo / Anonymous"
                      value={supporterName}
                      onChange={(e) => setSupporterName(e.target.value)}
                      className="w-full text-xs py-2 px-3 bg-white border border-stone-200 rounded-lg text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#14532D]/20 focus:border-[#14532D]"
                    />
                  </div>
                </div>

                {/* Words of encouragement */}
                <div>
                  <label className="text-xs font-medium text-stone-700 block mb-1">
                    Words of Encouragement (Mensahe ng Suporta):
                  </label>
                  <input
                    type="text"
                    placeholder="Kaya niyo po 'yan! Tulong-tulong ang mga kababayan."
                    value={supporterMessage}
                    onChange={(e) => setSupporterMessage(e.target.value)}
                    className="w-full text-xs py-2 px-3 bg-white border border-stone-200 rounded-lg text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#14532D]/20 focus:border-[#14532D]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 text-xs font-semibold uppercase tracking-wider text-white bg-[#14532D] hover:bg-[#0F3E22] active:scale-[0.99] rounded-lg transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4 text-emerald-300" />
                  <span>Confirm Simulated Pledge</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-stone-100 border border-stone-200 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-[#14532D] mx-auto" />
              <h4 className="font-heading text-lg font-bold text-stone-900">
                Pledges are Closed for this Goal
              </h4>
              <p className="text-xs text-stone-600 max-w-md mx-auto">
                Thank you! Because of the Bayanihan spirit, 100% of this request's goal has been reached. Please redirect your compassion to other neighbors in need.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onHelpOthersClick();
                }}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-[#14532D] hover:bg-[#0F3E22] rounded-lg transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <span>Help Others Instead</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Payment confirmation modal dialog */}
          {showConfirmPaymentModal && (
            <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-300 space-y-3">
              <h4 className="font-heading text-sm font-bold text-emerald-950 flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-[#14532D]" />
                <span>Separate Payment / Receipt Confirmation</span>
              </h4>
              <p className="text-xs text-emerald-800">
                Confirm that the funds were actually disbursed to the clinic, store, or utility provider with an authentic receipt.
              </p>
              <form onSubmit={handlePaymentSubmit} className="space-y-2.5">
                <input
                  type="text"
                  required
                  placeholder="e.g. Official Pharmacy Receipt OR #91822 verified"
                  value={paymentReceiptNote}
                  onChange={(e) => setPaymentReceiptNote(e.target.value)}
                  className="w-full text-xs py-2 px-3 bg-white border border-emerald-300 rounded-lg text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#14532D]"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowConfirmPaymentModal(false)}
                    className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-[#14532D] hover:bg-[#0F3E22] rounded-md cursor-pointer"
                  >
                    Confirm & Record Payment
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Recent Supporters */}
          <div className="space-y-3">
            <h3 className="font-heading text-lg font-bold text-stone-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#14532D]" />
              <span>Community Encouragement & Pledges ({request.recentSupporters.length})</span>
            </h3>

            {request.recentSupporters.length === 0 ? (
              <p className="text-xs text-stone-500 italic">
                Be the first neighbor to send a message of encouragement and support!
              </p>
            ) : (
              <div className="space-y-2.5">
                {request.recentSupporters.map((supporter) => (
                  <div
                    key={supporter.id}
                    className="p-3.5 rounded-lg bg-stone-50 border border-stone-200/80 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-stone-800">{supporter.name}</span>
                        <span className="text-stone-400">·</span>
                        <span className="text-stone-400 font-mono text-[11px]">{supporter.timeAgo}</span>
                      </div>
                      {supporter.message && (
                        <p className="text-stone-600 italic">"{supporter.message}"</p>
                      )}
                    </div>
                    <span className="font-mono font-bold text-[#14532D] tabular-nums shrink-0">
                      {formatPeso(supporter.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal footer */}
        <div className="px-6 py-4 bg-stone-100 border-t border-stone-200 flex justify-between items-center">
          <button
            type="button"
            onClick={() => onToggleFollow(request.id)}
            className={`text-xs font-medium cursor-pointer inline-flex items-center gap-1.5 ${
              isFollowed ? 'text-[#14532D] font-semibold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {isFollowed ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            <span>{isFollowed ? 'Following in Dashboard' : 'Follow this Request'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 rounded-md cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
