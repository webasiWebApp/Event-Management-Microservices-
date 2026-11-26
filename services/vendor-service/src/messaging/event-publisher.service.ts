import { Injectable, Logger } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { EVENT_EXCHANGE } from '../common/events';

@Injectable()
export class EventPublisherService {
  private readonly logger = new Logger(EventPublisherService.name);
  constructor(private readonly amqp: AmqpConnection) {}
  async publish(routingKey: string, payload: unknown): Promise<void> {
    this.logger.log(`Publishing ${routingKey}`);
    await this.amqp.publish(EVENT_EXCHANGE, routingKey, payload);
  }
}
