import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TConnectWalletRequest } from 'src/core/interfaces/request/auth.request';
import { ResponseService } from 'src/core/interfaces/response/reponses';
import {
  IUser,
  IWalletInformation,
} from 'src/core/interfaces/entities/user/user';
import {
  UserDTO,
  WalletInformationDto,
} from 'src/core/interfaces/entities/user/user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<IUser>) {}

  createAccount: ResponseService<TConnectWalletRequest, UserDTO> = async ({
    wallet_address,
    passkey,
    public_key,
  }) => {
    const btc_wallet = new WalletInformationDto(
      {} as IWalletInformation,
    ).fromInitialWalletInformation();
    try {
      const createdUser = await this.userModel.create({
        personal: { wallet_address, passkey, public_key },
        btc_wallet,
      });

      if (!createdUser) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          errors: [{ message: 'unable to create user' }],
        };
      }

      return { statusCode: HttpStatus.OK, data: new UserDTO(createdUser) };
    } catch (_err) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        errors: [{ message: 'unable to create user' }],
      };
    }
  };

  findOneByWalletAddress: ResponseService<string, UserDTO> = async (
    wallet_address: string,
  ) => {
    const foundUser = await this.userModel.findOne({
      'personal.wallet_address': wallet_address,
    });

    if (!foundUser) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        errors: [{ message: 'user not found' }],
      };
    }

    return { statusCode: HttpStatus.OK, data: new UserDTO(foundUser) };
  };

  updateBTCWalletPendingAmount = async (
    wallet_address: string,
    account: { amount: number },
  ) => {
    try {
      const dataResponse = await this.userModel.findOneAndUpdate(
        {
          'personal.wallet_address': wallet_address,
        },
        { 'btc_wallet.pending_balance': account.amount },
        { new: true },
      );
      if (dataResponse) {
        const data = new UserDTO(dataResponse);
        return { status: true as const, data };
      } else {
        return { status: false as const, error: "Couldn't update user" };
      }
    } catch (error) {
      return {
        status: false as const,
        error: (error ?? 'Unable to save user information to DB') as string,
      };
    }
  };

  updateBTCWalletMainAmount = async (
    wallet_address: string,
    account: { amount: number },
  ) => {
    try {
      const dataResponse = await this.userModel.findOne({
        'personal.wallet_address': wallet_address,
      });
      if (dataResponse) {
        dataResponse.btc_wallet.account_balance = account.amount;
        const response = await dataResponse.save();
        const data = new UserDTO(response);
        return { status: true as const, data };
      } else {
        return { status: false as const, error: "Couldn't update user" };
      }
    } catch (error) {
      return {
        status: false as const,
        error: (error ?? 'Unable to save user information to DB') as string,
      };
    }
  };

  updateOtherWalletPendingAmount = async (
    searchedInfo: { wallet_address: string; coin_name: string },
    account: { amount: number },
  ) => {
    try {
      const dataResponse = await this.userModel.findOne({
        'personal.wallet_address': searchedInfo.wallet_address,
      });
      if (dataResponse) {
        const indexOfFindings = dataResponse.other_wallets.findIndex(
          (wallet) => wallet.coin_name === searchedInfo.coin_name,
        );
        if (indexOfFindings >= 0) {
          dataResponse.other_wallets[indexOfFindings].pending_balance +=
            account.amount;
        } else {
          console.log('Not me', indexOfFindings);
          dataResponse.other_wallets.push({
            account_balance: 0,
            pending_balance: account.amount,
            network: '',
            coin_name: searchedInfo.coin_name,
            coin_id: '',
          });
        }
        await dataResponse.save();
        const data = new UserDTO(dataResponse);
        return { status: true as const, data };
      } else {
        return { status: false as const, error: "Couldn't update user" };
      }
    } catch (error) {
      console.log(error);
      return {
        status: false as const,
        error: (error ?? 'Unable to save user information to DB') as string,
      };
    }
  };

  updateOtherWalletMainAmount = async (
    searchedInfo: { wallet_address: string; coin_name: string },
    account: { amount: number },
  ) => {
    try {
      const dataResponse = await this.userModel.findOne({
        'personal.wallet_address': searchedInfo.wallet_address,
      });
      if (dataResponse) {
        const indexOfFindings = dataResponse.other_wallets.findIndex(
          (wallet) => wallet.coin_name === searchedInfo.coin_name,
        );
        if (indexOfFindings < 0) {
          dataResponse.other_wallets[indexOfFindings].account_balance =
            account.amount;
        } else {
          dataResponse.other_wallets.push({
            account_balance: account.amount,
            pending_balance: 0,
            network: '',
            coin_name: searchedInfo.coin_name,
            coin_id: '',
          });
        }
        await dataResponse.save();
        const data = new UserDTO(dataResponse);
        return { status: true as const, data };
      } else {
        return { status: false as const, error: "Couldn't update user" };
      }
    } catch (error) {
      return {
        status: false as const,
        error: (error ?? 'Unable to save user information to DB') as string,
      };
    }
  };
}
