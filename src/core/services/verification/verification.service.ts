import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { masterWalletsContants } from 'src/core/interfaces/constants';
import {
  CoinType,
  TransactionStatusEnum,
} from 'src/core/interfaces/entities/transaction/transaction';
import {
  VerifyPaymentBlockstreamResponse,
  HiroResponseInterface,
  HiroAmountResponseInterface,
} from 'src/core/interfaces/entities/verification/verification';
class Web3Endpoint {
  static verifyPaymentOnBtcWallet = (tx_id: string) =>
    `https://blockstream.info/api/tx/${tx_id}`;
  static verifyInscriptions = (inscription_id: string) =>
    `https://api.hiro.so/ordinals/v1/inscriptions/${inscription_id}/brc20/ordi/history?start=0&limit=20&type=send`;
  static verifyInscriptionAmount = (inscription_id: string) =>
    `https://api.hiro.so/ordinals/v1/inscriptions/${inscription_id}/transfers`;
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
    inscription_id: string;
    wallet_address: string;
    amount: number;
    coin_name: string;
  }) => {
    try {
      const endpoint = `${Web3Endpoint.verifyInscriptions(
        request.inscription_id,
      )}`;

      const paymentResult = await axios.get(endpoint);

      const inscriptionData: HiroResponseInterface = paymentResult.data;
      if (inscriptionData?.results.length < 1) {
        throw new HttpException(
          { message: 'empty inscription during verification' },
          HttpStatus.NOT_ACCEPTABLE,
        );
      }

      const transaction = inscriptionData?.results?.find(
        (tran) => tran.address === masterWalletsContants[0],
      );

      if (!transaction) {
        return {
          statusCode: HttpStatus.NOT_ACCEPTABLE,
          errors: [
            {
              message: 'this transaction was not sent to the master wallet',
            },
          ],
        };
      }

      const amountEndpoint = `${Web3Endpoint.verifyInscriptionAmount(
        request.inscription_id,
      )}`;

      const amountPaymentResult = await axios.get(amountEndpoint);

      const amountInscriptionData: HiroAmountResponseInterface =
        amountPaymentResult.data;

      return {
        data: {
          amount: amountInscriptionData.amt,
          message: 'transaction was successful',
          status: TransactionStatusEnum.successful,
          master_wallet: masterWalletsContants[0],
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

  // verifyTransaction = (request: {
  //   transaction_id: string;
  //   wallet_address: string;
  //   amount: number;
  //   coin_name: string;
  // }) => {
  //   if (request.coin_name === CoinType.BTC) {
  //     return this.verifyPaymentOnBtcWallet(request);
  //   }
  //   return this.verifyPaymentOnBRC20(request);
  // };

  private convertSatoshiToBitcoin = (satoshiValue: number) => {
    const bitCoinEstimation = satoshiValue / 1000000;
    return bitCoinEstimation;
  };
}
