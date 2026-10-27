import React, { useState } from 'react';
import { AssistanceRequest, UserProfile, VerificationStatus } from '../types';
import { 
  formatPeso, calculatePercentage, getCategoryLabel, getPriorityLabel, 
  getPaymentStatusLabel 
} from '../utils/formatters';
import { 
  HeartHandshake, PlusCircle, MessageSquarePlus, CheckCircle2, Clock, 
  Heart, ArrowUpRight, ShieldCheck, BookmarkCheck, FileCheck, Receipt, AlertCircle, Users 
} from 'lucide-react';

interface DashboardViewProps {
  requests: AssistanceRequest[];
  currentUser: UserProfile | null;
  onNavigateToAsk: () => void;
  onSelectRequest: (req: AssistanceRequest) => void;
  onAddUpdateRequest: (requestId: string, updateText: string) => void;
  followedRequestIds: string[];
  onToggleFollow: (requestId: string) => void;
  onAdminUpdateVerification: (requestId: string, status: VerificationStatus, note: string) => void;
  onConfirmPayment: (requestId: string, referenceNote: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  requests,
  currentUser,
  onNavigateToAsk,
  onSelectRequest,
  onAddUpdateRequest,
  followedRequestIds,
  onToggleFollow,
  onAdminUpdateVerification,
  onConfirmPayment,
}) => {
  // Determine default tab based on user role
  const defaultTab = 
    currentUser?.role === 'admin' 
      ? 'admin_queue' 
      : currentUser?.role === 'beneficiary' 
      ? 'my_requests' 
      : 'my_pledges';

  const [activeTab, setActiveTab] = useState<'my_requests' | 'my_pledges' | 'followed' | 'admin_queue'>(defaultTab);
  const [selectedRequestIdForUpdate, setSelectedRequestIdForUpdate] = useState<string | null>(null);
  const [updateText, setUpdateText] = useState('');
  const [paymentConfirmId, setPaymentConfirmId] = useState<string | null>(null);
  const [receiptNote, setReceiptNote] = useState('');

  // Requests created by this user
  const myCreatedRequests = requests.filter(
    (r) => r.authorId === currentUser?.id || (currentUser?.role === 'beneficiary' && r.id === 'req-02')
  );

  // Requests user has pledged to
  const myPledgedRequests = requests.filter((r) =>
    r.recentSupporters.some(
      (s) => s.name === currentUser?.name || s.name === 'Ramon Garcia' || s.name === 'Maria Elena Santos'
    )
  );

  // Requests user is following
  const followedRequests = requests.filter((r) => followedRequestIds.includes(r.id));

  // Pending verification queue for admin
  const pendingReviewRequests = requests.filter((r) => r.verificationStatus === 'under_review');

  const totalUserPledged = requests.reduce((acc, req) => {
    const userDonations = req.recentSupporters
      .filter((s) => s.name === currentUser?.name || (currentUser?.role === 'donor' && s.name === 'Ramon Garcia'))
      .reduce((sAcc, s) => sAcc + s.amount, 0);
    return acc + userDonations;
  }, 0);

  const handlePostUpdate = (requestId: string) => {
    if (!updateText.trim()) return;
    onAddUpdateRequest(requestId, updateText.trim());
    setUpdateText('');
    setSelectedRequestIdForUpdate(null);
  };

  const handleConfirmPaymentSubmit = (requestId: string) => {
    if (!receiptNote.trim()) return;
    onConfirmPayment(requestId, receiptNote.trim());
    setPaymentConfirmId(null);
    setReceiptNote('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner with Stats & Role context */}
      <div className="bg-[#14532D] text-[#FBF9F5] rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-200">
                {currentUser?.role === 'beneficiary'
                  ? 'Beneficiary Assistance Portal'
                  : currentUser?.role === 'admin'
                  ? 'Barangay Community Administrator Hub'
                  : 'Donor Mutual Aid Dashboard'}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-white/20 uppercase tracking-wider">
                {currentUser?.role || 'Guest'} Role
              </span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
              {currentUser ? `Kamusta, ${currentUser.name}` : 'My Bayanihan Dashboard'}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl leading-relaxed">
              {currentUser?.role === 'beneficiary'
                ? 'Review your submitted requests, track funding limits and review statuses, publish progress updates, and register official payment receipts.'
                : currentUser?.role === 'admin'
                ? 'Review incoming community requests, validate verification evidence, confirm payment settlements, and audit transparent funds.'
                : 'Browse and track the assistance requests you have pledged to or followed, and monitor updates directly from beneficiaries.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onNavigateToAsk}
              className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#14532D] bg-[#FBF9F5] hover:bg-[#F3EFE6] rounded-lg transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5 shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Ask for Help</span>
            </button>
          </div>
        </div>

        {/* Dashboard Metric Cards */}
        <div className="mt-8 pt-6 border-t border-emerald-800/70 grid grid-cols-2 sm:grid-cols-4 gap-4 text-emerald-100">
          <div>
            <span className="text-xs text-emerald-200/80 block">My Submitted Requests</span>
            <span className="text-2xl font-bold font-mono text-white tabular-nums">
              {myCreatedRequests.length}
            </span>
          </div>
          <div>
            <span className="text-xs text-emerald-200/80 block">Followed Requests</span>
            <span className="text-2xl font-bold font-mono text-white tabular-nums">
              {followedRequestIds.length}
            </span>
          </div>
          <div>
            <span className="text-xs text-emerald-200/80 block">Simulated Pledges Given</span>
            <span className="text-2xl font-bold font-mono text-white tabular-nums">
              {formatPeso(totalUserPledged || currentUser?.pledgedTotal || 1500)}
            </span>
          </div>
          <div>
            <span className="text-xs text-emerald-200/80 block">Community Trust Level</span>
            <span className="text-2xl font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-5 h-5 text-emerald-300" />
              <span className="text-base font-semibold">Active Member</span>
            </span>
          </div>
        </div>
      </div>

      {/* Segmented Tab Controls */}
      <div className="flex border-b border-stone-200 gap-4 sm:gap-6 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('my_requests')}
          className={`pb-3 text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap relative ${
            activeTab === 'my_requests'
              ? 'text-[#14532D]'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <span>My Submitted Requests ({myCreatedRequests.length})</span>
          {activeTab === 'my_requests' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#14532D]" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('followed')}
          className={`pb-3 text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap relative ${
            activeTab === 'followed'
              ? 'text-[#14532D]'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <span>Followed Requests ({followedRequests.length})</span>
          {activeTab === 'followed' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#14532D]" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('my_pledges')}
          className={`pb-3 text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap relative ${
            activeTab === 'my_pledges'
              ? 'text-[#14532D]'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <span>Pledges I Made ({myPledgedRequests.length})</span>
          {activeTab === 'my_pledges' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#14532D]" />
          )}
        </button>

        {currentUser?.role === 'admin' && (
          <button
            onClick={() => setActiveTab('admin_queue')}
            className={`pb-3 text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap relative ${
              activeTab === 'admin_queue'
                ? 'text-[#14532D]'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <span>Admin Review Queue ({pendingReviewRequests.length})</span>
            {activeTab === 'admin_queue' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#14532D]" />
            )}
          </button>
        )}
      </div>

      {/* TAB 1: My Submitted Requests (Beneficiary view) */}
      {activeTab === 'my_requests' && (
        <div className="space-y-4">
          {myCreatedRequests.length === 0 ? (
            <div className="p-8 text-center bg-white border border-stone-200 rounded-xl space-y-3">
              <p className="text-sm text-stone-500">
                You do not have any submitted requests yet.
              </p>
              <button
                onClick={onNavigateToAsk}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#14532D] rounded-md cursor-pointer"
              >
                Submit an Assistance Request
              </button>
            </div>
          ) : (
            myCreatedRequests.map((req) => {
              const pct = calculatePercentage(req.raisedAmount, req.targetAmount);
              const isFunded = req.isFullyFunded || req.raisedAmount >= req.targetAmount;

              return (
                <div
                  key={req.id}
                  className="bg-white rounded-xl border border-stone-200 p-6 space-y-5 shadow-2xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
                        <span className="font-semibold text-[#14532D]">
                          {getCategoryLabel(req.category)}
                        </span>
                        <span>·</span>
                        <span>{req.location}</span>
                        <span>·</span>
                        <span className="text-stone-400 font-mono text-[11px]">Posted {req.createdAt}</span>
                        <span>·</span>
                        <span className="font-medium text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
                          {getPriorityLabel(req.priority)}
                        </span>
                      </div>

                      <h3
                        onClick={() => onSelectRequest(req)}
                        className="font-heading text-lg font-bold text-stone-900 hover:text-[#14532D] cursor-pointer transition-colors"
                      >
                        {req.title}
                      </h3>

                      <p className="text-xs text-stone-600 line-clamp-2">
                        {req.story}
                      </p>

                      {/* Review Status & Evidence Notice */}
                      <div className="text-xs flex flex-wrap items-center gap-2 pt-1">
                        <span className="font-semibold text-stone-700">Review Status:</span>
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          req.verificationStatus === 'barangay_documented'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : req.verificationStatus === 'community_endorsed'
                            ? 'bg-stone-100 text-stone-800 border border-stone-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {req.verificationStatus === 'barangay_documented' && '✓ Barangay Documented'}
                          {req.verificationStatus === 'community_endorsed' && '🤝 Community Endorsed'}
                          {req.verificationStatus === 'under_review' && '⏳ Awaiting Community Admin Review'}
                        </span>
                        <span className="text-stone-500 text-[11px]">({req.verificationDetails})</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        onClick={() => setSelectedRequestIdForUpdate(selectedRequestIdForUpdate === req.id ? null : req.id)}
                        className="px-3 py-1.5 text-xs font-medium text-[#14532D] bg-emerald-50 hover:bg-emerald-100 rounded-md border border-emerald-200 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <MessageSquarePlus className="w-3.5 h-3.5" />
                        <span>Post Update</span>
                      </button>

                      {isFunded && req.paymentConfirmationStatus === 'pending_confirmation' && (
                        <button
                          onClick={() => setPaymentConfirmId(paymentConfirmId === req.id ? null : req.id)}
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-[#14532D] hover:bg-[#0F3E22] rounded-md transition-colors cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span>Confirm Payment</span>
                        </button>
                      )}

                      <button
                        onClick={() => onSelectRequest(req)}
                        className="px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors cursor-pointer"
                      >
                        View Page
                      </button>
                    </div>
                  </div>

                  {/* Progress bar & funding limits */}
                  <div className="space-y-1.5">
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="font-bold font-mono text-stone-900 tabular-nums">
                        {formatPeso(req.raisedAmount)} raised of {formatPeso(req.targetAmount)} approved goal
                      </span>
                      <span className="font-mono font-bold text-[#14532D] tabular-nums">
                        {pct}% {isFunded && '(Goal Limit Reached)'}
                      </span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-[#14532D] h-full rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                      <span>{req.donorsCount} neighbors pledged</span>
                      <span>
                        Payment Settlement:{' '}
                        <strong className={req.paymentConfirmationStatus === 'confirmed_paid' ? 'text-[#14532D]' : 'text-amber-800'}>
                          {getPaymentStatusLabel(req.paymentConfirmationStatus)}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* Confirm Payment Sub-form for Beneficiary */}
                  {paymentConfirmId === req.id && (
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 space-y-2 animate-fade-in text-xs">
                      <h4 className="font-bold text-emerald-950 flex items-center gap-1">
                        <Receipt className="w-4 h-4 text-[#14532D]" />
                        <span>Confirm Receipt of Payment / Disbursement</span>
                      </h4>
                      <p className="text-emerald-800">
                        Per Bayanihan Circle guidelines, reaching the goal limit does not mark the bill as paid until separate confirmation with receipt details is registered.
                      </p>
                      <input
                        type="text"
                        placeholder="e.g. Official Receipt #8892 from South Star Drug / Meralco Teller confirmed"
                        value={receiptNote}
                        onChange={(e) => setReceiptNote(e.target.value)}
                        className="w-full p-2 bg-white border border-emerald-300 rounded-lg text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#14532D]"
                      />
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          onClick={() => setPaymentConfirmId(null)}
                          className="px-3 py-1.5 text-stone-600 hover:text-stone-900 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleConfirmPaymentSubmit(req.id)}
                          className="px-4 py-1.5 font-semibold text-white bg-[#14532D] hover:bg-[#0F3E22] rounded-md cursor-pointer"
                        >
                          Confirm & Save Receipt
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Updates list */}
                  {req.updates && req.updates.length > 0 && (
                    <div className="pt-3 border-t border-stone-100 space-y-2">
                      <span className="text-xs font-semibold text-stone-800 block">
                        Recent Updates from Beneficiary:
                      </span>
                      {req.updates.map((up, idx) => (
                        <div key={idx} className="p-3 bg-stone-50 rounded-lg text-xs text-stone-700 space-y-0.5">
                          <span className="text-[11px] font-mono text-stone-400 block">{up.date}</span>
                          <p>{up.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Update Box */}
                  {selectedRequestIdForUpdate === req.id && (
                    <div className="pt-3 border-t border-emerald-100 bg-emerald-50/50 p-4 rounded-xl space-y-2">
                      <label className="text-xs font-semibold text-emerald-950 block">
                        Share a progress note or thank you with supporters:
                      </label>
                      <textarea
                        rows={2}
                        value={updateText}
                        onChange={(e) => setUpdateText(e.target.value)}
                        placeholder="e.g. Parts purchased and tricycle mechanic finished repairs today. Maraming salamat po sa lahat ng nag-ambag!"
                        className="w-full text-xs p-2.5 bg-white border border-stone-200 rounded-lg text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#14532D]/20 focus:border-[#14532D]"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setSelectedRequestIdForUpdate(null)}
                          className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handlePostUpdate(req.id)}
                          className="px-4 py-1.5 text-xs font-semibold text-white bg-[#14532D] hover:bg-[#0F3E22] rounded-md cursor-pointer"
                        >
                          Publish Update
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: Followed Requests (Donor experience) */}
      {activeTab === 'followed' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-stone-100/70 border border-stone-200/80 text-xs text-stone-700 flex items-center justify-between">
            <span>
              <strong>Donor Follow List:</strong> Requests you have bookmarked to monitor progress and receive transparent updates.
            </span>
            <span className="font-mono font-semibold text-stone-900 tabular-nums">
              {followedRequests.length} followed
            </span>
          </div>

          {followedRequests.length === 0 ? (
            <div className="p-8 text-center bg-white border border-stone-200 rounded-xl space-y-3">
              <BookmarkCheck className="w-8 h-8 text-stone-300 mx-auto" />
              <p className="text-sm text-stone-600 font-medium">
                You haven't followed any assistance requests yet.
              </p>
              <p className="text-xs text-stone-400">
                Browse requests on the Home feed and click the bookmark icon to follow them!
              </p>
            </div>
          ) : (
            followedRequests.map((req) => {
              const pct = calculatePercentage(req.raisedAmount, req.targetAmount);
              return (
                <div
                  key={req.id}
                  className="bg-white rounded-xl border border-stone-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs hover:border-stone-300 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      <span className="font-semibold text-[#14532D]">
                        {getCategoryLabel(req.category)}
                      </span>
                      <span>·</span>
                      <span>{req.location}</span>
                      <span>·</span>
                      <span className="font-medium text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
                        {getPriorityLabel(req.priority)}
                      </span>
                    </div>
                    <h4
                      onClick={() => onSelectRequest(req)}
                      className="font-heading text-base font-bold text-stone-900 hover:text-[#14532D] cursor-pointer transition-colors"
                    >
                      {req.title}
                    </h4>
                    <div className="text-xs text-stone-600 font-mono tabular-nums">
                      {formatPeso(req.raisedAmount)} / {formatPeso(req.targetAmount)} ({pct}%)
                      {req.isFullyFunded && ' · Fully Funded'}
                    </div>
                    {req.updates && req.updates.length > 0 && (
                      <p className="text-[11px] text-[#14532D] italic">
                        Latest update: "{req.updates[0].content}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onToggleFollow(req.id)}
                      className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors cursor-pointer"
                    >
                      Unfollow
                    </button>
                    <button
                      onClick={() => onSelectRequest(req)}
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-[#14532D] hover:bg-[#0F3E22] rounded-md transition-colors cursor-pointer"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 3: Pledges Made (Donor experience) */}
      {activeTab === 'my_pledges' && (
        <div className="space-y-4">
          {myPledgedRequests.length === 0 ? (
            <div className="p-8 text-center bg-white border border-stone-200 rounded-xl space-y-3">
              <p className="text-sm text-stone-500">
                You have not pledged to any requests yet in this session.
              </p>
              <p className="text-xs text-stone-400">
                Browse requests on the Home feed to simulate sending mutual aid support!
              </p>
            </div>
          ) : (
            myPledgedRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-xl border border-stone-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <span className="font-semibold text-[#14532D]">
                      {getCategoryLabel(req.category)}
                    </span>
                    <span>·</span>
                    <span>For {req.beneficiaryName}</span>
                  </div>
                  <h4 
                    onClick={() => onSelectRequest(req)}
                    className="font-heading text-base font-bold text-stone-900 hover:text-[#14532D] cursor-pointer transition-colors"
                  >
                    {req.title}
                  </h4>
                  <div className="text-xs text-stone-500 font-mono tabular-nums">
                    Total Campaign: {formatPeso(req.raisedAmount)} / {formatPeso(req.targetAmount)} ({calculatePercentage(req.raisedAmount, req.targetAmount)}%)
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-emerald-800 font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    Pledge Active
                  </span>
                  <button
                    onClick={() => onSelectRequest(req)}
                    className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                    title="View Request"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 4: Admin Review Queue (Community Administrator experience) */}
      {activeTab === 'admin_queue' && currentUser?.role === 'admin' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#14532D] shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Community Administrator Queue (Barangay Level)</strong>
              Review pending documentation evidence submitted by neighbors before endorsing to the public circle.
            </div>
          </div>

          {pendingReviewRequests.length === 0 ? (
            <div className="p-8 text-center bg-white border border-stone-200 rounded-xl space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#14532D] mx-auto" />
              <p className="text-sm font-bold text-stone-800">
                All requests have been reviewed!
              </p>
              <p className="text-xs text-stone-500">
                No requests currently in "Under Review" status.
              </p>
            </div>
          ) : (
            pendingReviewRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-xl border border-amber-200 p-5 space-y-4 shadow-2xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      <span className="font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                        Under Review
                      </span>
                      <span>·</span>
                      <span>{getCategoryLabel(req.category)}</span>
                      <span>·</span>
                      <span>{req.location}</span>
                    </div>
                    <h4 className="font-heading text-base font-bold text-stone-900 mt-1">
                      {req.title}
                    </h4>
                    <p className="text-xs text-stone-600 line-clamp-2 mt-0.5">
                      {req.story}
                    </p>
                  </div>
                  <div className="font-mono font-bold text-[#14532D] text-base shrink-0">
                    {formatPeso(req.targetAmount)}
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-lg text-xs space-y-1">
                  <span className="font-semibold text-stone-700">Submitted Evidence:</span>
                  <p className="text-stone-800 font-medium">{req.verificationDetails}</p>
                  {req.evidenceType && (
                    <span className="text-stone-500 text-[11px] block">
                      Attachment reference: {req.evidenceType} ({req.evidenceDetails})
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                  <button
                    onClick={() => onAdminUpdateVerification(req.id, 'community_endorsed', 'Endorsed by Barangay Community Circle')}
                    className="px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md cursor-pointer transition-colors"
                  >
                    Endorse as Community
                  </button>
                  <button
                    onClick={() => onAdminUpdateVerification(req.id, 'barangay_documented', 'Barangay Indigency Document Verified by Admin')}
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#14532D] hover:bg-[#0F3E22] rounded-md cursor-pointer transition-colors shadow-2xs"
                  >
                    Approve as Barangay Documented
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
