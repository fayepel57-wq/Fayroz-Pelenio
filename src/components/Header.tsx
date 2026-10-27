import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Menu, X, HeartHandshake, ShieldCheck, User, Users, RefreshCw } from 'lucide-react';

interface HeaderProps {
  currentTab: 'home' | 'ask' | 'dashboard' | 'profile';
  setCurrentTab: (tab: 'home' | 'ask' | 'dashboard' | 'profile') => void;
  user: UserProfile | null;
  onOpenSignIn: () => void;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  user,
  onOpenSignIn,
  onSignOut,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'ask', label: 'Ask for Help' },
    { id: 'dashboard', label: 'My Dashboard' },
    { id: 'profile', label: 'Profile' },
  ] as const;

  const handleNavClick = (tab: 'home' | 'ask' | 'dashboard' | 'profile') => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'beneficiary':
        return <span className="text-[10px] uppercase font-bold text-amber-900 bg-amber-100/90 px-1.5 py-0.5 rounded">Beneficiary</span>;
      case 'donor':
        return <span className="text-[10px] uppercase font-bold text-emerald-900 bg-emerald-100/90 px-1.5 py-0.5 rounded">Donor</span>;
      case 'admin':
        return <span className="text-[10px] uppercase font-bold text-blue-900 bg-blue-100/90 px-1.5 py-0.5 rounded">Admin</span>;
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left group cursor-pointer shrink-0"
          >
            <div className="w-9 h-9 rounded-lg bg-[#14532D] text-[#FBF9F5] flex items-center justify-center shadow-xs">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div className="leading-tight">
              <span className="font-heading text-xl font-bold tracking-tight text-[#14532D] whitespace-nowrap block">
                Bayanihan Circle
              </span>
              <span className="text-[10px] tracking-wider uppercase font-medium text-stone-500 block">
                Pilipinas Mutual Aid
              </span>
            </div>
          </button>

          {/* Zone 2: 4 nav links with clean single-line styling */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative py-1 cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'text-[#14532D] font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#14532D] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavClick('profile')}
                  className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-[#14532D] bg-[#14532D]/10 hover:bg-[#14532D]/15 rounded-md transition-colors cursor-pointer"
                  title="View Profile"
                >
                  <span className="w-5 h-5 rounded-full bg-[#14532D] text-[#FBF9F5] text-[10px] flex items-center justify-center font-bold">
                    {user.avatarInitials}
                  </span>
                  <span className="hidden sm:inline max-w-[110px] truncate">{user.name}</span>
                  {getRoleBadge(user.role)}
                </button>

                <button
                  onClick={onOpenSignIn}
                  className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-md transition-colors cursor-pointer inline-flex items-center gap-1 text-xs"
                  title="Switch Demo Role"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline text-[11px]">Switch Role</span>
                </button>

                <button
                  onClick={onSignOut}
                  className="text-xs text-stone-400 hover:text-stone-700 transition-colors cursor-pointer px-1.5 py-1"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenSignIn}
                className="px-4 py-2 text-xs font-semibold tracking-wide uppercase text-[#FBF9F5] bg-[#14532D] hover:bg-[#0F3E22] active:scale-[0.99] rounded-md transition-all shadow-xs cursor-pointer whitespace-nowrap shrink-0"
              >
                Sign In
              </button>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-600 hover:text-stone-900 rounded-md hover:bg-stone-100 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-[#FBF9F5] px-4 pt-3 pb-5 space-y-2">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#14532D] text-[#FBF9F5] font-semibold'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          {user && (
            <div className="pt-2 border-t border-stone-200 flex justify-between items-center px-1">
              <span className="text-xs text-stone-600">Active role: {getRoleBadge(user.role)}</span>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSignIn();
                }}
                className="text-xs text-[#14532D] font-semibold cursor-pointer"
              >
                Switch Role
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
