import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  TWithdrawBRC20WalletRequest,
  TWithdrawBTCWalletRequest,
  TCancelWithdrawalRequest,
} from 'src/core/interfaces/request/wallet.request';
import {
  AuthResponseService,
  ErrorInterface,
} from 'src/core/interfaces/response/reponses';
import { CoinType } from 'src/core/interfaces/entities/transaction/transaction';
import { PayoutService } from 'src/core/services/payout/payout.service';
import IPayout, {
  PayoutStatusEnum,
} from 'src/core/interfaces/entities/payout/payout';

const ERROR_UNABLE_TRANSACTION: ErrorInterface = {
  message: 'unable to cancel your payout request',
  possibleSolution: 'please contact admin to fix this',
};

@Injectable()
export class WithdrawService {
  constructor(private readonly payoutService: PayoutService) {}
  withdrawBtcFromWallet: AuthResponseService<
    TWithdrawBTCWalletRequest,
    IPayout
  > = async ({ amount }, user) => {
    const payoutRequest: Omit<IPayout, '_id'> = {
      amount: amount,
      coin_type: CoinType.BTC,
      coin_name: CoinType.BTC,
      payout_status: PayoutStatusEnum.pending,
      wallet_address: user.wallet_address,
      public_key: user.public_key,
    };

    const transaction = await this.payoutService.createPayout(payoutRequest);

    if (transaction.statusCode !== HttpStatus.OK) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_MODIFIED,
          errors: [ERROR_UNABLE_TRANSACTION],
        },
        transaction.statusCode,
      );
    }

    return transaction;
  };

  withdrawBrc20FromWallet: AuthResponseService<
    TWithdrawBRC20WalletRequest,
    IPayout
  > = async ({ amount, coin_name }, user) => {
    const payoutRequest: Omit<IPayout, '_id'> = {
      amount: amount,
      coin_type: CoinType.BRC20,
      coin_name: coin_name,
      payout_status: PayoutStatusEnum.pending,
      wallet_address: user.wallet_address,
      public_key: user.public_key,
    };

    const payout = await this.payoutService.createPayout(payoutRequest);

    if (payout.statusCode !== HttpStatus.OK) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_MODIFIED,
          errors: [ERROR_UNABLE_TRANSACTION],
        },
        payout.statusCode,
      );
    }
    return payout;
  };

  cancelWithdrawalFromWallet: AuthResponseService<
    TCancelWithdrawalRequest,
    IPayout
  > = async ({ payout_id }) => {
    const payout = await this.payoutService.updatePayoutStatus({
      payout_id,
      payout_status: PayoutStatusEnum.cancelled,
    });

    if (payout.statusCode !== HttpStatus.OK) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_MODIFIED,
          errors: [ERROR_UNABLE_TRANSACTION],
        },
        payout.statusCode,
      );
    }
    return payout;
  };
}
