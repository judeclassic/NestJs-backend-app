import { ConsumerConfig, ConsumerSubscribeTopics, KafkaMessage } from 'kafkajs';

export interface KafkaConsumerOptions {
  topic: ConsumerSubscribeTopics;
  config: ConsumerConfig;
  onMessage: (message: KafkaMessage) => Promise<void>;
}
