import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { BookingAcceptedEvent, BookingCancelledEvent, EVENT_EXCHANGE, ROUTING_KEYS } from '../common/events';
import { VendorsService } from '../vendors/vendors.service';

@Injectable()
export class BookingConsumers {
  private readonly logger = new Logger(BookingConsumers.name);
  constructor(private readonly vendors: VendorsService) {}
  @RabbitSubscribe({ exchange: EVENT_EXCHANGE, routingKey: ROUTING_KEYS.BOOKING_ACCEPTED, queue: 'vendor-service.queue', queueOptions: { durable: true } })
  async accepted(event: BookingAcceptedEvent) {
    this.logger.log(`Consumed ${ROUTING_KEYS.BOOKING_ACCEPTED} for booking ${event.bookingId}`);
    await this.vendors.setAvailability(event.vendorId, event.date, 'BLOCKED');
  }
  @RabbitSubscribe({ exchange: EVENT_EXCHANGE, routingKey: ROUTING_KEYS.BOOKING_CANCELLED, queue: 'vendor-service.queue', queueOptions: { durable: true } })
  async cancelled(event: BookingCancelledEvent) {
    this.logger.log(`Consumed ${ROUTING_KEYS.BOOKING_CANCELLED} for booking ${event.bookingId}`);
    await this.vendors.setAvailability(event.vendorId, event.date, 'AVAILABLE');
  }
}
