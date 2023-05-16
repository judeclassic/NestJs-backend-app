import { Schema } from 'mongoose';
import * as mongoose from 'mongoose-paginate-v2';
import ITransaction, {
  TransactionStatusEnum,
  TransactionType,
} from './transaction';

const TransactionSchema = new Schema<ITransaction>({
  transaction_id: {
    type: String,
  },
  amount: {
    type: Number,
  },
  coin_type: {
    type: String,
  },
  coin_name: {
    type: String,
  },
  transaction_status: {
    type: String,
    enum: Object.values(TransactionStatusEnum),
  },
  transaction_type: {
    type: String,
    enum: Object.values(TransactionType),
  },
  sender_wallet_address: {
    type: String,
  },
  sender_public_key: {
    type: String,
  },
  master_wallet_address: {
    type: String,
  },
});

TransactionSchema.plugin(mongoose);

export { TransactionSchema };
