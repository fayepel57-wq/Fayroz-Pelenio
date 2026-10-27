import React from 'react';
import { formatPeso } from '../utils/formatters';
import { ShieldCheck, Heart, Sparkles, ArrowRight, Info } from 'lucide-react';
import { APP_IMAGES } from '../assets/images/index';
import { BayanihanImage } from './BayanihanImage';

interface HeroBannerProps {
  onAskHelpClick: () => void;
  onBrowseUrgentClick: () => void;
  totalPledged: number;
  totalRequests: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onAskHelpClick,
  onBrowseUrgentClick,
  totalPledged,
  totalRequests,
}) => {
  return (
    <div className="relative bg-[#14532D] text-[#FBF9F5] overflow-hidden border-b border-[#0F3E22]">
      {/* Subtle organic pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* Notice Banner */}
        <div className="mb-8 p-3.5 rounded-lg bg-[#0F3E22]/80 border border-emerald-800/60 text-xs text-emerald-100 flex items-start gap-3">
          <Info className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-white">Community Preview Notice:</span>{' '}
            Bayanihan Circle is an interactive mutual aid prototype for Philippine communities. All profiles, peso figures, and verification records are simulated sample data. Real payment transactions and live barangay validation are not yet active.
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Mission & Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-semibold tracking-wider uppercase text-emerald-200">
                Community Mutual Aid · Pilipinas
              </span>
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#FBF9F5] text-balance leading-[1.15]">
                Sama-samang pag-alalay sa oras ng pangangailangan.
              </h1>
              <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed max-w-2xl">
                A warm, dignified platform connecting Filipinos facing medical emergencies, overdue bills, and basic needs with compassionate neighbors, friends, and overseas supporters.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onAskHelpClick}
                className="px-5 py-3 text-sm font-semibold text-[#14532D] bg-[#FBF9F5] hover:bg-[#F3EFE6] active:scale-[0.99] rounded-md transition-all shadow-sm cursor-pointer inline-flex items-center gap-2"
              >
                <span>Ask for Help</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onBrowseUrgentClick}
                className="px-5 py-3 text-sm font-semibold text-[#FBF9F5] border border-emerald-600/70 hover:bg-emerald-800/40 active:scale-[0.99] rounded-md transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Heart className="w-4 h-4 text-emerald-300" />
                <span>Help Others Instead</span>
              </button>
            </div>

            {/* Key Trust Signals */}
            <div className="pt-4 border-t border-emerald-800/60 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-emerald-100">
              <div>
                <span className="block font-semibold text-white">0% Platform Cut</span>
                <span className="text-emerald-300/80">Direct neighbor mutual aid</span>
              </div>
              <div>
                <span className="block font-semibold text-white">Barangay-Checked</span>
                <span className="text-emerald-300/80">Documented community status</span>
              </div>
              <div>
                <span className="block font-semibold text-white">Itemized Transparency</span>
                <span className="text-emerald-300/80">Exact peso cost breakdowns</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Community Anchor */}
          <div className="lg:col-span-5">
            <div className="relative rounded-xl overflow-hidden shadow-lg border border-emerald-800/50 bg-[#0F3E22]">
              <div className="h-72 sm:h-80 w-full overflow-hidden">
                <BayanihanImage
                  src={APP_IMAGES.hero}
                  alt="Filipino community sharing food and mutual aid care boxes in a local barangay"
                  category="food"
                  className="w-full h-full object-cover"
                  fallbackKicker="Bayanihan Community Spirit"
                />
              </div>
              <div className="p-4 bg-[#0F3E22] border-t border-emerald-800/40 text-xs text-emerald-200 flex items-center justify-between">
                <span>Tradisyong Bayanihan sa Bawat Barangay</span>
                <span className="font-semibold text-emerald-100">Simulated Mutual Aid</span>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width Metric Strip below hero split */}
        <div className="mt-10 pt-6 border-t border-emerald-800/60 grid grid-cols-2 sm:grid-cols-4 gap-6 text-emerald-100">
          <div>
            <span className="block text-2xl lg:text-3xl font-bold font-mono tabular-nums text-white">
              {formatPeso(totalPledged)}
            </span>
            <span className="text-xs text-emerald-200/80 font-medium">Community Aid Pledged</span>
          </div>
          <div>
            <span className="block text-2xl lg:text-3xl font-bold font-mono tabular-nums text-white">
              {totalRequests}
            </span>
            <span className="text-xs text-emerald-200/80 font-medium">Active Assistance Requests</span>
          </div>
          <div>
            <span className="block text-2xl lg:text-3xl font-bold font-mono tabular-nums text-white">
              18
            </span>
            <span className="text-xs text-emerald-200/80 font-medium">Barangays Reached</span>
          </div>
          <div>
            <span className="block text-2xl lg:text-3xl font-bold font-mono tabular-nums text-white">
              84
            </span>
            <span className="text-xs text-emerald-200/80 font-medium">Neighbor Pledges Logged</span>
          </div>
        </div>
      </div>
    </div>
  );
};
