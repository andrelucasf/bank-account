import { Account } from './entities/account.entity';

export class AccountsRepository {
  private accounts: Map<string, Account> = new Map();

  findById(accountId: string): Account | null {
    return this.accounts.get(accountId) || null;
  }

  save(account: Account): void {
    this.accounts.set(account.id, account);
  }

  reset(): void {
    this.accounts.clear();
  }
}
