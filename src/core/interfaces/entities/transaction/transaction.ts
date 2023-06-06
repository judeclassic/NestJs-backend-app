export enum CoinType {
  BTC = 'BTC',
  BRC20 = 'BRC-20',
}

export enum TransactionStatusEnum {
  pending = 'PENDING',
  successful = 'SUCCESSFUL',
  failed = 'FAILED',
  processing = 'PROCESSING',
}

export enum TransactionType {
  liquidity = 'LIQUIDITY',
  withdraw = 'WITHDRAW',
  transfer = 'TRANSFER',
  deposit = 'DEPOSIT',
}
interface ITransaction {
  readonly _id: string;
  readonly transaction_id: string;
  readonly amount: number;
  readonly coin_type: CoinType;
  readonly coin_id: string;
  readonly coin_name: string;
  readonly transaction_status: TransactionStatusEnum;
  readonly sender_wallet_address: string;
  readonly sender_public_key: string;
  readonly transaction_type: TransactionType;
  readonly master_wallet_address: string;
}

export default ITransaction;
