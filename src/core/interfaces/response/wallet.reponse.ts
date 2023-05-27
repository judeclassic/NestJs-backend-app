import IPayout from '../entities/payout/payout';
import ITransaction from '../entities/transaction/transaction';

export interface ITransactionsResponse {
  transactions: ITransaction[];
  totalTransactions: number;
  hasNext: boolean;
}
export type ITransactionForEvent = ITransaction;

export interface IPayoutsResponse {
  payouts: IPayout[];
  totalPayouts: number;
  hasNext: boolean;
}
