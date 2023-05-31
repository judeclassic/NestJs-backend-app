import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PayoutSchema } from 'src/core/interfaces/entities/payout/payout.schema';
import { TransactionSchema } from 'src/core/interfaces/entities/transaction/transaction.schema';
import { UserSchema } from 'src/core/interfaces/entities/user/user.schema';
import { EncryptionService } from 'src/core/services/encryption/encryption.service';
import { PayoutService } from 'src/core/services/payout/payout.service';
import { TransactionService } from 'src/core/services/transaction/transaction.service';
import { UserService } from 'src/core/services/user/user.service';
import { WalletController } from './controller/wallet.controller';
import { DepositService } from './service/deposit/deposit.service';
import { WalletService } from './service/wallet.service';
import { WithdrawService } from './service/withdraw/withdraw.service';
import { ProducerService } from 'src/core/services/kafka/producer/kafka.service';
import { ConsumerService } from 'src/core/services/kafka/consumer/consumer.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Transaction',
        schema: TransactionSchema,
      },
      {
        name: 'User',
        schema: UserSchema,
      },
      {
        name: 'Payout',
        schema: PayoutSchema,
      },
    ]),
  ],
  providers: [
    TransactionService,
    ConfigService,
    DepositService,
    WithdrawService,
    WalletService,
    PayoutService,
    UserService,
    EncryptionService,
    ProducerService,
    ConsumerService,
  ],
  controllers: [WalletController],
})
export class WalletModule {}
