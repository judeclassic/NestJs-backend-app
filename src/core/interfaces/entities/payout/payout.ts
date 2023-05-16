import { CoinType } from '../transaction/transaction';

export enum PayoutStatusEnum {
  pending = 'PENDING',
  successful = 'SUCCESSFUL',
  failed = 'FAILED',
  cancelled = 'CANCELLED',
}

interface IPayout {
  readonly _id: string;
  readonly amount: number;
  readonly coin_type: CoinType;
  readonly coin_name: string;
  readonly payout_status: PayoutStatusEnum;
  readonly wallet_address: string;
  readonly public_key: string;
}

export default IPayout;
