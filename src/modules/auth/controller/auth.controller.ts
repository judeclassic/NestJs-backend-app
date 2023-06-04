import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  OnModuleInit,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { UserEventEnum } from 'src/core/interfaces/event';
import {
  CheckIfUserExistRequestDto,
  ConnectWalletRequestDto,
} from 'src/core/interfaces/request/auth.request';
import { ConsumerService } from 'src/core/services/kafka/consumer/consumer.service';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController implements OnModuleInit {
  constructor(
    private readonly consumerService: ConsumerService,
    private readonly authService: AuthService,
  ) {}

  async onModuleInit() {
    this.consumerService.consume({
      topic: { topics: [UserEventEnum.update_user] },
      config: { groupId: 'satsswap-group' },
      onMessage: async (message) => {
        const user = JSON.parse(message.value.toString());
        this.authService.updateUser(user);
      },
    });
  }

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
