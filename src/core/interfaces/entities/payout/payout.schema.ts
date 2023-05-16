import { Schema } from 'mongoose';
import * as mongoose from 'mongoose-paginate-v2';
import IPayout, { PayoutStatusEnum } from './payout';

const PayoutSchema = new Schema<IPayout>({
  amount: {
    type: Number,
  },
  coin_type: {
    type: String,
  },
  coin_name: {
    type: String,
  },
  payout_status: {
    type: String,
    enum: Object.values(PayoutStatusEnum),
  },
  wallet_address: {
    type: String,
  },
  public_key: {
    type: String,
  },
});

PayoutSchema.plugin(mongoose);

export { PayoutSchema };
