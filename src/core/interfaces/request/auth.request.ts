import { IsNotEmpty } from 'class-validator';

export type TConnectWalletRequest = {
  wallet_address: string;
  public_key: string;
  passkey: string;
};

export type TCheckIfUserExistRequest = {
  wallet_address: string;
};

export class ConnectWalletRequestDto implements TConnectWalletRequest {
  @IsNotEmpty()
  // @IsBtcAddress()
  wallet_address: string;

  @IsNotEmpty()
  // @IsHash('sha512')
  public_key: string;

  @IsNotEmpty()
  passkey: string;
}

export class CheckIfUserExistRequestDto implements TCheckIfUserExistRequest {
  @IsNotEmpty()
  // @IsBtcAddress()
  wallet_address: string;
}

export interface IUserForEventUpdate {
  wallet_address: string;
  public_key: string;
  base_wallet?: {
    account_balance: number;
    coin_name: string;
    coin_id: string;
  };
  other_wallet?: {
    account_balance: number;
    coin_name: string;
    coin_id: string;
  };
}
