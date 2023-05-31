import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import {
  CheckIfUserExistRequestDto,
  ConnectWalletRequestDto,
} from 'src/core/interfaces/request/auth.request';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('connect')
  async connectToWallet(
    @Body() request: ConnectWalletRequestDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.connectWalletAddress(request);
    if (user.statusCode === HttpStatus.OK) {
      response.cookie('authorization', user.data.personal.access_token);
      return { statusCode: HttpStatus.OK, data: user.data.toResponse() };
    }
    return user;
  }

  @HttpCode(HttpStatus.OK)
  @Post('validate')
  async checkIfUserExist(@Body() request: CheckIfUserExistRequestDto) {
    return await this.authService.checkIfUserExist(request);
  }
}
