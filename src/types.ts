export type AssistanceCategory = 'medical' | 'bills' | 'food' | 'housing' | 'education';

export type VerificationStatus = 'barangay_documented' | 'community_endorsed' | 'under_review';

export type NeedPriority = 'urgent' | 'significant' | 'ongoing';

export type PaymentConfirmationStatus = 'pending_confirmation' | 'confirmed_paid';

export interface CostItem {
  item: string;
  amount: number;
}

export interface Supporter {
  id: string;
  name: string;
  amount: number;
  message?: string;
  timeAgo: string;
}

export interface AssistanceRequest {
  id: string;
  title: string;
  story: string;
  beneficiaryName: string;
  beneficiaryAge?: number;
  relation: string; // e.g., 'Mother', 'Neighbor', 'Self'
  category: AssistanceCategory;
  targetAmount: number;
  raisedAmount: number;
  donorsCount: number;
  location: string;
  barangay: string;
  verificationStatus: VerificationStatus;
  verificationDetails: string;
  costBreakdown: CostItem[];
  urgentDeadlineDays?: number;
  isUrgent?: boolean;
  priority: NeedPriority;
  priorityReason: string;
  imageThumbnail?: string;
  recentSupporters: Supporter[];
  createdAt: string;
  authorId?: string;
  status: 'active' | 'completed' | 'paused';
  updates?: { date: string; content: string }[];
  isFullyFunded: boolean;
  paymentConfirmationStatus: PaymentConfirmationStatus;
  paymentConfirmationDetails?: {
    confirmedBy: string;
    confirmedAt: string;
    referenceNote: string;
  };
  evidenceType?: string;
  evidenceDetails?: string;
}

export type UserRole = 'beneficiary' | 'donor' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  location: string;
  avatarInitials: string;
  email: string;
  isVerified: boolean;
  pledgedTotal: number;
  requestsSupported: number;
  badges: string[];
  bio?: string;
}
