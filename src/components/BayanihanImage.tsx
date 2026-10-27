import React, { useState } from 'react';
import { AssistanceCategory } from '../types';
import { Stethoscope, Receipt, Utensils, Home, GraduationCap, HeartHandshake, ShieldCheck } from 'lucide-react';
import { getCategoryLabel } from '../utils/formatters';

interface BayanihanImageProps {
  src?: string;
  alt: string;
  category?: AssistanceCategory;
  className?: string;
  containerClassName?: string;
  fallbackKicker?: string;
}

export const BayanihanImage: React.FC<BayanihanImageProps> = ({
  src,
  alt,
  category = 'medical',
  className = 'w-full h-full object-cover',
  containerClassName = 'relative w-full h-full overflow-hidden bg-stone-100',
  fallbackKicker,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Return category icon and theme styles for graceful fallback
  const getCategoryDetails = (cat: AssistanceCategory) => {
    switch (cat) {
      case 'medical':
        return {
          icon: <Stethoscope className="w-8 h-8 text-emerald-200" />,
          bg: 'from-[#14532D] via-[#0F3E22] to-[#0a2816]',
          border: 'border-emerald-800/60',
          accent: 'text-emerald-300',
        };
      case 'bills':
        return {
          icon: <Receipt className="w-8 h-8 text-amber-200" />,
          bg: 'from-[#2e2617] via-[#1f1910] to-[#14532D]',
          border: 'border-amber-800/50',
          accent: 'text-amber-300',
        };
      case 'food':
        return {
          icon: <Utensils className="w-8 h-8 text-emerald-200" />,
          bg: 'from-[#1b432a] via-[#14532D] to-[#102b1c]',
          border: 'border-emerald-700/50',
          accent: 'text-emerald-300',
        };
      case 'housing':
        return {
          icon: <Home className="w-8 h-8 text-orange-200" />,
          bg: 'from-[#2e231e] via-[#1f1714] to-[#14532D]',
          border: 'border-orange-800/50',
          accent: 'text-orange-200',
        };
      case 'education':
        return {
          icon: <GraduationCap className="w-8 h-8 text-blue-200" />,
          bg: 'from-[#132c3c] via-[#0c1f2b] to-[#14532D]',
          border: 'border-blue-800/50',
          accent: 'text-blue-300',
        };
      default:
        return {
          icon: <HeartHandshake className="w-8 h-8 text-emerald-200" />,
          bg: 'from-[#14532D] to-[#0F3E22]',
          border: 'border-emerald-800/50',
          accent: 'text-emerald-300',
        };
    }
  };

  const details = getCategoryDetails(category);

  // If no source provided or failed to load, render graceful fallback container
  if (!src || hasError) {
    return (
      <div
        className={`${containerClassName} bg-gradient-to-br ${details.bg} border-b ${details.border} flex flex-col justify-between p-4 text-white select-none`}
        role="img"
        aria-label={alt}
      >
        {/* Subtle patterned overlay */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px]"
          aria-hidden="true"
        />

        <div className="relative z-10 flex items-center justify-between text-xs">
          <span className={`font-semibold tracking-wider uppercase text-[10px] ${details.accent}`}>
            {fallbackKicker || getCategoryLabel(category)}
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-200/80">
            <ShieldCheck className="w-3 h-3" />
            <span>Community Verified</span>
          </span>
        </div>

        <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center py-2 space-y-1.5">
          <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 shadow-xs">
            {details.icon}
          </div>
          <span className="text-xs font-bold text-white/95 max-w-[200px] truncate">
            {alt}
          </span>
        </div>

        <div className="relative z-10 text-[10px] text-emerald-100/70 text-right">
          Bayanihan Circle Mutual Aid
        </div>
      </div>
    );
  }

  return (
    <div className={containerClassName}>
      {/* Fallback container is always behind while image loads */}
      {!isLoaded && (
        <div className={`absolute inset-0 bg-gradient-to-br ${details.bg} animate-pulse`} />
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        referrerPolicy="no-referrer"
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />
    </div>
  );
};
