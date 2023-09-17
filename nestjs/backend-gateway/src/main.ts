import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { Kafka } from 'kafkajs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID,
    brokers: [process.env.KAFKA_HOST],
    ssl: process.env.KAFKA_USE_SSL === 'true',
    sasl: {
      mechanism: 'plain',
      username: process.env.KAFKA_SASL_USERNAME,
      password: process.env.KAFKA_SASL_PASSWORD,
    },
  });

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: kafka,
      consumer: {
        groupId: process.env.KAFKA_CONSUMER_GROUP_ID,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
