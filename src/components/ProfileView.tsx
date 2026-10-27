import React from 'react';
import { UserProfile } from '../types';
import { formatPeso } from '../utils/formatters';
import { ShieldCheck, Heart, Award, MapPin, Mail, HelpCircle, BookOpen, ExternalLink, CheckCircle2 } from 'lucide-react';

interface ProfileViewProps {
  user: UserProfile | null;
  onOpenSignIn: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onOpenSignIn }) => {
  const faqs = [
    {
      q: 'How does Bayanihan Circle protect community trust?',
      a: 'Bayanihan Circle relies on localized community endorsement and barangay documentation (such as certificates of indigency, hospital medical abstracts, and utility disconnection notices) to verify real emergencies. In this demonstration preview, all verification states are simulated.',
    },
    {
      q: 'Why are there zero platform cuts or deductions?',
      a: 'Bayanihan represents the Filipino cultural heritage of communal solidarity—neighbors lifting a house together without monetary charge. 100% of mutual aid support goes directly to beneficiaries.',
    },
    {
      q: 'Can Overseas Filipino Workers (OFWs) participate?',
      a: 'Yes. Bayanihan Circle is designed so OFWs worldwide can directly sponsor medical copays, electricity bills, and basic groceries for families in their home provinces.',
    },
    {
      q: 'What is the current status of payment gateways?',
      a: 'This version operates as an interactive concept prototype. Real GCash, Maya, and bank transfers are not yet executed. Pledging allows organizers to coordinate directly with donors.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-stone-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#14532D] text-white text-2xl font-bold flex items-center justify-center font-heading shadow-xs">
              {user?.avatarInitials || 'KA'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-2xl font-bold text-stone-900">
                  {user?.name || 'Kababayan Neighbor'}
                </h1>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#14532D]" />
                  <span>Demo Verified</span>
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>{user?.location || 'Quezon City, Metro Manila'}</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                  <span>{user?.email || 'neighbor@bayanihan.ph'}</span>
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onOpenSignIn}
            className="px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
          >
            Switch Account / Persona
          </button>
        </div>

        {/* Badges and Impact */}
        <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-100 space-y-1">
            <span className="text-xs text-stone-500 font-medium">Community Status</span>
            <div className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#14532D]" />
              <span>Active Barangay Helper</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-100 space-y-1">
            <span className="text-xs text-stone-500 font-medium">Mutual Aid Pledged</span>
            <div className="text-sm font-bold font-mono text-stone-900 tabular-nums">
              {formatPeso(user?.pledgedTotal || 3750)}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-100 space-y-1">
            <span className="text-xs text-stone-500 font-medium">Bayanihan Badges</span>
            <div className="text-xs font-semibold text-[#14532D] flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 fill-[#14532D]" />
              <span>3 Badges Earned</span>
            </div>
          </div>
        </div>

        {/* Badges List */}
        <div className="mt-6 pt-4 border-t border-stone-100">
          <span className="text-xs font-semibold text-stone-700 block mb-2">
            Earned Community Badges:
          </span>
          <div className="flex flex-wrap gap-2">
            {(user?.badges || ['Early Neighbor', 'Verified Community Advocate', 'Bayanihan Heart']).map(
              (badge) => (
                <span
                  key={badge}
                  className="px-3 py-1 bg-emerald-50 text-[#14532D] text-xs font-medium rounded-md border border-emerald-200 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#14532D]" />
                  <span>{badge}</span>
                </span>
              )
            )}
          </div>
        </div>
      </div>

      {/* The 4 Principles of Bayanihan Circle */}
      <div className="bg-[#FAF8F5] rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-4">
        <h2 className="font-heading text-xl font-bold text-stone-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#14532D]" />
          <span>The Four Pillars of Bayanihan Circle</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-white rounded-xl border border-stone-200/80 space-y-1">
            <h4 className="font-bold text-stone-900 text-sm">1. Dignity Before Charity</h4>
            <p className="text-stone-600 leading-relaxed">
              Asking for help is an act of courage, not weakness. We treat every individual and family with deep respect, free from humiliating conditions.
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-stone-200/80 space-y-1">
            <h4 className="font-bold text-stone-900 text-sm">2. Radical Itemized Transparency</h4>
            <p className="text-stone-600 leading-relaxed">
              Every peso requested must be accompanied by itemized expenses—whether for 1 month of hemodialysis copays, 4 sacks of rice, or electric reconnect fees.
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-stone-200/80 space-y-1">
            <h4 className="font-bold text-stone-900 text-sm">3. Balanseng Bayanihan</h4>
            <p className="text-stone-600 leading-relaxed">
              We urge supporters to look beyond viral campaigns and "Help Others Instead" by prioritizing neighbors with urgent deadlines who have few pledges.
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-stone-200/80 space-y-1">
            <h4 className="font-bold text-stone-900 text-sm">4. Anti-Usury Alternative</h4>
            <p className="text-stone-600 leading-relaxed">
              Mutual aid shields vulnerable Filipinos from predatory loan sharks (5-6 lenders) during medical shocks and sudden family emergencies.
            </p>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-4">
        <h2 className="font-heading text-xl font-bold text-stone-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#14532D]" />
          <span>Frequently Asked Questions</span>
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div key={index} className="p-4 rounded-xl bg-stone-50 border border-stone-100 space-y-1.5">
              <h4 className="text-sm font-bold text-stone-900">{faq.q}</h4>
              <p className="text-xs text-stone-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
