import React, { useState, useMemo } from 'react';
import { AssistanceCategory, AssistanceRequest, NeedPriority, UserProfile, VerificationStatus } from './types';
import { INITIAL_REQUESTS, DEMO_USERS, DEMO_USER } from './data/mockRequests';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { FiltersBar } from './components/FiltersBar';
import { RequestCard } from './components/RequestCard';
import { HelpOthersInsteadSection } from './components/HelpOthersInsteadSection';
import { RequestDetailModal } from './components/RequestDetailModal';
import { AskForHelpView } from './components/AskForHelpView';
import { DashboardView } from './components/DashboardView';
import { ProfileView } from './components/ProfileView';
import { SignInModal } from './components/SignInModal';
import { HeartHandshake, ShieldCheck, CheckCircle2, Heart, Search } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'ask' | 'dashboard' | 'profile'>('home');
  const [requests, setRequests] = useState<AssistanceRequest[]>(INITIAL_REQUESTS);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(DEMO_USER); // defaults to Ramon (Donor)
  const [selectedRequest, setSelectedRequest] = useState<AssistanceRequest | null>(null);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Followed requests state (Donor feature)
  const [followedRequestIds, setFollowedRequestIds] = useState<string[]>(['req-01', 'req-02']);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AssistanceCategory | 'all'>('all');
  const [selectedPriority, setSelectedPriority] = useState<NeedPriority | 'all'>('all');
  const [selectedVerification, setSelectedVerification] = useState<VerificationStatus | 'all'>('all');
  const [onlyUrgent, setOnlyUrgent] = useState(false);
  const [onlyFollowed, setOnlyFollowed] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Follow toggle handler
  const handleToggleFollow = (requestId: string) => {
    setFollowedRequestIds((prev) => {
      const isAlready = prev.includes(requestId);
      const updated = isAlready ? prev.filter((id) => id !== requestId) : [...prev, requestId];
      showToast(isAlready ? 'Unfollowed assistance request.' : 'Following assistance request! Updates will appear in your dashboard.');
      return updated;
    });
  };

  // Filter requests
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      // Category filter
      if (selectedCategory !== 'all' && req.category !== selectedCategory) {
        return false;
      }

      // Priority filter (consequence-based: Urgent / Significant / Ongoing)
      if (selectedPriority !== 'all' && req.priority !== selectedPriority) {
        return false;
      }

      // Verification filter
      if (selectedVerification !== 'all' && req.verificationStatus !== selectedVerification) {
        return false;
      }

      // Urgent filter
      if (onlyUrgent && req.priority !== 'urgent' && !req.isUrgent) {
        return false;
      }

      // Followed filter
      if (onlyFollowed && !followedRequestIds.includes(req.id)) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = req.title.toLowerCase().includes(query);
        const matchName = req.beneficiaryName.toLowerCase().includes(query);
        const matchLocation = req.location.toLowerCase().includes(query);
        const matchBarangay = req.barangay.toLowerCase().includes(query);
        const matchStory = req.story.toLowerCase().includes(query);
        if (!matchTitle && !matchName && !matchLocation && !matchBarangay && !matchStory) {
          return false;
        }
      }

      return true;
    });
  }, [requests, selectedCategory, selectedPriority, selectedVerification, onlyUrgent, onlyFollowed, followedRequestIds, searchQuery]);

  // Overall totals
  const totalPledged = useMemo(() => {
    return requests.reduce((acc, r) => acc + r.raisedAmount, 0);
  }, [requests]);

  // Handle simulated pledge (Enforces funding limit)
  const handlePledgeSubmit = (
    requestId: string,
    amount: number,
    supporterName: string,
    message: string
  ) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          const remainingGoal = Math.max(0, r.targetAmount - r.raisedAmount);
          const finalPledge = Math.min(amount, remainingGoal);
          const newRaised = r.raisedAmount + finalPledge;
          const isNowFullyFunded = newRaised >= r.targetAmount;

          const updatedSupporters = [
            {
              id: `sup-${Date.now()}`,
              name: supporterName,
              amount: finalPledge,
              message,
              timeAgo: 'Just now',
            },
            ...r.recentSupporters,
          ];

          return {
            ...r,
            raisedAmount: newRaised,
            donorsCount: r.donorsCount + 1,
            recentSupporters: updatedSupporters,
            isFullyFunded: isNowFullyFunded,
            status: isNowFullyFunded ? 'completed' : r.status,
          };
        }
        return r;
      })
    );

    // Keep selectedRequest in sync
    setSelectedRequest((prev) => {
      if (prev && prev.id === requestId) {
        const remainingGoal = Math.max(0, prev.targetAmount - prev.raisedAmount);
        const finalPledge = Math.min(amount, remainingGoal);
        const newRaised = prev.raisedAmount + finalPledge;
        const isNowFullyFunded = newRaised >= prev.targetAmount;

        return {
          ...prev,
          raisedAmount: newRaised,
          donorsCount: prev.donorsCount + 1,
          isFullyFunded: isNowFullyFunded,
          status: isNowFullyFunded ? 'completed' : prev.status,
          recentSupporters: [
            {
              id: `sup-${Date.now()}`,
              name: supporterName,
              amount: finalPledge,
              message,
              timeAgo: 'Just now',
            },
            ...prev.recentSupporters,
          ],
        };
      }
      return prev;
    });

    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        pledgedTotal: currentUser.pledgedTotal + amount,
        requestsSupported: currentUser.requestsSupported + 1,
      });
    }

    showToast(`Salamat! Pledging ₱${amount.toLocaleString()} recorded. Goal limits strictly enforced.`);
  };

  // Handle separate payment confirmation
  const handleConfirmPayment = (requestId: string, referenceNote: string) => {
    const today = new Date().toISOString().split('T')[0];
    const details = {
      confirmedBy: currentUser?.name || 'Administrator',
      confirmedAt: today,
      referenceNote,
    };

    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          return {
            ...r,
            paymentConfirmationStatus: 'confirmed_paid',
            paymentConfirmationDetails: details,
          };
        }
        return r;
      })
    );

    setSelectedRequest((prev) => {
      if (prev && prev.id === requestId) {
        return {
          ...prev,
          paymentConfirmationStatus: 'confirmed_paid',
          paymentConfirmationDetails: details,
        };
      }
      return prev;
    });

    showToast('Payment receipt confirmed and recorded separately in audit records.');
  };

  // Handle administrator verification updates
  const handleAdminUpdateVerification = (
    requestId: string,
    status: VerificationStatus,
    note: string
  ) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          return {
            ...r,
            verificationStatus: status,
            verificationDetails: note,
          };
        }
        return r;
      })
    );

    setSelectedRequest((prev) => {
      if (prev && prev.id === requestId) {
        return {
          ...prev,
          verificationStatus: status,
          verificationDetails: note,
        };
      }
      return prev;
    });

    showToast(`Verification status updated to ${status.replace('_', ' ')}.`);
  };

  // Handle new request creation from multi-step form
  const handleCreateRequest = (newRequest: AssistanceRequest) => {
    setRequests([newRequest, ...requests]);
    setCurrentTab('home');
    showToast('Your assistance request was successfully posted after review!');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle adding update to request
  const handleAddUpdateRequest = (requestId: string, updateText: string) => {
    const today = new Date().toISOString().split('T')[0];
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          return {
            ...r,
            updates: [{ date: today, content: updateText }, ...(r.updates || [])],
          };
        }
        return r;
      })
    );
    showToast('Update note successfully shared with supporters.');
  };

  // Help Others Instead redirect action
  const handleHelpOthersRedirect = () => {
    setSelectedPriority('urgent');
    setSearchQuery('');
    setOnlyFollowed(false);
    setCurrentTab('home');
    setTimeout(() => {
      const el = document.getElementById('browse-feed-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
    showToast('Directed to other eligible requests that still urgently need support.');
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-stone-900 flex flex-col antialiased selection:bg-[#14532D] selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#14532D] text-white px-4 py-3 rounded-xl shadow-lg border border-emerald-700/50 flex items-center gap-3 text-xs sm:text-sm animate-fade-in max-w-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        user={currentUser}
        onOpenSignIn={() => setIsSignInOpen(true)}
        onSignOut={() => {
          setCurrentUser(null);
          showToast('Signed out of profile session.');
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {currentTab === 'home' && (
          <div className="space-y-12">
            {/* Forest-Green Hero Banner */}
            <HeroBanner
              onAskHelpClick={() => setCurrentTab('ask')}
              onBrowseUrgentClick={handleHelpOthersRedirect}
              totalPledged={totalPledged}
              totalRequests={requests.length}
            />

            {/* Core Feed Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10" id="browse-feed-section">
              {/* Highlighted "Help Others Instead" Section */}
              <HelpOthersInsteadSection
                requests={requests}
                onSelectRequest={(req) => setSelectedRequest(req)}
                onPledge={(req) => setSelectedRequest(req)}
              />

              {/* Browse & Filter Header */}
              <div className="space-y-6 pt-2">
                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#14532D]">
                    Direktang Tulong sa Kapwa · Consequence Prioritized
                  </span>
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                    Explore Community Assistance Requests
                  </h2>
                  <p className="text-sm text-stone-600">
                    Prioritized by consequence and urgency (time-to-harm) rather than peso size. Strict funding limits apply to all requests.
                  </p>
                </div>

                {/* Filter and Search Bar with Priority & Followed Toggles */}
                <FiltersBar
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  selectedPriority={selectedPriority}
                  setSelectedPriority={setSelectedPriority}
                  selectedVerification={selectedVerification}
                  setSelectedVerification={setSelectedVerification}
                  onlyUrgent={onlyUrgent}
                  setOnlyUrgent={setOnlyUrgent}
                  onlyFollowed={onlyFollowed}
                  setOnlyFollowed={setOnlyFollowed}
                  followedCount={followedRequestIds.length}
                  totalFilteredCount={filteredRequests.length}
                />

                {/* Request Cards Grid */}
                {filteredRequests.length === 0 ? (
                  <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 space-y-3">
                    <Search className="w-8 h-8 text-stone-300 mx-auto" />
                    <h3 className="font-heading text-base font-bold text-stone-800">
                      No matching requests found
                    </h3>
                    <p className="text-xs text-stone-500 max-w-sm mx-auto">
                      Try adjusting your priority criteria, search keywords, or resetting filters to see more requests.
                    </p>
                    <button
                      onClick={() => {
                        setSelectedCategory('all');
                        setSelectedPriority('all');
                        setSelectedVerification('all');
                        setSearchQuery('');
                        setOnlyUrgent(false);
                        setOnlyFollowed(false);
                      }}
                      className="px-4 py-2 text-xs font-semibold text-[#14532D] bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors cursor-pointer"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRequests.map((req) => (
                      <RequestCard
                        key={req.id}
                        request={req}
                        onSelect={(item) => setSelectedRequest(item)}
                        onQuickPledge={(item) => setSelectedRequest(item)}
                        isFollowed={followedRequestIds.includes(req.id)}
                        onToggleFollow={handleToggleFollow}
                        onHelpOthersClick={handleHelpOthersRedirect}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {currentTab === 'ask' && (
          <AskForHelpView
            onSubmit={handleCreateRequest}
            onCancel={() => setCurrentTab('home')}
            currentUser={currentUser}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardView
            requests={requests}
            currentUser={currentUser}
            onNavigateToAsk={() => setCurrentTab('ask')}
            onSelectRequest={(req) => setSelectedRequest(req)}
            onAddUpdateRequest={handleAddUpdateRequest}
            followedRequestIds={followedRequestIds}
            onToggleFollow={handleToggleFollow}
            onAdminUpdateVerification={handleAdminUpdateVerification}
            onConfirmPayment={handleConfirmPayment}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileView
            user={currentUser}
            onOpenSignIn={() => setIsSignInOpen(true)}
          />
        )}
      </main>

      {/* Detail & Pledge Modal */}
      <RequestDetailModal
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onPledgeSubmit={handlePledgeSubmit}
        currentUser={currentUser}
        isFollowed={selectedRequest ? followedRequestIds.includes(selectedRequest.id) : false}
        onToggleFollow={handleToggleFollow}
        onHelpOthersClick={handleHelpOthersRedirect}
        onConfirmPayment={handleConfirmPayment}
      />

      {/* Sign In & Persona Selector Modal */}
      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        onSelectUser={(u) => {
          setCurrentUser(u);
          showToast(`Switched to ${u.name} (${u.role.toUpperCase()} role)`);
        }}
        currentUser={currentUser}
      />

      {/* Footer */}
      <footer className="bg-[#14532D] text-[#FBF9F5] border-t border-[#0F3E22]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-white text-[#14532D] flex items-center justify-center font-bold">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <span className="font-heading text-lg font-bold text-white tracking-tight">
                  Bayanihan Circle
                </span>
              </div>
              <p className="text-xs text-emerald-100/80 leading-relaxed max-w-md">
                Ang diwa ng bayanihan sa makabagong panahon. Isang ligtas at mapagkalingang espasyo para sa mga pamilya at indibidwal sa Pilipinas na nangangailangan ng agarang tulong pinansyal.
              </p>
              <div className="text-[11px] text-emerald-300/70 pt-1">
                Notice: Prototype demonstration. All transactions and profiles are simulated.
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-200 block">
                Pangunahing Kategorya
              </span>
              <ul className="text-xs space-y-1.5 text-emerald-100/90">
                <li>Medical Copays & Maintenance Meds</li>
                <li>Electric & Water Utilities Overdue</li>
                <li>Community Kitchen & Food Relief</li>
                <li>CGI Roof & Monsoon Shelter Repair</li>
                <li>State College Thesis & Lab Fees</li>
              </ul>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-200 block">
                Bayanihan Guiding Ethics
              </span>
              <ul className="text-xs space-y-1.5 text-emerald-100/90">
                <li>100% Direct to Beneficiaries</li>
                <li>No Usury or Predatory Interest</li>
                <li>Itemized Transparency & Funding Limits</li>
                <li>Separate Payment Audit Confirmation</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-emerald-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-200/70">
            <div>
              © 2026 Bayanihan Circle. Dedicated to the mutual aid spirit of Filipino communities.
            </div>
            <div className="flex items-center gap-4">
              <span>May Malasakit, May Pag-asa</span>
              <span>·</span>
              <span>Pilipinas</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
