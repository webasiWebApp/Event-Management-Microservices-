import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { EVENT_EXCHANGE } from '../common/events';

@Global()
@Module({
  imports: [RabbitMQModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      uri: config.get('RABBITMQ_URL', 'amqp://guest:guest@localhost:5672'),
      exchanges: [{ name: EVENT_EXCHANGE, type: 'topic', options: { durable: true } }],
      connectionInitOptions: { wait: false },
    }),
  })],
  exports: [RabbitMQModule],
})
export class MessagingModule {}
