import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  TFundBTCWalletRequest,
  TFundOtherWalletRequest,
} from 'src/core/interfaces/request/wallet.request';
import {
  AuthResponseService,
  ErrorInterface,
  ResponseService,
} from 'src/core/interfaces/response/reponses';
import ITransaction, {
  CoinType,
  TransactionStatusEnum,
  TransactionType,
} from 'src/core/interfaces/entities/transaction/transaction';
import { TransactionService } from 'src/core/services/transaction/transaction.service';
import { UserService } from 'src/core/services/user/user.service';
import { TUpdateTransactionRequest } from 'src/core/interfaces/request/transaction.request';
import TransactionDto from 'src/core/interfaces/entities/transaction/transaction.dto';
import { UserEventEnum } from 'src/core/interfaces/event';
import { ITransactionForEvent } from 'src/core/interfaces/response/wallet.reponse';
import { ProducerService } from 'src/core/services/kafka/producer/kafka.service';
import { VerificationService } from 'src/core/services/verification/verification.service';

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
    private readonly producerService: ProducerService,
    private readonly verificationService: VerificationService,
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

      const verifiedTransaction =
        await this.verificationService.verifyPaymentOnBtcWallet({
          transaction_id: transaction_id,
          wallet_address: user.wallet_address,
          amount: amount,
        });

      if (verifiedTransaction.statusCode !== HttpStatus.OK) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            errors: verifiedTransaction.errors,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const transactionRequest: Omit<ITransaction, '_id'> = {
        transaction_id,
        amount: amount,
        coin_type: CoinType.BTC,
        coin_name: CoinType.BTC,
        transaction_status: verifiedTransaction.data.status,
        sender_wallet_address: user.wallet_address,
        transaction_type: TransactionType.deposit,
        sender_public_key: user.public_key,
        master_wallet_address: verifiedTransaction.data.master_wallet,
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

      this.producerService.sendMessage<ITransactionForEvent>(
        UserEventEnum.user_deposited,
        transaction.data.toResponseForEvent(),
      );

      return transaction;
    };

  fundBRC20Wallet: AuthResponseService<
    TFundOtherWalletRequest,
    TransactionDto
  > = async ({ transaction_id, amount, coin_name }, user) => {
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

    const verifiedTransaction =
      await this.verificationService.verifyPaymentOnBRC20({
        transaction_id: transaction_id,
        wallet_address: user.wallet_address,
        amount: amount,
        coin_name,
      });

    if (verifiedTransaction.statusCode !== HttpStatus.OK) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          errors: verifiedTransaction.errors,
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

    this.producerService.sendMessage<ITransactionForEvent>(
      UserEventEnum.user_deposited,
      transaction.data.toResponseForEvent(),
    );

    // this.userService.updateOtherWalletPendingAmount(
    //   { wallet_address: user.wallet_address, coin_name },
    //   { amount: transaction.data.amount },
    // );

    return transaction;
  };

  updateTransactionStatus: ResponseService<
    TUpdateTransactionRequest,
    ITransaction
  > = async ({
    transaction_id,
    amount,
    transaction_status,
    wallet_address,
  }) => {
    if (transaction_status === TransactionStatusEnum.failed) {
      const transaction = await this.transactionService.updateTransaction({
        wallet_address,
        transaction_id,
        amount,
        transaction_status,
      });

      if (transaction.statusCode !== HttpStatus.OK) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_MODIFIED,
            errors: [ERROR_UNABLE_TRANSACTION],
          },
          transaction.statusCode,
        );
      }
      this.userService.updateBTCWalletPendingAmount(wallet_address, {
        amount: 0,
      });

      return transaction;
    }

    if (transaction_status === TransactionStatusEnum.successful) {
      const transaction = await this.transactionService.updateTransaction({
        wallet_address,
        transaction_id,
        amount,
        transaction_status,
      });

      if (transaction.statusCode !== HttpStatus.OK) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_MODIFIED,
            errors: [ERROR_UNABLE_TRANSACTION],
          },
          transaction.statusCode,
        );
      }
      this.userService.updateBTCWalletPendingAmount(wallet_address, {
        amount: 0,
      });

      return transaction;
    }
  };
}
