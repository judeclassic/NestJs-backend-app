import { Test, TestingModule } from '@nestjs/testing';
import { DepositService } from './deposit/deposit.service';

describe('WalletService', () => {
  let service: DepositService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DepositService],
    }).compile();

    service = module.get<DepositService>(DepositService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
