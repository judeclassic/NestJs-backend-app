import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { ResponseService } from 'src/core/interfaces/response/reponses';
import { IPayoutsResponse } from 'src/core/interfaces/response/wallet.reponse';
import IPayout from 'src/core/interfaces/entities/payout/payout';
import PayoutDto from 'src/core/interfaces/entities/payout/payout.dto';
import { TViewAllMyPayoutRequest } from 'src/core/interfaces/request/payout.request';
import { TChangePayoutStatusRequest } from 'src/core/interfaces/request/wallet.request';

@Injectable()
export class PayoutService {
  constructor(
    @InjectModel('Payout')
    private readonly payoutModel: PaginateModel<IPayout>,
  ) {}

  createPayout: ResponseService<Partial<IPayout>, PayoutDto> = async (
    transaction: Partial<IPayout>,
  ) => {
    try {
      const dataResponse = await this.payoutModel.create(transaction);
      if (dataResponse) {
        return {
          statusCode: HttpStatus.OK,
          data: new PayoutDto(dataResponse),
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
        errors: [{ message: "Couldn't create payout" }],
      };
    }
  };

  findPayout: ResponseService<Partial<IPayout>, PayoutDto> = async (
    transaction: Partial<IPayout>,
  ) => {
    try {
      const dataResponse = await this.payoutModel.findOne(transaction);
      console.log(dataResponse);
      if (dataResponse) {
        const data = new PayoutDto(dataResponse);
        return { statusCode: HttpStatus.OK, data };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          errors: [{ message: "Couldn't get this payout" }],
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        errors: [{ message: "Couldn't get this payout" }],
      };
    }
  };

  findAllPayouts: ResponseService<TViewAllMyPayoutRequest, IPayoutsResponse> =
    async (searchInfo) => {
      try {
        const option = {
          page: searchInfo.page,
          limit: searchInfo.limit,
        };

        const query = { wallet_address: searchInfo.wallet_address };

        const dataResponse = await this.payoutModel.paginate(query, option);
        if (dataResponse) {
          return {
            statusCode: HttpStatus.OK,
            data: {
              payouts: dataResponse.docs,
              totalPayouts: dataResponse.totalDocs,
              hasNext: dataResponse.hasNextPage,
            },
          };
        } else {
          return {
            statusCode: HttpStatus.BAD_REQUEST,
            errors: [{ message: "Couldn't get all payouts" }],
          };
        }
      } catch (error) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          errors: [{ message: "Couldn't get all payouts" }],
        };
      }
    };

  updatePayoutStatus: ResponseService<TChangePayoutStatusRequest, IPayout> =
    async ({ payout_id, payout_status }) => {
      try {
        const dataResponse = await this.payoutModel.findOneAndUpdate(
          { _id: payout_id },
          { payout_status },
        );
        if (dataResponse) {
          const payout = new PayoutDto(dataResponse);
          return {
            statusCode: HttpStatus.OK,
            data: payout,
          };
        } else {
          return {
            statusCode: HttpStatus.BAD_REQUEST,
            errors: [{ message: "Couldn't change status of payout" }],
          };
        }
      } catch (error) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          errors: [{ message: "Couldn't change status of payout" }],
        };
      }
    };
}
