import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { TViewAllMyTransactionRequest } from 'src/core/interfaces/request/transaction.request';
import {
  CancelWithdrawalRequestDto,
  FundBTCWalletRequestDto,
  FundOtherWalletRequestDto,
  WithdrawBTCWalletRequestDto,
  WithdrawBRC20WalletRequestDto,
} from 'src/core/interfaces/request/wallet.request';
import { EncryptionService } from 'src/core/services/encryption/encryption.service';
import { UserService } from 'src/core/services/user/user.service';
import { DepositService } from '../service/deposit/deposit.service';
import { WalletService } from '../service/wallet.service';
import { WithdrawService } from '../service/withdraw/withdraw.service';

@Controller('wallet')
export class WalletController {
  constructor(
    private readonly depositService: DepositService,
    private readonly userService: UserService,
    private readonly withdrawService: WithdrawService,
    private readonly walletServive: WalletService,
    private readonly encryptionService: EncryptionService,
  ) {}

  @Get('')
  async getWalletInformation(@Req() request: Request) {
    const jwToken = request.headers.authorization;
    const authUser = this.encryptionService.verifyBearerToken(jwToken);
    const userInformation = await this.userService.findOneByWalletAddress(
      authUser.wallet_address,
    );
    if (userInformation.statusCode === HttpStatus.OK) {
      return {
        statusCode: userInformation.statusCode,
        data: userInformation.data.toNormalResponse(),
      };
    }
    return userInformation;
  }

  @Post('fund-btc')
  async fundBtcWallet(
    @Body() requestBody: FundBTCWalletRequestDto,
    @Req() request: Request,
  ) {
    const jwToken = request.headers.authorization;
    const authUser = this.encryptionService.verifyBearerToken(jwToken);
    return this.depositService.fundBtcWallet(requestBody, authUser);
  }

  @Post('fund-brc-20')
  async fundBRC20Wallet(
    @Body() requestBody: FundOtherWalletRequestDto,
    @Req() request: Request,
  ) {
    const jwToken = request.headers.authorization;
    const authUser = this.encryptionService.verifyBearerToken(jwToken);
    return this.depositService.fundBRC20Wallet(requestBody, authUser);
  }

  @Post('withdraw-btc')
  async withdrawBtcFromWallet(
    @Body() requestBody: WithdrawBTCWalletRequestDto,
    @Req() request: Request,
  ) {
    const jwToken = request.headers.authorization;
    const authUser = this.encryptionService.verifyBearerToken(jwToken);
    return this.withdrawService.withdrawBtcFromWallet(requestBody, authUser);
  }

  @Post('withdraw-brc-20')
  async withdrawBrc20FromWallet(
    @Body() requestBody: WithdrawBRC20WalletRequestDto,
    @Req() request: Request,
  ) {
    const jwToken = request.headers.authorization;
    const authUser = this.encryptionService.verifyBearerToken(jwToken);
    return this.withdrawService.withdrawBrc20FromWallet(requestBody, authUser);
  }

  @Post('cancel-withdraw')
  async cancelMyPayout(
    @Body() requestBody: CancelWithdrawalRequestDto,
    @Req() request: Request,
  ) {
    const jwToken = request.headers.authorization;
    const authUser = this.encryptionService.verifyBearerToken(jwToken);
    return this.withdrawService.cancelWithdrawalFromWallet(
      requestBody,
      authUser,
    );
  }

  @Get('payouts')
  async viewAllMyPayouts(
    @Query() requestBody: TViewAllMyTransactionRequest,
    @Req() request: Request,
  ) {
    const jwToken = request.headers.authorization;
    const authUser = this.encryptionService.verifyBearerToken(jwToken);
    return this.walletServive.viewAllMyPayouts(requestBody, authUser);
  }

  @Get('transactions')
  async viewAllMyTransaction(
    @Query() requestBody: TViewAllMyTransactionRequest,
    @Req() request: Request,
  ) {
    const jwToken = request.headers.authorization;
    const authUser = this.encryptionService.verifyBearerToken(jwToken);
    return this.walletServive.viewAllMyTransaction(requestBody, authUser);
  }
}
