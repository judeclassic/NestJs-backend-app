import {
  IUserResponse,
  IUserResponseForEvent,
} from '../../response/user.response';
import { CoinType } from '../transaction/transaction';
import {
  IAuthenticatedUser,
  IPersonalInformation,
  IUser,
  IWalletInformation,
} from './user';

export class PersonnalInformationDto implements IPersonalInformation {
  access_token: string;
  passkey: string;
  readonly wallet_address: string;
  readonly public_key: string;

  constructor(props: IPersonalInformation) {
    this.access_token = props.access_token;
    this.passkey = props.passkey;
    this.wallet_address = props.wallet_address;
    this.public_key = props.public_key;
  }

  toResponse = () => {
    return {
      wallet_address: this.wallet_address,
      public_key: this.public_key,
    };
  };

  setAccessToken = (access_token: string) => {
    this.access_token = access_token;
  };
}

export class WalletInformationDto implements IWalletInformation {
  readonly account_balance: number;
  readonly pending_balance: number;
  readonly network: string;
  readonly coin_name: string;
  readonly coin_id: string;

  constructor(props: IWalletInformation) {
    this.account_balance = props.account_balance;
    this.pending_balance = props.pending_balance;
    this.network = props.network;
    this.coin_name = props.coin_name;
    this.coin_id = props.coin_id;
  }

  toResponse = () => {
    return {
      account_balance: this.account_balance,
      pending_balance: this.pending_balance,
      network: this.network,
      coin_name: this.coin_name,
      coin_id: this.coin_id,
    } as IWalletInformation;
  };

  fromInitialWalletInformation = () => {
    return {
      account_balance: 0,
      pending_balance: 0,
      network: 'BRC-20',
      coin_name: CoinType.BTC,
      coin_id: '',
    };
  };
}

export class UserDTO implements IUser {
  readonly _id: string;
  readonly personal: PersonnalInformationDto;
  readonly btc_wallet: WalletInformationDto;
  readonly other_wallets: WalletInformationDto[];
  readonly created_at: Date;
  readonly updated_at: Date;

  constructor(props: IUser) {
    this._id = props._id;
    this.personal = new PersonnalInformationDto(props.personal);
    this.btc_wallet = new WalletInformationDto(props.btc_wallet);
    this.other_wallets = props.other_wallets.map(
      (other_wallet) => new WalletInformationDto(other_wallet),
    );
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }

  public toResponse = () => {
    return {
      id: this._id,
      personal: this.personal.toResponse(),
      btc_wallet: this.btc_wallet.toResponse(),
      other_wallets: this.other_wallets.map((other_wallet) =>
        other_wallet.toResponse(),
      ),
      created_at: this.created_at,
      updated_at: this.updated_at,
    } as IUserResponse;
  };

  public toResponseForEvent = () => {
    return {
      wallet_address: this.personal.wallet_address,
      public_key: this.personal.public_key,
      btc_wallet: this.btc_wallet.toResponse(),
      other_wallets: this.other_wallets.map((other_wallet) =>
        other_wallet.toResponse(),
      ),
    } as IUserResponseForEvent;
  };

  public toAuthenticatedUser = () => {
    return {
      _id: this._id,
      wallet_address: this.personal.wallet_address,
      public_key: this.personal.public_key,
      passkey: this.personal.passkey,
    } as IAuthenticatedUser;
  };
}
