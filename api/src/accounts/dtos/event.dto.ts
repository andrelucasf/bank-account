export interface EventDto {
  type: 'deposit' | 'withdraw' | 'transfer';
  destination?: string;
  origin?: string;
  amount: number;
}
