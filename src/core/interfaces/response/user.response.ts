import { IPersonalInformation, IWalletInformation } from '../entities/user/user';

export interface ICheckUserResponse {
  is_user_existing: boolean;
}

export interface IUserResponse {
  readonly id: string;
  readonly personal: IPersonalInformation;
  readonly btc_wallet: IWalletInformation;
  readonly other_wallets: IWalletInformation[];
  readonly created_at: Date;
  updated_at: Date;
}
