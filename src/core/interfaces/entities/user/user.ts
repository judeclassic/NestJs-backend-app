export interface IPersonalInformation {
  readonly wallet_address: string;
  readonly public_key: string;
  passkey: string;
  access_token: string;
}

export interface IWalletInformation {
  account_balance: number;
  pending_balance: number;
  readonly network: string;
  readonly coin_name: string;
  readonly coin_id: string;
}

// MAIN USER ENTITY

export interface IUser {
  readonly _id: string;
  readonly personal: IPersonalInformation;
  readonly btc_wallet: IWalletInformation;
  readonly other_wallets: IWalletInformation[];
  readonly created_at: Date;
  updated_at: Date;
}

// FOR CREATING AUTHENTICATION FOR USER

export interface IAuthenticatedUser {
  readonly wallet_address: string;
  readonly public_key: string;
  readonly passkey: string;
}
