import { NeedPriority, PaymentConfirmationStatus } from '../types';

export function formatPeso(amount: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(amount).replace('PHP', '₱');
}

export function calculatePercentage(raised: number, target: number): number {
  if (target <= 0) return 0;
  return Math.min(100, Math.round((raised / target) * 100));
}

export function getCategoryLabel(category: string): string {
  switch (category) {
    case 'medical':
      return 'Medical Needs';
    case 'bills':
      return 'Bills & Utilities';
    case 'food':
      return 'Food & Groceries';
    case 'housing':
      return 'Housing & Shelter';
    case 'education':
      return 'Education';
    default:
      return category;
  }
}

export function getPriorityLabel(priority: NeedPriority): string {
  switch (priority) {
    case 'urgent':
      return 'Urgent Need';
    case 'significant':
      return 'Significant Need';
    case 'ongoing':
      return 'Ongoing Support';
  }
}

export function getPriorityDescription(priority: NeedPriority): string {
  switch (priority) {
    case 'urgent':
      return 'High time-sensitivity: immediate risk to life, vital health, or essential shelter within 24-72 hours.';
    case 'significant':
      return 'High consequence: severe educational, livelihood, or physical barrier that escalates within 1-2 weeks if unmet.';
    case 'ongoing':
      return 'Recurrent community sustenance, chronic therapy support, or neighborhood pantry replenishment.';
  }
}

export function getPaymentStatusLabel(status: PaymentConfirmationStatus): string {
  switch (status) {
    case 'pending_confirmation':
      return 'Pending Payment Confirmation';
    case 'confirmed_paid':
      return 'Paid & Receipt Confirmed';
  }
}
