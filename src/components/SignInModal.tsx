import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { DEMO_USERS } from '../data/mockRequests';
import { X, HeartHandshake, User, ShieldCheck, Check, Heart, UserCheck, Wrench } from 'lucide-react';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUser: (user: UserProfile) => void;
  currentUser: UserProfile | null;
}

export const SignInModal: React.FC<SignInModalProps> = ({
  isOpen,
  onClose,
  onSelectUser,
  currentUser,
}) => {
  if (!isOpen) return null;

  const roleConfigs: {
    key: 'beneficiary' | 'donor' | 'admin';
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      key: 'beneficiary',
      title: 'Beneficiary Experience',
      description: 'Test submitting requests, tracking funding progress, review status, and confirming payment settlement.',
      icon: <Wrench className="w-4 h-4 text-amber-700" />,
      color: 'border-amber-300 bg-amber-50/40',
    },
    {
      key: 'donor',
      title: 'Donor Experience',
      description: 'Test browsing by need priority, following requests, simulating pledges, and using "Help Others Instead".',
      icon: <Heart className="w-4 h-4 text-[#14532D]" />,
      color: 'border-emerald-300 bg-emerald-50/40',
    },
    {
      key: 'admin',
      title: 'Community Administrator Experience',
      description: 'Test validating evidence documents in the review queue and auditing separate payment receipts.',
      icon: <ShieldCheck className="w-4 h-4 text-blue-700" />,
      color: 'border-blue-300 bg-blue-50/40',
    },
  ];

  const [customName, setCustomName] = useState('');
  const [customRole, setCustomRole] = useState<UserRole>('donor');
  const [customLocation, setCustomLocation] = useState('Metro Manila');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    const initials = customName
      .trim()
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'KB';

    const customUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: customName.trim(),
      role: customRole,
      location: customLocation.trim(),
      avatarInitials: initials,
      email: `${customName.toLowerCase().replace(/\s+/g, '.')}@bayanihan.ph`,
      isVerified: true,
      pledgedTotal: 0,
      requestsSupported: 0,
      badges: ['Active Neighbor'],
    };

    onSelectUser(customUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#14532D] text-white flex items-center justify-center mx-auto shadow-xs">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h2 className="font-heading text-xl font-bold text-stone-900">
            Switch Demo Account & Role
          </h2>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Switch between Beneficiary, Donor, and Community Administrator accounts to test each distinct flow in Bayanihan Circle:
          </p>
        </div>

        {/* The 3 Official Demo Roles */}
        <div className="space-y-3 mb-6">
          {roleConfigs.map((cfg) => {
            const persona = DEMO_USERS[cfg.key];
            const isCurrent = currentUser?.id === persona.id;
            return (
              <button
                key={cfg.key}
                onClick={() => {
                  onSelectUser(persona);
                  onClose();
                }}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                  isCurrent
                    ? 'border-[#14532D] bg-emerald-50/80 ring-2 ring-[#14532D]/20 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#14532D] text-white text-xs font-bold flex items-center justify-center font-heading">
                      {persona.avatarInitials}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                        <span>{persona.name}</span>
                        {isCurrent && <Check className="w-3.5 h-3.5 text-[#14532D]" />}
                      </div>
                      <div className="text-[11px] text-stone-500">{persona.location}</div>
                    </div>
                  </div>

                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                    {cfg.key}
                  </span>
                </div>

                <div className="text-xs text-stone-600 pl-12 pr-2 leading-relaxed">
                  {cfg.description}
                </div>
              </button>
            );
          })}
        </div>

        {/* Or Custom Quick Entry */}
        <div className="pt-4 border-t border-stone-200">
          <span className="text-xs font-semibold text-stone-700 block mb-2">
            Or Test with Custom Details:
          </span>
          <form onSubmit={handleCustomSubmit} className="space-y-2.5">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Full name (e.g. Maria Clara)"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="text-xs py-2 px-3 bg-white border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#14532D]/20 focus:border-[#14532D]"
              />
              <select
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value as UserRole)}
                className="text-xs py-2 px-3 bg-white border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#14532D]/20 focus:border-[#14532D]"
              >
                <option value="donor">Donor Role</option>
                <option value="beneficiary">Beneficiary Role</option>
                <option value="admin">Administrator Role</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={!customName.trim()}
              className="w-full py-2 text-xs font-semibold text-white bg-[#14532D] hover:bg-[#0F3E22] disabled:opacity-50 rounded-lg transition-colors cursor-pointer"
            >
              Sign In as Custom Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
