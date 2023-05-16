import { CoinType } from '../transaction/transaction';
import IPayout, { PayoutStatusEnum } from './payout';

class PayoutDto implements IPayout {
  readonly _id: string;
  readonly transaction_id: string;
  readonly amount: number;
  readonly coin_type: CoinType;
  readonly coin_name: string;
  payout_status: PayoutStatusEnum;
  readonly wallet_address: string;
  readonly public_key: string;

  constructor(payout: IPayout) {
    this._id = payout._id;
    this.amount = payout.amount;
    this.coin_type = payout.coin_type;
    this.coin_name = payout.coin_name;
    this.payout_status = payout.payout_status;
    this.wallet_address = payout.wallet_address;
    this.public_key = payout.public_key;
  }

  toResponse = () => {
    return {
      _id: this._id,
      amount: this.amount,
      coin_type: this.coin_type,
      coin_name: this.coin_name,
      wallet_address: this.wallet_address,
      payout_status: this.payout_status,
    } as IPayout;
  };
}

export default PayoutDto;
