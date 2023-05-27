import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import {
  TUpdateTransactionRequest,
  TViewAllMyTransactionRequest,
} from 'src/core/interfaces/request/transaction.request';
import { ResponseService } from 'src/core/interfaces/response/reponses';
import { ITransactionsResponse } from 'src/core/interfaces/response/wallet.reponse';
import TransactionDto from 'src/core/interfaces/entities/transaction/transaction.dto';
import ITransaction from 'src/core/interfaces/entities/transaction/transaction';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel('Transaction')
    private readonly transactionModel: PaginateModel<ITransaction>,
  ) {}

  createTransaction: ResponseService<Partial<ITransaction>, TransactionDto> =
    async (transaction: Partial<ITransaction>) => {
      try {
        const dataResponse = await this.transactionModel.create(transaction);
        if (dataResponse) {
          return {
            statusCode: HttpStatus.OK,
            data: new TransactionDto(dataResponse),
          };
        } else {
          return {
            statusCode: HttpStatus.BAD_REQUEST,
            errors: [{ message: "Couldn't create transaction" }],
          };
        }
      } catch (error) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          errors: [{ message: "Couldn't create user" }],
        };
      }
    };

  findTranction: ResponseService<Partial<ITransaction>, TransactionDto> =
    async (transaction: Partial<ITransaction>) => {
      try {
        const dataResponse = await this.transactionModel.findOne(transaction);
        if (dataResponse) {
          const data = new TransactionDto(dataResponse);
          return { statusCode: HttpStatus.OK, data };
        } else {
          return {
            statusCode: HttpStatus.BAD_REQUEST,
            errors: [{ message: "Couldn't get this transaction" }],
          };
        }
      } catch (error) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          errors: [{ message: "Couldn't get this transaction" }],
        };
      }
    };

  findAllTransactions: ResponseService<
    TViewAllMyTransactionRequest,
    ITransactionsResponse
  > = async (searchInfo: TViewAllMyTransactionRequest) => {
    try {
      const option = {
        page: searchInfo.page,
        limit: searchInfo.limit,
      };

      const query = { sender_wallet_address: searchInfo.wallet_address };

      const dataResponse = await this.transactionModel.paginate(query, option);
      if (dataResponse) {
        return {
          statusCode: HttpStatus.OK,
          data: {
            transactions: dataResponse.docs,
            totalTransactions: dataResponse.totalDocs,
            hasNext: dataResponse.hasNextPage,
          },
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          errors: [{ message: "Couldn't get all transaction" }],
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        errors: [{ message: "Couldn't get all transaction" }],
      };
    }
  };

  updateTransaction: ResponseService<
    TUpdateTransactionRequest,
    TransactionDto
  > = async ({ transaction_id, amount, transaction_status }) => {
    try {
      const dataResponse = await this.transactionModel.findOneAndUpdate(
        { transaction_id },
        { transaction_status, amount },
      );
      if (dataResponse) {
        const data = new TransactionDto(dataResponse);
        return { statusCode: HttpStatus.OK, data };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          errors: [{ message: "Couldn't update this transaction" }],
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        errors: [{ message: "Couldn't update this transaction" }],
      };
    }
  };
}
