import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer } from 'kafkajs';
import { UserEventEnum } from 'src/core/interfaces/event';

@Injectable()
export class ProducerService {
  private producer: Producer;

  constructor(private readonly configService: ConfigService) {
    // const kafka = new Kafka({
    //   brokers: [this.configService.get('KAFKA_BROKER')],
    //   clientId: 'my-app',
    // });
    // this.producer = kafka.producer();
    // this.producer.connect().then(() => {
    //   console.log('Kafka producer is ready');
    // });
  }

  sendMessage = async <T>(topic: UserEventEnum, message: T) => {
    // return this.producer.send({
    //   topic,
    //   messages: [{ value: JSON.stringify(message) }],
    // });
  };
}
