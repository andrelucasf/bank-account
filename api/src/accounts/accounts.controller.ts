import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AuthGuard } from '../auth/auth.guard';
import { EventDto } from './dtos/event.dto';

@Controller('accounts')
@UseGuards(AuthGuard)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get('balance')
  getBalance(@Query('account_id') accountId: string): number {
    const balance = this.accountsService.getBalance(accountId);
    if (balance === null) {
      throw new HttpException('0', HttpStatus.NOT_FOUND);
    }
    return balance;
  }

  @Post('event')
  handleEvent(@Body() event: EventDto) {
    const { type, destination, origin, amount } = event;

    switch (type) {
      case 'deposit':
        if (!destination) {
          throw new HttpException(
            'Destination is required',
            HttpStatus.BAD_REQUEST,
          );
        }
        const newDeposit = this.accountsService.deposit(destination, amount);
        return { destination: newDeposit };

      case 'withdraw':
        if (!origin) {
          throw new HttpException('Origin is required', HttpStatus.BAD_REQUEST);
        }

        const withdrawResult = this.accountsService.withdraw(origin, amount);

        if (!withdrawResult) {
          throw new HttpException('0', HttpStatus.NOT_FOUND);
        }
        return { origin: withdrawResult };

      case 'transfer':
        if (!origin || !destination) {
          throw new HttpException(
            'Origin and destination are required',
            HttpStatus.BAD_REQUEST,
          );
        }
        const transferResult = this.accountsService.transfer(
          origin,
          destination,
          amount,
        );
        if (!transferResult) {
          throw new HttpException('0', HttpStatus.NOT_FOUND);
        }
        return transferResult;

      default:
        throw new HttpException('Invalid event type', HttpStatus.BAD_REQUEST);
    }
  }

  @Post('reset')
  reset() {
    this.accountsService.reset();
    return 'OK';
  }
}
