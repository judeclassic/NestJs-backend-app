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
      process.env.MONGODB_URI ?? 'mongodb://localhost:27017',
    ),
    ConfigModule.forRoot({
      envFilePath: ['../.env.development.local', '../.env.development'],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
