export const EVENT_EXCHANGE = 'eventlink.events';

export const ROUTING_KEYS = {
  VENDOR_APPROVED: 'vendor.approved',
  VENDOR_REJECTED: 'vendor.rejected',
  BOOKING_REQUESTED: 'booking.requested',
  BOOKING_ACCEPTED: 'booking.accepted',
  BOOKING_DECLINED: 'booking.declined',
  BOOKING_CANCELLED: 'booking.cancelled',
  EVENT_UPDATED: 'event.updated',
  PAYMENT_COMPLETED: 'payment.completed',
  PAYMENT_FAILED: 'payment.failed',
  PAYMENT_REFUNDED: 'payment.refunded',
  GUEST_INVITED: 'guest.invited',
  GUEST_RSVP_RECEIVED: 'guest.rsvp.received',
  GUEST_REMINDER_REQUESTED: 'guest.reminder.requested',
} as const;

export interface VendorApprovedEvent { vendorId: string; ownerUserId: string; businessName: string; note?: string; }
export interface VendorRejectedEvent { vendorId: string; ownerUserId: string; businessName: string; note?: string; }
export interface BookingAcceptedEvent { bookingId: string; eventId: string; vendorId: string; clientId: string; packageId: string; price: string | number; date: string; }
export interface BookingCancelledEvent extends BookingAcceptedEvent {}
