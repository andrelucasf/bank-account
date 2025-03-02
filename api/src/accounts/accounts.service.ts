import { Injectable } from '@nestjs/common';
import { AccountsRepository } from './accounts.repository';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountsService {
  constructor(private accountsRepository: AccountsRepository) {}

  getBalance(accountId: string): number | null {
    const account = this.accountsRepository.findById(accountId);
    return account ? account.balance : null;
  }

  deposit(destination: string, amount: number): Account {
    let account = this.accountsRepository.findById(destination);
    if (!account) {
      account = new Account(destination, amount);
    } else {
      account.balance += amount;
    }
    this.accountsRepository.save(account);
    return account;
  }

  withdraw(origin: string, amount: number): Account | null {
    const account = this.accountsRepository.findById(origin);
    if (!account || account.balance < amount) {
      return null;
    }
    account.balance -= amount;
    this.accountsRepository.save(account);
    return account;
  }

  transfer(
    origin: string,
    destination: string,
    amount: number,
  ): { origin: Account; destination: Account } | null {
    const originAccount = this.withdraw(origin, amount);
    if (!originAccount) return null;
    const destinationAccount = this.deposit(destination, amount);
    return { origin: originAccount, destination: destinationAccount };
  }

  reset(): void {
    this.accountsRepository.reset();
  }
}
