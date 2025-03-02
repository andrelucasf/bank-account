import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { AuthModule } from '../auth/auth.module';
import { AccountsRepository } from './accounts.repository';

@Module({
  providers: [AccountsService, AccountsRepository],
  controllers: [AccountsController],
  imports: [AuthModule],
})
export class AccountsModule {}
