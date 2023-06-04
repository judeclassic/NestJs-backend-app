import { Logger } from '@nestjs/common';
import {
  Consumer,
  ConsumerConfig,
  ConsumerSubscribeTopics,
  Kafka,
} from 'kafkajs';
import { sleep } from 'src/core/utils/sleep';
import { IConsumer } from './consumer.interface';

export class KafkaConsumer implements IConsumer {
  private readonly kafka: Kafka;
  private readonly consumer: Consumer;
  private readonly logger: Logger;

  constructor(
    private readonly topic: ConsumerSubscribeTopics,
    config: ConsumerConfig,
    broker: string,
  ) {
    // this.kafka = new Kafka({ brokers: [broker], clientId: 'my-app' });
    // this.consumer = this.kafka.consumer(config);
    // this.logger = new Logger(`${topic.topics}-${config.groupId}`);
  }

  connect = async () => {
    // try {
    //   await this.consumer.connect();
    // } catch (err) {
    //   this.logger.error('Failed to connect to kafka: ', err);
    //   sleep(5000);
    //   this.connect();
    // }
  };

  disconnect = async () => {
    // await this.consumer.disconnect();
  };

  consume = async (onMessage: (message: any) => Promise<void>) => {
    // await this.consumer.subscribe(this.topic);
    // await this.consumer.run({
    //   eachMessage: async ({ message, partition }) => {
    //     this.logger.debug(`processing message partition: ${partition}`);
    //     await onMessage(message);
    //   },
    // });
  };
}
