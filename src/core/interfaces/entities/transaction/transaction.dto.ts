import { ITransactionForEvent } from '../../response/wallet.reponse';
import ITransaction, {
  CoinType,
  TransactionStatusEnum,
  TransactionType,
} from './transaction';

class TransactionDto implements ITransaction {
  readonly _id: string;
  readonly transaction_id: string;
  readonly amount: number;
  readonly coin_type: CoinType;
  readonly coin_name: string;
  transaction_status: TransactionStatusEnum;
  readonly transaction_type: TransactionType;
  readonly sender_wallet_address: string;
  readonly sender_public_key: string;
  readonly master_wallet_address: string;

  constructor(trasaction: ITransaction) {
    this._id = trasaction._id;
    this.transaction_id = trasaction.transaction_id;
    this.amount = trasaction.amount;
    this.coin_type = trasaction.coin_type;
    this.coin_name = trasaction.coin_name;
    this.transaction_status = trasaction.transaction_status;
    this.transaction_type = trasaction.transaction_type;
    this.sender_wallet_address = trasaction.sender_wallet_address;
    this.sender_public_key = trasaction.sender_public_key;
    this.master_wallet_address = trasaction.master_wallet_address;
  }

  toResponse = () => {
    return {
      _id: this._id,
      transaction_id: this.transaction_id,
      amount: this.amount,
      coin_type: this.coin_type,
      coin_name: this.coin_name,
      sender_wallet_address: this.sender_wallet_address,
      transaction_type: this.transaction_type,
      sender_public_key: this.sender_public_key,
      master_wallet_address: this.master_wallet_address,
    } as ITransaction;
  };

  toResponseForEvent = () => {
    return {
      _id: this._id,
      transaction_id: this.transaction_id,
      amount: this.amount,
      coin_type: this.coin_type,
      coin_name: this.coin_name,
      sender_wallet_address: this.sender_wallet_address,
      transaction_type: this.transaction_type,
      sender_public_key: this.sender_public_key,
      master_wallet_address: this.master_wallet_address,
    } as ITransactionForEvent;
  };
}

export default TransactionDto;
