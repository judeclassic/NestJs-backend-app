import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { WalletModule } from './modules/wallet/wallet.module';

@Module({
  imports: [
    AuthModule,
    WalletModule,
    MongooseModule.forRoot(
      process.env.MONGODB_URI ??
        'mongodb+srv://justclassic24:cbxTJETWqiB3BTEp@user.xhfysm1.mongodb.net/?retryWrites=true&w=majority',
    ),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
