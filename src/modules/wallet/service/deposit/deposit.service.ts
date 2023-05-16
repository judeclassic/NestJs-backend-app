import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  TFundBTCWalletRequest,
  TFundOtherWalletRequest,
} from 'src/core/interfaces/request/wallet.request';
import {
  AuthResponseService,
  ErrorInterface,
} from 'src/core/interfaces/response/reponses';
import ITransaction, {
  CoinType,
  TransactionStatusEnum,
  TransactionType,
} from 'src/core/interfaces/entities/transaction/transaction';
import { TransactionService } from 'src/core/services/transaction/transaction.service';
import { UserService } from 'src/core/services/user/user.service';

const ERROR_UNABLE_TRANSACTION: ErrorInterface = {
  message: 'unable to save your transaction on the blockchain',
  possibleSolution: 'please contact admin to fix this',
};

const ERROR_DUPLICATED_TRANSACTION: ErrorInterface = {
  message: 'this transaction is duplicated',
  possibleSolution: 'if this transaction is not duplicated contact admin',
};

@Injectable()
export class DepositService {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly userService: UserService,
  ) {}
  fundBtcWallet: AuthResponseService<TFundBTCWalletRequest, ITransaction> =
    async ({ transaction_id, amount }, user) => {
      const isExisting = await this.transactionService.findTranction({
        transaction_id,
      });

      if (isExisting.statusCode === HttpStatus.OK) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_MODIFIED,
            errors: [ERROR_DUPLICATED_TRANSACTION],
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const transactionRequest: Omit<ITransaction, '_id'> = {
        transaction_id,
        amount: amount,
        coin_type: CoinType.BTC,
        coin_name: CoinType.BTC,
        transaction_status: TransactionStatusEnum.pending,
        sender_wallet_address: user.wallet_address,
        transaction_type: TransactionType.deposit,
        sender_public_key: user.public_key,
        master_wallet_address: '',
      };

      const transaction = await this.transactionService.createTransaction(
        transactionRequest,
      );

      if (transaction.statusCode !== HttpStatus.OK) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_MODIFIED,
            errors: [ERROR_UNABLE_TRANSACTION],
          },
          transaction.statusCode,
        );
      }

      this.userService.updateBTCWalletPendingAmount(user.wallet_address, {
        amount: transaction.data.amount,
      });

      return transaction;
    };

  fundBRC20Wallet: AuthResponseService<TFundOtherWalletRequest, ITransaction> =
    async ({ transaction_id, amount, coin_name }, user) => {
      const isExisting = await this.transactionService.findTranction({
        transaction_id,
      });

      if (isExisting.statusCode === HttpStatus.OK) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_MODIFIED,
            errors: [ERROR_DUPLICATED_TRANSACTION],
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      const transactionRequest: Omit<ITransaction, '_id'> = {
        transaction_id,
        amount: amount,
        coin_type: CoinType.BRC20,
        coin_name,
        transaction_status: TransactionStatusEnum.pending,
        sender_wallet_address: user.wallet_address,
        transaction_type: TransactionType.deposit,
        sender_public_key: user.public_key,
        master_wallet_address: '',
      };

      const transaction = await this.transactionService.createTransaction(
        transactionRequest,
      );

      if (transaction.statusCode !== HttpStatus.OK) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_MODIFIED,
            errors: [ERROR_UNABLE_TRANSACTION],
          },
          transaction.statusCode,
        );
      }

      this.userService.updateBTCWalletPendingAmount(user.wallet_address, {
        amount: transaction.data.amount,
      });
      return transaction;
    };
}
