import { model, Schema } from 'mongoose';
import { IPersonalInformation, IUser, IWalletInformation } from './user';

const PersonalInformationSchema = new Schema<IPersonalInformation>({
  wallet_address: String,
  public_key: String,
  passkey: String,
  access_token: String,
});

const WalletInformationSchema = new Schema<IWalletInformation>({
  account_balance: Number,
  pending_balance: Number,
  network: String,
  coin_name: String,
  coin_id: String,
});

export const UserSchema = new Schema<IUser>({
  personal: PersonalInformationSchema,
  btc_wallet: WalletInformationSchema,
  other_wallets: [WalletInformationSchema],
  created_at: Date,
  updated_at: Date,
});

export const UserModel = model('User', UserSchema);
