import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TViewAllMyPayoutRequest } from 'src/core/interfaces/request/payout.request';
import { TViewAllTransactionRequest } from 'src/core/interfaces/request/transaction.request';
import {
  AuthResponseService,
  ErrorInterface,
} from 'src/core/interfaces/response/reponses';
import {
  IPayoutsResponse,
  ITransactionsResponse,
} from 'src/core/interfaces/response/wallet.reponse';
import { PayoutService } from 'src/core/services/payout/payout.service';
import { TransactionService } from 'src/core/services/transaction/transaction.service';
import { UserService } from 'src/core/services/user/user.service';

const ERROR_UNABLE_TO_GET_TRANSACTION: ErrorInterface = {
  message: 'unable to get your transactions from the blockchain',
  possibleSolution: 'please contact admin to fix this',
};

@Injectable()
export class WalletService {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly payoutService: PayoutService,
    private readonly userService: UserService,
  ) {}
  viewAllMyTransaction: AuthResponseService<
    TViewAllTransactionRequest,
    ITransactionsResponse
  > = async ({ page, limit }, user) => {
    const transactions = await this.transactionService.findAllTransactions({
      page,
      limit,
      wallet_address: user.wallet_address,
    });

    if (transactions.statusCode === HttpStatus.OK) {
      return transactions;
    }

    throw new HttpException(
      {
        statusCode: transactions.statusCode,
        errors: [ERROR_UNABLE_TO_GET_TRANSACTION],
      },
      transactions.statusCode,
    );
  };

  viewAllMyPayouts: AuthResponseService<
    TViewAllMyPayoutRequest,
    IPayoutsResponse
  > = async ({ page, limit }, user) => {
    const transactions = await this.payoutService.findAllPayouts({
      page,
      limit,
      wallet_address: user.wallet_address,
    });

    if (transactions.statusCode === HttpStatus.OK) {
      return transactions;
    }

    throw new HttpException(
      {
        statusCode: transactions.statusCode,
        errors: [ERROR_UNABLE_TO_GET_TRANSACTION],
      },
      transactions.statusCode,
    );
  };
}
