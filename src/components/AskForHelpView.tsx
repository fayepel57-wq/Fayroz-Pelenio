import React, { useState } from 'react';
import { AssistanceCategory, AssistanceRequest, CostItem, NeedPriority, UserProfile } from '../types';
import { formatPeso, getCategoryLabel, getPriorityLabel, getPriorityDescription } from '../utils/formatters';
import { 
  HeartHandshake, Plus, Trash2, ShieldAlert, CheckCircle, Info, UploadCloud, 
  ArrowRight, ArrowLeft, FileText, AlertTriangle, Check, Eye, HelpCircle
} from 'lucide-react';

interface AskForHelpViewProps {
  onSubmit: (newRequest: AssistanceRequest) => void;
  onCancel: () => void;
  currentUser: UserProfile | null;
}

export const AskForHelpView: React.FC<AskForHelpViewProps> = ({
  onSubmit,
  onCancel,
  currentUser,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Type of need & basic details
  const [category, setCategory] = useState<AssistanceCategory>('medical');
  const [beneficiaryName, setBeneficiaryName] = useState(currentUser?.name || '');
  const [beneficiaryAge, setBeneficiaryAge] = useState<string>('');
  const [relation, setRelation] = useState('Self');
  const [location, setLocation] = useState('Quezon City, Metro Manila');
  const [barangay, setBarangay] = useState('Barangay Batasan Hills');

  // Step 2: Explanation & Urgency
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [consequenceIfDelayed, setConsequenceIfDelayed] = useState('');
  const [urgentDeadlineDays, setUrgentDeadlineDays] = useState('3');
  const [priority, setPriority] = useState<NeedPriority>('urgent');

  // Step 3: Requested amount & cost items
  const [costItems, setCostItems] = useState<CostItem[]>([
    { item: 'Essential maintenance medicines copay', amount: 3200 },
    { item: 'Clinical checkup & doctor lab assessment', amount: 1800 },
  ]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');

  // Step 4: Supporting evidence placeholder
  const [evidenceType, setEvidenceType] = useState('Barangay Indigency Clearance');
  const [evidenceDetails, setEvidenceDetails] = useState('Barangay Indigency Certificate #2026-QC-119');
  const [evidenceFileMock, setEvidenceFileMock] = useState<string | null>('brgy_indigency_clearance_scan.pdf');

  const totalCalculated = costItems.reduce((acc, item) => acc + item.amount, 0);

  const handleAddCostItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName.trim() && parseFloat(newItemAmount) > 0) {
      setCostItems([
        ...costItems,
        { item: newItemName.trim(), amount: parseFloat(newItemAmount) },
      ]);
      setNewItemName('');
      setNewItemAmount('');
    }
  };

  const handleRemoveCostItem = (index: number) => {
    if (costItems.length <= 1) {
      alert('Please keep at least one cost item for transparency.');
      return;
    }
    setCostItems(costItems.filter((_, i) => i !== index));
  };

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      if (!beneficiaryName.trim() || !location.trim() || !barangay.trim()) {
        alert('Please fill out all required personal and location details.');
        return false;
      }
    }
    if (step === 2) {
      if (!title.trim() || !story.trim() || !consequenceIfDelayed.trim()) {
        alert('Please provide the headline, explanation, and consequence if delayed.');
        return false;
      }
    }
    if (step === 3) {
      if (totalCalculated <= 0) {
        alert('Please add at least one itemized cost breakdown.');
        return false;
      }
    }
    return true;
  };

  const goToNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(5, prev + 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPrevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalSubmit = () => {
    const newReq: AssistanceRequest = {
      id: `req-${Date.now()}`,
      title: title.trim(),
      story: `${story.trim()}\n\nConsequence if unassisted: ${consequenceIfDelayed.trim()}`,
      beneficiaryName: beneficiaryName.trim(),
      beneficiaryAge: beneficiaryAge ? parseInt(beneficiaryAge) : undefined,
      relation: relation.trim(),
      category,
      targetAmount: totalCalculated,
      raisedAmount: 0,
      donorsCount: 0,
      location: location.trim(),
      barangay: barangay.trim(),
      verificationStatus: 'under_review',
      verificationDetails: `${evidenceType}: ${evidenceDetails} (Submitted for Community Administrator Review)`,
      priority,
      priorityReason: consequenceIfDelayed.trim() || getPriorityDescription(priority),
      costBreakdown: costItems,
      urgentDeadlineDays: parseInt(urgentDeadlineDays) || 3,
      isUrgent: priority === 'urgent',
      recentSupporters: [],
      createdAt: new Date().toISOString().split('T')[0],
      authorId: currentUser?.id || 'usr-danilo',
      status: 'active',
      isFullyFunded: false,
      paymentConfirmationStatus: 'pending_confirmation',
      evidenceType,
      evidenceDetails,
    };

    onSubmit(newReq);
  };

  const stepsList = [
    { num: 1, label: 'Need & Person' },
    { num: 2, label: 'Story & Urgency' },
    { num: 3, label: 'Itemized Costs' },
    { num: 4, label: 'Evidence' },
    { num: 5, label: 'Review & Post' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        {/* Banner */}
        <div className="bg-[#14532D] text-[#FBF9F5] p-6 sm:p-8">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-emerald-200 mb-1.5">
            <HeartHandshake className="w-4 h-4 text-emerald-300" />
            <span>Multi-Step Assistance Request</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Ask for Help from Bayanihan Circle
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 leading-relaxed">
            Follow this 5-step transparent intake. Review all details before submitting so neighbors can rally around your need.
          </p>

          {/* Stepper indicator bar */}
          <div className="mt-6 pt-5 border-t border-emerald-800/60">
            <div className="flex items-center justify-between">
              {stepsList.map((step) => {
                const isPassed = currentStep > step.num;
                const isCurrent = currentStep === step.num;
                return (
                  <div key={step.num} className="flex flex-col items-center flex-1">
                    <div
                      className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-white text-[#14532D] shadow-sm ring-2 ring-emerald-300'
                          : isPassed
                          ? 'bg-emerald-700 text-emerald-100'
                          : 'bg-emerald-950 text-emerald-400/70'
                      }`}
                    >
                      {isPassed ? <Check className="w-3.5 h-3.5" /> : step.num}
                    </div>
                    <span
                      className={`text-[10px] sm:text-xs mt-1.5 whitespace-nowrap text-center ${
                        isCurrent
                          ? 'text-white font-semibold'
                          : isPassed
                          ? 'text-emerald-200'
                          : 'text-emerald-400/60'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          {/* STEP 1: Need & Person */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-stone-100 pb-3">
                <h2 className="font-heading text-lg font-bold text-stone-900">
                  Step 1: Type of Need & Beneficiary
                </h2>
                <p className="text-xs text-stone-500">
                  Select the category and identify who will receive this mutual aid.
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1.5">
                  Category of Assistance *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(['medical', 'bills', 'food', 'housing', 'education'] as AssistanceCategory[]).map(
                    (cat) => (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                          category === cat
                            ? 'bg-[#14532D] text-white border-[#14532D] shadow-xs'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        <span className="text-xs font-bold block">{getCategoryLabel(cat)}</span>
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Beneficiary Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={beneficiaryName}
                    onChange={(e) => setBeneficiaryName(e.target.value)}
                    placeholder="e.g. Danilo Bautista"
                    className="w-full text-sm py-2 px-3 bg-white border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#14532D]/20 focus:border-[#14532D]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Relationship to You
                  </label>
                  <select
                    value={relation}
                    onChange={(e) => setRelation(e.target.value)}
                    className="w-full text-sm py-2 px-3 bg-white border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#14532D]/20 focus:border-[#14532D]"
                  >
                    <option value="Self">Self (Para sa sarili ko)</option>
                    <option value="Parent / Mother / Father">Parent (Nanay / Tatay)</option>
                    <option value="Child / Baby">Child (Anak)</option>
                    <option value="Grandparent">Grandparent (Lolo / Lola)</option>
                    <option value="Neighbor / Community Member">Neighbor / Community Member</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Age (Optional)
                  </label>
                  <input
                    type="number"
                    value={beneficiaryAge}
                    onChange={(e) => setBeneficiaryAge(e.target.value)}
                    placeholder="e.g. 52"
                    className="w-full text-sm py-2 px-3 bg-white border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#14532D]/20 focus:border-[#14532D]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    City / Province *
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Tondo, Manila"
                    className="w-full text-sm py-2 px-3 bg-white border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#14532D]/20 focus:border-[#14532D]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Barangay *
                  </label>
                  <input
                    type="text"
                    required
                    value={barangay}
                    onChange={(e) => setBarangay(e.target.value)}
                    placeholder="e.g. Barangay 105"
                    className="w-full text-sm py-2 px-3 bg-white border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#14532D]/20 focus:border-[#14532D]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Story & Urgency Prioritization */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-stone-100 pb-3">
                <h2 className="font-heading text-lg font-bold text-stone-900">
                  Step 2: Explanation & Consequence Assessment
                </h2>
                <p className="text-xs text-stone-500">
                  In Bayanihan Circle, prioritization is assessed by urgency and real-world consequences, not simply the peso amount.
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Request Headline *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Emergency Tricycle Engine Parts to Resume Daily Livelihood"
                  className="w-full text-sm py-2 px-3 bg-white border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#14532D]/20 focus:border-[#14532D]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  What happened? (Detailed Explanation) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  placeholder="Explain the background: what caused this emergency, what measures have already been attempted, and who is directly affected..."
                  className="w-full text-xs sm:text-sm py-2 px-3 bg-white border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#14532D]/20 focus:border-[#14532D]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  What happens if this assistance is delayed or unmet? (Consequence) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={consequenceIfDelayed}
                  onChange={(e) => setConsequenceIfDelayed(e.target.value)}
                  placeholder="e.g. Family has no food allowance for tomorrow; disconnection will take place in 48 hours; student cannot take licensure clearance..."
                  className="w-full text-xs sm:text-sm py-2 px-3 bg-white border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#14532D]/20 focus:border-[#14532D]"
                />
              </div>

              {/* Priority Category Picker */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-stone-700 block">
                    Consequence-Based Urgency Tier *
                  </label>
                  <span className="text-[11px] text-stone-400">
                    Demonstration Prioritization Rule
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {(['urgent', 'significant', 'ongoing'] as NeedPriority[]).map((p) => {
                    const isSelected = priority === p;
                    return (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setPriority(p)}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#14532D] text-white border-[#14532D] shadow-xs'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        <span className="text-xs font-bold block">{getPriorityLabel(p)}</span>
                        <span className={`text-[10px] mt-1 block leading-snug ${isSelected ? 'text-emerald-100' : 'text-stone-500'}`}>
                          {p === 'urgent' && 'Risk within 24-72 hours'}
                          {p === 'significant' && 'Escalates within 1-2 weeks'}
                          {p === 'ongoing' && 'Sustained monthly support'}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="p-3 rounded-lg bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <strong>Transparent Assessment Disclaimer:</strong> Prioritization evaluates physical harm, livelihood disruption, and utility cutoff risk rather than peso volume. Labeled as an evaluation demonstration.
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Estimated Deadline (Days remaining)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={urgentDeadlineDays}
                  onChange={(e) => setUrgentDeadlineDays(e.target.value)}
                  className="w-32 text-sm py-2 px-3 bg-white border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#14532D]/20 focus:border-[#14532D]"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Requested Amount & Itemized Costs */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-lg font-bold text-stone-900">
                    Step 3: Requested Amount in Philippine Pesos (₱)
                  </h2>
                  <p className="text-xs text-stone-500">
                    Itemize each expense. Transparency protects against inflation and establishes strict funding limits.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-stone-400 block">Total Requested</span>
                  <span className="text-lg font-bold font-mono text-[#14532D] tabular-nums">
                    {formatPeso(totalCalculated)}
                  </span>
                </div>
              </div>

              {/* Existing items */}
              <div className="border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-100">
                {costItems.map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-stone-50/60 flex items-center justify-between text-xs">
                    <span className="font-medium text-stone-800">{item.item}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-stone-900 tabular-nums">
                        {formatPeso(item.amount)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCostItem(idx)}
                        className="text-stone-400 hover:text-red-600 p-1 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add item row */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                <span className="text-xs font-semibold text-stone-800 block">Add Expense Item:</span>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="e.g. 1 sack well-milled rice / Meralco reconnection fee"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="flex-1 text-xs py-2 px-3 bg-white border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#14532D]/20 focus:border-[#14532D]"
                  />
                  <input
                    type="number"
                    min="1"
                    placeholder="Amount in ₱"
                    value={newItemAmount}
                    onChange={(e) => setNewItemAmount(e.target.value)}
                    className="sm:w-36 text-xs font-mono py-2 px-3 bg-white border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#14532D]/20 focus:border-[#14532D]"
                  />
                  <button
                    type="button"
                    onClick={handleAddCostItem}
                    className="px-3.5 py-2 text-xs font-semibold text-white bg-[#14532D] hover:bg-[#0F3E22] rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Supporting Evidence Placeholder */}
          {currentStep === 4 && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-stone-100 pb-3">
                <h2 className="font-heading text-lg font-bold text-stone-900">
                  Step 4: Supporting Evidence Placeholder
                </h2>
                <p className="text-xs text-stone-500">
                  Attach documents or references to enable Community Administrator review.
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Evidence Document Type *
                </label>
                <select
                  value={evidenceType}
                  onChange={(e) => setEvidenceType(e.target.value)}
                  className="w-full text-sm py-2 px-3 bg-white border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#14532D]/20 focus:border-[#14532D]"
                >
                  <option value="Barangay Indigency Clearance">Barangay Indigency Clearance</option>
                  <option value="Doctor Prescription & Hospital Abstract">Doctor Prescription & Hospital Abstract</option>
                  <option value="Utility Disconnection Notice (Meralco / Maynilad)">Utility Disconnection Notice (Meralco / Maynilad)</option>
                  <option value="TODA / Tricycle Association Clearance">TODA / Tricycle Association Clearance</option>
                  <option value="School Statement of Account / College Registration">School Statement of Account / College Registration</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Document Reference / Certificate Number *
                </label>
                <input
                  type="text"
                  required
                  value={evidenceDetails}
                  onChange={(e) => setEvidenceDetails(e.target.value)}
                  placeholder="e.g. Certificate #2026-B-890 / Account #09812-4"
                  className="w-full text-sm py-2 px-3 bg-white border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#14532D]/20 focus:border-[#14532D]"
                />
              </div>

              {/* Evidence Upload Simulator Box */}
              <div className="p-6 rounded-xl border border-dashed border-stone-300 bg-stone-50 text-center space-y-2">
                <UploadCloud className="w-8 h-8 text-[#14532D] mx-auto" />
                <div className="text-xs font-bold text-stone-800">
                  Simulated File Attachment Placeholder
                </div>
                <p className="text-[11px] text-stone-500 max-w-sm mx-auto">
                  Click below to simulate selecting a scanned proof or mobile photo:
                </p>
                <div className="flex justify-center gap-2 pt-1">
                  {['sample_brgy_clearance.pdf', 'prescription_slip_scan.jpg', 'meralco_notice.pdf'].map(
                    (mockFile) => (
                      <button
                        type="button"
                        key={mockFile}
                        onClick={() => setEvidenceFileMock(mockFile)}
                        className={`text-xs px-2.5 py-1.5 rounded-md border cursor-pointer transition-all ${
                          evidenceFileMock === mockFile
                            ? 'bg-[#14532D] text-white border-[#14532D]'
                            : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {mockFile}
                      </button>
                    )
                  )}
                </div>
                {evidenceFileMock && (
                  <div className="text-xs text-emerald-800 font-semibold pt-1">
                    ✓ Attached: <span className="font-mono">{evidenceFileMock}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 5: Review & Submit */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#14532D] uppercase tracking-wider mb-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Final Step: Review Information Before Posting</span>
                </div>
                <h2 className="font-heading text-xl font-bold text-stone-900">
                  Review & Confirm Your Request
                </h2>
                <p className="text-xs text-stone-500">
                  Please verify that all amounts and explanations are accurate before publishing to the community.
                </p>
              </div>

              {/* Review Summary Grid */}
              <div className="bg-stone-50 rounded-xl border border-stone-200 p-5 space-y-4 text-xs">
                {/* 1. Basics */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-stone-500">
                    <span className="font-semibold uppercase tracking-wider text-[10px]">Need & Beneficiary</span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-[#14532D] hover:underline font-medium cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="text-sm font-bold text-stone-900">{title}</div>
                  <div className="text-stone-700">
                    Category: <strong className="text-stone-900">{getCategoryLabel(category)}</strong> · For: <strong className="text-stone-900">{beneficiaryName}</strong> ({relation}) · Location: <strong className="text-stone-900">{barangay}, {location}</strong>
                  </div>
                </div>

                <div className="border-t border-stone-200 pt-3 space-y-1">
                  <div className="flex justify-between items-center text-stone-500">
                    <span className="font-semibold uppercase tracking-wider text-[10px]">Story & Consequence</span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="text-[#14532D] hover:underline font-medium cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-stone-700 italic">"{story}"</p>
                  <p className="text-amber-900 font-medium pt-1">
                    Consequence if unassisted: {consequenceIfDelayed}
                  </p>
                  <div className="text-stone-600">
                    Priority Tier: <strong className="text-[#14532D]">{getPriorityLabel(priority)}</strong> · Target Deadline: <strong className="text-stone-900">{urgentDeadlineDays} days</strong>
                  </div>
                </div>

                {/* 3. Costs */}
                <div className="border-t border-stone-200 pt-3 space-y-2">
                  <div className="flex justify-between items-center text-stone-500">
                    <span className="font-semibold uppercase tracking-wider text-[10px]">Itemized Costs & Total</span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="text-[#14532D] hover:underline font-medium cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="divide-y divide-stone-200 bg-white rounded-lg border border-stone-200 overflow-hidden">
                    {costItems.map((item, i) => (
                      <div key={i} className="py-2 px-3 flex justify-between">
                        <span>{item.item}</span>
                        <span className="font-mono font-bold">{formatPeso(item.amount)}</span>
                      </div>
                    ))}
                    <div className="py-2.5 px-3 flex justify-between bg-stone-100/80 font-bold">
                      <span>Total Requested Goal (Strict Funding Limit)</span>
                      <span className="font-mono text-[#14532D]">{formatPeso(totalCalculated)}</span>
                    </div>
                  </div>
                </div>

                {/* 4. Evidence */}
                <div className="border-t border-stone-200 pt-3 space-y-1">
                  <div className="flex justify-between items-center text-stone-500">
                    <span className="font-semibold uppercase tracking-wider text-[10px]">Supporting Evidence</span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      className="text-[#14532D] hover:underline font-medium cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="text-stone-700">
                    Type: <strong className="text-stone-900">{evidenceType}</strong> ({evidenceDetails})
                  </div>
                  <div className="text-emerald-800 text-[11px]">
                    Placeholder File: {evidenceFileMock} (Initial review status: Under Community Review)
                  </div>
                </div>
              </div>

              {/* Transparency Notice */}
              <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#14532D] shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  Upon posting, your request will appear on the community feed with a strict funding limit of {formatPeso(totalCalculated)}. Once reached, contributions are closed automatically to ensure fair community sharing.
                </div>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="pt-6 mt-6 border-t border-stone-200 flex items-center justify-between gap-3">
            <div>
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={goToPrevStep}
                  className="px-4 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 rounded-lg cursor-pointer transition-colors inline-flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous Step</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 text-xs font-medium text-stone-500 hover:text-stone-800 cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>

            <div>
              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={goToNextStep}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-[#14532D] hover:bg-[#0F3E22] active:scale-[0.99] rounded-lg transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#14532D] hover:bg-[#0F3E22] active:scale-[0.99] rounded-lg transition-all cursor-pointer shadow-xs inline-flex items-center gap-2"
                >
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Post Verified Request</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
