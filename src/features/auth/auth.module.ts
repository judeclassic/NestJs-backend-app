import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/core/interfaces/constants';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from 'src/core/services/user/user.service';
import { EncryptionService } from 'src/core/services/encryption/encryption.service';
import { UserSchema } from 'src/core/interfaces/entities/user/user.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProducerService } from 'src/core/services/kafka/producer/kafka.service';
import { ConsumerService } from 'src/core/services/kafka/consumer/consumer.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
    ClientsModule.register([
      {
        name: 'USER_KAFKA_CLIENTModel',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'consumer',
          },
        },
      },
    ]),
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    EncryptionService,
    ConsumerService,
    ProducerService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
