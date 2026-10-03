/**
 * Dynamic status translation utilities for DIRECT FARM
 * Provides consistent translation of database enums across the application
 */

import type { OrderStatus, PaymentStatus } from '../types';

/**
 * Translates order status to localized string
 */
export function translateOrderStatus(t: (key: string) => string, status: OrderStatus): string {
  return t(`flow.status.${status}`);
}

/**
 * Translates payment status to localized string  
 */
export function translatePaymentStatus(t: (key: string) => string, status: PaymentStatus): string {
  return t(`flow.payStatus.${status}`);
}

/**
 * Translates transaction status (which may use different enum values)
 */
export function translateTransactionStatus(t: (key: string) => string, status: string): string {
  // Map transaction status to payment status translations
  const statusMap: Record<string, string> = {
    'completed': 'completed',
    'paid': 'paid', 
    'pending': 'pending',
    'failed': 'failed',
    'refunded': 'refunded'
  };
  
  const mappedStatus = statusMap[status] || status;
  return t(`pay.${mappedStatus}`);
}

/**
 * Translates delivery tracking status
 */
export function translateDeliveryStatus(t: (key: string) => string, status: string): string {
  return t(`tracking.statuses.${status}`);
}

/**
 * Translates user status (admin context)
 */
export function translateUserStatus(t: (key: string) => string, status: string): string {
  return t(`desk.ustatus.${status}`);
}

/**
 * Translates verification status (admin context)  
 */
export function translateVerificationStatus(t: (key: string) => string, status: string): string {
  return t(`desk.vstatus.${status}`);
}

/**
 * Translates ticket/complaint status (admin context)
 */
export function translateTicketStatus(t: (key: string) => string, status: string): string {
  return t(`desk.tstatus.${status}`);
}

/**
 * Translates harvest status (farmer context)
 */
export function translateHarvestStatus(t: (key: string) => string, status: string): string {
  return t(`farmer.harvestStatus.${status}`);
}

/**
 * Translates auction status (premium context)
 */
export function translateAuctionStatus(t: (key: string) => string, status: string): string {
  return t(`plus.astatus.${status}`);
}

/**
 * Translates contract status (premium context)
 */
export function translateContractStatus(t: (key: string) => string, status: string): string {
  return t(`plus.cstatus.${status}`);
}

/**
 * Generic status translator with fallback
 * Use this when you're not sure which specific translator to use
 */
export function translateStatus(
  t: (key: string) => string, 
  status: string, 
  context: 'order' | 'payment' | 'transaction' | 'delivery' | 'user' | 'verification' | 'ticket' | 'harvest' | 'auction' | 'contract' = 'order'
): string {
  try {
    switch (context) {
      case 'order':
        return translateOrderStatus(t, status as OrderStatus);
      case 'payment':
        return translatePaymentStatus(t, status as PaymentStatus);
      case 'transaction':
        return translateTransactionStatus(t, status);
      case 'delivery':
        return translateDeliveryStatus(t, status);
      case 'user':
        return translateUserStatus(t, status);
      case 'verification':
        return translateVerificationStatus(t, status);
      case 'ticket':
        return translateTicketStatus(t, status);
      case 'harvest':
        return translateHarvestStatus(t, status);
      case 'auction':
        return translateAuctionStatus(t, status);
      case 'contract':
        return translateContractStatus(t, status);
      default:
        // Fallback: return capitalized status if no translation found
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  } catch (error) {
    // Fallback: return capitalized status if translation fails
    return status.charAt(0).toUpperCase() + status.slice(1);
  }
}