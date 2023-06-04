import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { masterWalletsContants } from 'src/core/interfaces/constants';
import {
  CoinType,
  TransactionStatusEnum,
} from 'src/core/interfaces/entities/transaction/transaction';
import {
  VerifyPaymentBlockstreamResponse,
  VerifyPaymentUnisatResponse,
} from 'src/core/interfaces/entities/verification/verification';
class Web3Endpoint {
  static verifyPaymentOnBtcWallet = (wallet_address: string) =>
    `https://blockstream.info/api/tx/${wallet_address}`;
  static verifyPaymentOnOtherWallet = (wallet_address: string) =>
    `https://unisat.io/brc20-api-v2/address/${wallet_address}/brc20/ordi/history?start=0&limit=20&type=send`;
}

@Injectable()
export class VerificationService {
  verifyPaymentOnBtcWallet = async (request: {
    transaction_id: string;
    wallet_address: string;
    amount: number;
  }) => {
    try {
      const endpoint = Web3Endpoint.verifyPaymentOnBtcWallet(
        request.wallet_address,
      );
      const paymentResult = await axios.get(endpoint);
      const inscriptionData: VerifyPaymentBlockstreamResponse =
        paymentResult.data;
      if (!inscriptionData.status) {
        return {
          statusCode: HttpStatus.NOT_ACCEPTABLE,
          errors: [
            {
              message: 'Invalid wallet address could not fetch info',
            },
          ],
        };
      }
      const senderWalletAddress = inscriptionData.vout[0].scriptpubkey_address;
      const recieverWalletAddress =
        inscriptionData.vout[1].scriptpubkey_address;
      const transactionStatus = inscriptionData.status.confirmed
        ? TransactionStatusEnum.successful
        : TransactionStatusEnum.processing;
      const amountSent = this.convertSatoshiToBitcoin(
        inscriptionData.vout[1].value,
      );

      if (senderWalletAddress !== request.wallet_address) {
        return {
          statusCode: HttpStatus.NOT_ACCEPTABLE,
          errors: [
            {
              message:
                'this transaction was not performed by this account wallet address',
            },
          ],
        };
      }

      if (
        !masterWalletsContants.find(
          (masterWallet) => masterWallet === recieverWalletAddress,
        )
      ) {
        return {
          statusCode: HttpStatus.NOT_ACCEPTABLE,
          errors: [
            {
              message: 'this transaction was not sent to your internal wallet',
            },
          ],
        };
      }

      return {
        statusCode: HttpStatus.OK as HttpStatus.OK,
        data: {
          amount: amountSent,
          message: 'string',
          status: transactionStatus,
          master_wallet: recieverWalletAddress,
        },
      };
    } catch (err) {
      return {
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        errors: [{ message: 'Invalid information could not validate' }],
      };
    }
  };

  verifyPaymentOnBRC20 = async (request: {
    transaction_id: string;
    wallet_address: string;
    amount: number;
    coin_name: string;
  }) => {
    try {
      const endpoint = `${Web3Endpoint.verifyPaymentOnOtherWallet(
        request.wallet_address,
      )}`;

      const paymentResult = await axios.get(endpoint);

      const inscriptionData: VerifyPaymentUnisatResponse = paymentResult.data;
      if (inscriptionData.msg !== 'ok') {
        throw new HttpException(
          { message: 'verification request was not successful contact admin' },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const transaction = inscriptionData?.data?.detail?.find(
        (tran) => tran.txid === request.transaction_id,
      );
      if (!transaction) {
        return {
          statusCode: HttpStatus.NOT_ACCEPTABLE,
          errors: [
            {
              message:
                'this transaction was not performed by this account wallet address',
            },
          ],
        };
      }

      const master_wallet = masterWalletsContants.find(
        (master_wallet) => master_wallet === transaction.to,
      );

      if (!master_wallet) {
        return {
          statusCode: HttpStatus.NOT_ACCEPTABLE,
          errors: [
            {
              message: 'this transaction was not sent to your internal wallet',
            },
          ],
        };
      }
      return {
        data: {
          amount: transaction.amount,
          message: 'transaction was successful',
          status: TransactionStatusEnum.successful,
          master_wallet,
        },
        statusCode: HttpStatus.OK as HttpStatus.OK,
      };
    } catch (err) {
      return {
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        errors: [{ message: 'Invalid information could not validate' }],
      };
    }
  };

  verifyTransaction = (request: {
    transaction_id: string;
    wallet_address: string;
    amount: number;
    coin_name: string;
  }) => {
    if (request.coin_name === CoinType.BTC) {
      return this.verifyPaymentOnBtcWallet(request);
    }
    return this.verifyPaymentOnBRC20(request);
  };

  private convertSatoshiToBitcoin = (satoshiValue: number) => {
    const bitCoinEstimation = satoshiValue / 1000000;
    return bitCoinEstimation;
  };
}
